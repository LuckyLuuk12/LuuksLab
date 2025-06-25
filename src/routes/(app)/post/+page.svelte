<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { Comment, Post } from '$lib/server/db/schema';
    import PostDisplay from '$lib/components/PostDisplay.svelte';

    export let data: any; // Replace with actual type if needed

    let post: Post | null = null;
    let loading = true;
    let err: string | null = null;
    let comments: Comment[] = [];
    let commentContent = '';
    let editingCommentId: string | null = null;
    let userComment: any = null;
    let submitting = false;
    let id: string | null = null;

    // Simulate user (replace with real user from session in prod)
    // let user = { id: 'test-user', name: 'Test User' };

    onMount(async () => {
        id = get(page).url.searchParams.get('id');
        try {
            // Fetch the post
            const res = await fetch(`/api/posts?id=${id}`);
            if (!res.ok) throw new Error('Failed to load post');
            const posts = await res.json();
            post = Array.isArray(posts) ? posts.find((p) => p.id === id) : posts;
            if (!post) throw new Error('Post not found');

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
            userComment = comments.find(c => c.user_id === data?.user?.id);
        }
    }

    async function submitComment() {
        submitting = true;
        try {
            const method = editingCommentId ? 'PATCH' : 'POST';
            const body = editingCommentId
                ? { id: editingCommentId, content: commentContent }
                : { post_id: id, content: commentContent };
            const res = await fetch('/api/comments', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Failed to submit comment');
            commentContent = '';
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
        if (!confirm('Delete your comment?')) return;
        const res = await fetch('/api/comments', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            commentContent = '';
            editingCommentId = null;
            await loadComments();
        }
    }

    async function voteComment(id: string, vote: 'up' | 'down') {
        const res = await fetch('/api/comments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, vote })
        });
        if (res.ok) {
            await loadComments();
        }
    }

    let liking = false;
    async function likePost() {
        if (!post) return;
        if (!data?.user) return alert("Login to like!");
        liking = true;
        try {
            const res = await fetch('/api/posts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post.id, like: true })
            });
            if (res.ok) {
                post.likes = (post.likes ?? 0) + 1;
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
                style={liking ? 'color: var(--error);' : ''}
                    class="like-btn"
                    aria-label="Like this post"
                    on:click={likePost}
                    disabled={liking}
                >
                    <i class="fa fa-heart"></i>
                    <span>{post.likes ?? 0}</span>
                </button>
            </div>
            {#if data?.user && !comments.some(c => c.user_id === data.user.id)}
            <!-- Comment form -->
            <form on:submit|preventDefault={submitComment} class="comment-form">
                <textarea
                    bind:value={commentContent}
                    placeholder="Write your comment..."
                    rows="3"
                    maxlength="2000"
                    required
                    disabled={submitting}
                ></textarea>
                <div class="comment-actions">
                    <button type="submit" disabled={submitting || !commentContent.trim()}>
                        {editingCommentId ? 'Update' : 'Post'} Comment
                    </button>
                    {#if editingCommentId}
                        <button type="button" on:click={() => { editingCommentId = null; commentContent = ''; }}>
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
                            <span class="comment-date">({new Date(comment.date_created as string).toLocaleString()})</span>:
                            <br />
                            <span>{comment.content}</span>
                            <div class="comment-votes">
                                <button title="Upvote" on:click={() => voteComment(comment.id, 'up')}>▲ {comment.upvotes ?? 0}</button>
                                <button title="Downvote" on:click={() => voteComment(comment.id, 'down')}>▼ {comment.downvotes ?? 0}</button>
                                {#if data?.user?.id === comment.user_id}
                                    <button on:click={() => startEdit(comment)}>Edit</button>
                                    <button on:click={() => deleteComment(comment.id)}>Delete</button>
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
@use '$lib/styles/colors.scss' as *;
.like-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1rem;
}
.like-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.1s;
}
.like-btn:active {
    transform: scale(1.2);
}
.metadata {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0.5rem 2rem;
  h1 {
    margin-bottom: 0.5rem;
  }
  .meta {
    font-size: 0.95rem;
    color: $text-muted;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
}
.post-content {
  margin-bottom: 2rem;
  padding: 2rem;
  min-height: 200px;
  .post {
    margin: auto;
    width: 800px;
    font-size: 1.2rem;
    line-height: 1.6;
    color: $text;
  }
}
.reactions {
  margin-top: 2rem;
  padding: 1.5rem;
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
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    .comment-votes {
      margin-top: 0.5rem;
      display: flex;
      gap: 1rem;
      button {
        background: none;
        border: none;
        color: $primary;
        cursor: pointer;
        font-size: 1rem;
        &:hover {
          color: $accent;
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
    gap: 1rem;
    button {
      background: $primary;
      color: #fff;
      border: none;
      border-radius: 0.25rem;
      padding: 0.4rem 1rem;
      cursor: pointer;
      &:hover {
        background: $accent;
      }
    }
  }
}
.error {
  color: $error;
}
</style>