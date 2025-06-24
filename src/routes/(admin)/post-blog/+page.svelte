<script lang="ts">
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

<h2>{editing ? 'Edit Post' : 'New Post'}</h2>
<form on:submit|preventDefault={submitPost}>
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

<hr />

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
                <td>{post.date_published ? new Date(post.date_published).toLocaleDateString() : 'Not published'}</td>
                <td>{isPublic(post) ? 'No' : 'Yes'}</td>
                <td>
                    <button on:click={() => editPost(post)}>Edit</button>
                    <button on:click={() => toggleHide(post)}>{isPublic(post) ? 'Hide' : 'Unhide'}</button>
                    <button on:click={() => deletePost(post.id)}>Delete</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
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
    border: 1px solid #333;
    padding: 0.5rem;
}
button {
    margin-right: 0.5rem;
}
</style>