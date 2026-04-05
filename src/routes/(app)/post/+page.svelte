<script lang="ts">
    import { page } from "$app/stores";
    import PostDisplay from "$lib/components/PostDisplay.svelte";
    import type { Comment, Post } from "$lib/server/db/schema";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    export let data: any; // Replace with actual type if needed

    let post: Post | null = null;
    let loading = true;
    let err: string | null = null;
    let comments: Comment[] = [];
    let commentContent = "";
    let editingCommentId: string | null = null;
    let userComment: any = null;
    let submitting = false;
    let id: string | null = null;

    // Simulate user (replace with real user from session in prod)
    // let user = { id: 'test-user', name: 'Test User' };

    onMount(async () => {
        id = get(page).url.searchParams.get("id");
        try {
            // Fetch the post
            const res = await fetch(`/api/posts?id=${id}`);
            if (!res.ok) throw new Error("Failed to load post");
            const posts = await res.json();
            post = Array.isArray(posts)
                ? posts.find((p) => p.id === id)
                : posts;
            if (!post) throw new Error("Post not found");

            await loadComments();
        } catch (e) {
            err = (e as Error).message;
        } finally {
            loading = false;
        }
    });

    async function loadComments() {
        const cRes = await fetch(`/api/comments?post_id=${id}`);
        if (cRes.ok) {
            comments = await cRes.json();
            // Find if the user already commented (replace with real user id)
            // userComment = comments.find(c => c.user_id === user.id);
            // For now, just allow editing the first comment if logged in
            userComment = comments.find((c) => c.user_id === data?.user?.id);
        }
    }

    async function submitComment() {
        submitting = true;
        try {
            const method = editingCommentId ? "PATCH" : "POST";
            const body = editingCommentId
                ? { id: editingCommentId, content: commentContent }
                : { post_id: id, content: commentContent };
            const res = await fetch("/api/comments", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to submit comment");
            commentContent = "";
            editingCommentId = null;
            await loadComments();
        } catch (e) {
            alert((e as Error).message);
        } finally {
            submitting = false;
        }
    }

    function startEdit(comment: Comment) {
        editingCommentId = comment.id;
        commentContent = comment.content;
    }

    async function deleteComment(id: string) {
        if (!confirm("Delete your comment?")) return;
        const res = await fetch("/api/comments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            commentContent = "";
            editingCommentId = null;
            await loadComments();
        }
    }

    async function voteComment(id: string, vote: "up" | "down") {
        const res = await fetch("/api/comments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, vote }),
        });
        if (res.ok) {
            await loadComments();
        }
    }

    let liking = false;
    let liked = false;
    async function likePost() {
        if (!post) return;
        if (!data?.user) return alert("Login to like!");
        liking = true;
        try {
            const res = await fetch("/api/posts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id, like: true }),
            });
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    post.likes = (post.likes ?? 0) + 1;
                    liked = true;
                } else if (result.message === "Already liked") {
                    alert("You have already liked this post.");
                }
            }
        } finally {
            liking = false;
        }
    }
</script>

