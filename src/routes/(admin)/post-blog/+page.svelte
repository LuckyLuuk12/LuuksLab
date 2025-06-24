<script lang="ts">
    import { formatDate } from '$lib';
    import PostDisplay from '$lib/components/PostDisplay.svelte';
    import type { Post } from '$lib/server/db/schema';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    let posts: Post[] = [];
    let form: Post = {
        id: '',
        title: '',
        subtitle: '',
        author_id: '',
        content_html: '',
        date_published: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        likes: 0,
        slug: '',
        view_state: 'public',
        cover_image_url: '',
        summary: '',
        tags: '',
        view_count: 0,
    };
    let editing = false;

    async function loadPosts() {
        const res = await fetch('/api/posts');
        posts = await res.json();
    }

    async function submitPost() {
        const method = editing ? 'PATCH' : 'POST';
        const body = editing
            ? { id: form.id, fields: { ...form } }
            : { ...form, id: uuidv4(), author_id: 'admin' }; // Replace with real author_id
        await fetch('/api/posts', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        editing = false;
        resetForm();
        await loadPosts();
    }

    function editPost(post: Post)  {
        form = { ...post };
        editing = true;
    }

    async function deletePost(id: string) {
        if (!confirm('Delete this post?')) return;
        await fetch('/api/posts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        await loadPosts();
    }

    function resetForm() {
        form = {
            id: '',
            title: '',
            subtitle: '',
            author_id: '',
            content_html: '',
            date_published: new Date().toISOString(),
            last_modified: new Date().toISOString(),
            likes: 0,
            slug: '',
            view_state: 'public',
            cover_image_url: '',
            summary: '',
            tags: '',
            view_count: 0,
        };
        editing = false;
    }

    async function toggleHide(post: Post) {
        await fetch('/api/posts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: post.id, fields: { view_state: post.view_state === 'public' ? 'private' : 'public' } })
        });
        await loadPosts();
    }

    $: isPublic = (post: Post) => {
        return post.view_state === 'public';
    }

    onMount(loadPosts);
</script>

<div class="container">
    <form on:submit|preventDefault={submitPost}>
        <h2>{editing ? 'Edit Post' : 'New Post'}</h2>
        <input bind:value={form.title} placeholder="Title" required />
        <input bind:value={form.subtitle} placeholder="Subtitle" />
        <textarea bind:value={form.content_html} placeholder="HTML Content" rows="8" required ></textarea>
        <input bind:value={form.summary} placeholder="Summary" />
        <input bind:value={form.tags} placeholder="Tags (comma separated)" />
        <label>
        Make public:
        <input type="checkbox" on:change={() => form.view_state = form.view_state === 'public' ? 'private' : 'public'} checked={form.view_state === 'public'} />
        </label>
        <button type="submit">{editing ? 'Update' : 'Create'} Post</button>
        {#if editing}
            <button type="button" on:click={resetForm}>Cancel</button>
        {/if}
    </form>
    <!-- a live preview using the  -->
     <div class="live-preview">
        <h2>Live Preview</h2>
        <PostDisplay post={form} />
    </div>
</div>

<hr /><br>

<h2>All Posts</h2>
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Published</th>
            <th>Public</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each posts as post}
            <tr>
                <td>{post.title}</td>
                <td>{post.date_published ? formatDate(post.date_published) : 'Not published'}</td>
                <td>{isPublic(post) ? 'Yes' : 'No'}</td>
                <td>
                    <button on:click={() => editPost(post)}>Edit</button>
                    <button on:click={() => toggleHide(post)}>{isPublic(post) ? 'Hide' : 'Unhide'}</button>
                    <button on:click={() => deletePost(post.id)}>Delete</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">
@use '$lib/styles/colors.scss' as *;
.container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    & > * {
        max-width: 50%;
        flex: 1;
    }
    .live-preview {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
}
form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 500px;
    margin-bottom: 2rem;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border: 1px solid $border;
    padding: 0.5rem;
}
button {
    margin-right: 0.5rem;
}
</style>