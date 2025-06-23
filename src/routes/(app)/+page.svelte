<script lang="ts">
    import type { Post } from '$lib/server/db/schema';
    import { onMount } from 'svelte';
    let posts: Post[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            const res = await fetch('/api/posts');
            if (!res.ok) throw new Error('Failed to load posts');
            posts = await res.json();
        } catch (e) {
            error = (e as Error).message;
        } finally {
            loading = false;
        }
    });
</script>

<main>
    <h1>Welcome to Luuk's Lab Blog</h1>
    <p class="subtitle">Latest posts, news, and experiments</p>

    {#if loading}
        <p>Loading posts...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if posts.length === 0}
        <p>No posts yet. Check back soon!</p>
    {:else}
        <ul class="post-list">
            {#each posts as post}
                <li class="glass post-preview">
                    <a href={`/post?id=${post.id}`}>
                        <h2>{post.title}</h2>
                        <p class="summary">{post.summary}</p>
                        <small>{new Date(post.date_published as string).toLocaleDateString()}</small>
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</main>

<style lang="scss">
@import '../../lib/styles/global.scss';

.subtitle {
    color: $text;
    margin-bottom: 2rem;
}
.post-list {
    list-style: none;
    padding: 0;
}
.post-preview {
    margin-bottom: 2.5rem;
    transition: background 0.2s;
}
.post-preview:hover {
    transform: scale(1.005);
}
.post-preview h2 {
    margin: 0 0 0.5rem 0;
}
.summary {
    color: var(--text-muted, #b0b8d1);
    margin-bottom: 0.5rem;
}
.error {
    color: $error;
}

</style>