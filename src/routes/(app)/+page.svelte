<script lang="ts">
    import PostCard from '$lib/components/PostCard.svelte';
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
            if (!Array.isArray(posts)) {
                throw new Error('Invalid posts data format');
            }
            posts = posts.filter(post => post.view_state == 'public'); // Filter out unpublished posts
        } catch (e) {
            error = (e as Error).message;
        } finally {
            loading = false;
        }
    });
</script>

<main>
    <h1>Welcome to my Blog</h1>
    <p class="subtitle">Latest posts, news, and experiments</p>
    <br>
    <small>
        Here I publish short posts about my latest projects, experiments, and thoughts on various topics.<br>
        I am neither a professional writer nor a designer, so expect rough edges and unfinished ideas.<br>
        That together with the fact that I am not all-knowing, <i><del>Although I am very close </del></i> <i class="fa-solid fa-face-grin-tongue-wink"></i> <br> 
        hopefully makes this a fun place to explore.<br>
    </small>
    <br><br>
    {#if loading}
        <p>Loading posts...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if posts.length === 0}
        <p>No posts yet. Check back soon!</p>
    {:else}
        <ul class="post-list">
            {#each posts as post}
                <li class=" post-preview">
                    <PostCard {post} />
                    <!-- <a href={`/post?id=${post.id}`}>
                        <div class="header-row">
                            <div class="title-group">
                                <h2>{post.title}</h2>
                                {#if post.subtitle}
                                    <span class="subtitle">{post.subtitle}</span>
                                {/if}
                            </div>
                            <div class="meta">
                                <span><strong>Published:</strong> {post.date_published ? new Date(post.date_published).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                }) : 'Unknown'}</span>
                                {#if post.last_modified}
                                    <span><strong>Last modified:</strong> {new Date(post.last_modified).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                    })}</span>
                                {/if}
                                <span><strong>Likes:</strong> {post.likes ?? 0}</span>
                                <span><strong>Views:</strong> {post.view_count ?? 0}</span>
                            </div>
                        </div>
                        <p class="summary">{post.summary}</p>
                        {#if post.cover_image_url}
                            <img class="cover-image" src={post.cover_image_url} alt="Cover image for {post.title}" />
                        {/if}
                        {#if post.tags}
                            <div class="tags">
                                {#each post.tags.split(',') as tag}
                                    <span class="tag">{tag.trim()}</span>
                                {/each}
                            </div>
                        {/if}
                    </a> -->
                </li>
            {/each}
        </ul>
    {/if}
</main>

<style lang="scss">
@use '$lib/styles/colors.scss' as *;
.post-list {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.2rem;
}

.post-preview {
    margin: 0;
    border-radius: 0.8rem;
    min-width: 0;
    box-shadow: $glass-shadow;
    display: flex;
    flex-direction: column;
    font-size: 0.98rem;
    transition: background 0.2s, transform 0.18s cubic-bezier(0.4,0,0.2,1);
    position: relative;
}

small {
    color: $text-muted;
    font-size: 0.85em;
}
</style>