<main>
    {#if loading}
        <p>Loading post...</p>
    {:else if err}
        <p class="error">{err}</p>
    {:else if post}
        <PostDisplay {post} />
        <!-- <div class="metadata glass">
            <h1>{post.title} <small>{post.subtitle ? " - " + post.subtitle : "" }</small></h1>
            <div class="meta">
                <span>Published: {post.date_published ? new Date(post.date_published).toLocaleDateString() : 'Unknown'}</span>
                <span>Author: {post.author_id}</span>
                <span>Views: {post.view_count ?? 0}</span>
                <span>Tags: {post.tags}</span>
            </div>
        </div>
        <div class="post-content glass"><div class="post">{@html post.content_html}</div></div> -->
        <div class="reactions glass">
            <div class="like-row">
                <h3>Reactions & Comments</h3>
                <button
                    class:liked
                    class="like-btn"
                    aria-label="Like this post"
                    on:click={likePost}
                    disabled={liking || !data?.user || liked}
                >
                    <i class="fa fa-heart"></i>
                    <span>{Number(post.likes ?? 0) || 0}</span>
                </button>
            </div>
            {#if data?.user && !comments.some((c) => c.user_id === data.user.id)}
                <!-- Comment form -->
                <form
                    on:submit|preventDefault={submitComment}
                    class="comment-form"
                >
                    <textarea
                        bind:value={commentContent}
                        placeholder="Write your comment..."
                        rows="3"
                        maxlength="2000"
                        required
                        disabled={submitting}
                    ></textarea>
                    <div class="comment-actions">
                        <button
                            type="submit"
                            disabled={submitting || !commentContent.trim()}
                        >
                            {editingCommentId ? "Update" : "Post"} Comment
                        </button>
                        {#if editingCommentId}
                            <button
                                type="button"
                                on:click={() => {
                                    editingCommentId = null;
                                    commentContent = "";
                                }}
                            >
                                Cancel
                            </button>
                        {/if}
                    </div>
                </form>
            {/if}
            {#if comments.length === 0}
                <p>No reactions yet.</p>
            {:else}
                <ul>
                    {#each comments as comment}
                        <li>
                            <strong>{comment.user_id}</strong>
                            <span class="comment-date"
                                >({new Date(
                                    comment.date_created as string,
                                ).toLocaleString()})</span
                            >:
                            <br />
                            <span>{comment.content}</span>
                            <div class="comment-votes">
                                <button
                                    title="Upvote"
                                    on:click={() =>
                                        voteComment(comment.id, "up")}
                                    >▲ {comment.upvotes ?? 0}</button
                                >
                                <button
                                    title="Downvote"
                                    on:click={() =>
                                        voteComment(comment.id, "down")}
                                    >▼ {comment.downvotes ?? 0}</button
                                >
                                {#if data?.user?.id === comment.user_id}
                                    <button on:click={() => startEdit(comment)}
                                        >Edit</button
                                    >
                                    <button
                                        on:click={() =>
                                            deleteComment(comment.id)}
                                        >Delete</button
                                    >
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    {:else}
        <p>Post not found.</p>
    {/if}
</main>

<style lang="scss">
    @use "$lib/styles/colors.scss" as *;
    .like-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1rem;
    }
    .like-btn {
        background: rgba($surface, 0.7);
        border: 1px solid rgba($border, 0.7);
        color: $text;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        transition:
            transform 0.12s,
            border-color 0.2s,
            color 0.2s;
    }
    .like-btn:active {
        transform: scale(1.05);
    }

    .like-btn:hover {
        border-color: rgba($primary, 0.7);
    }

    .like-btn.liked {
        color: $error;
        border-color: rgba($error, 0.45);
    }
    .reactions {
        margin-top: 2rem;
        padding: 1.1rem;
        border-radius: 1rem;
        border: 1px solid rgba($border, 0.75);
        h3 {
            margin-bottom: 1rem;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin-bottom: 1rem;
            background: rgba($card, 0.5);
            border-radius: 0.8rem;
            padding: 0.7rem 0.9rem;
            border: 1px solid rgba($border, 0.7);
            .comment-votes {
                margin-top: 0.5rem;
                display: flex;
                gap: 0.5rem;
                button {
                    background: rgba($surface, 0.75);
                    border: 1px solid rgba($border, 0.72);
                    color: $text-muted;
                    cursor: pointer;
                    font-size: 0.92rem;
                    border-radius: 999px;
                    padding: 0.2rem 0.6rem;
                    &:hover {
                        color: $text;
                        border-color: rgba($primary, 0.65);
                    }
                }
            }
            .comment-date {
                color: $text-muted;
                font-size: 0.9em;
                margin-left: 0.5em;
            }
        }
    }
    .comment-form {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        textarea {
            width: 100%;
            resize: vertical;
            font-size: 1rem;
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid $border;
            background: $surface;
            color: $text;
        }
        .comment-actions {
            display: flex;
            gap: 0.6rem;
            button {
                border-radius: 0.55rem;
                padding: 0.4rem 1rem;
            }
        }
    }
    .error {
        color: $error;
    }
</style>
