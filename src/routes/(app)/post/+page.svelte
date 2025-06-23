<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { error } from '@sveltejs/kit';
    import { get } from 'svelte/store';

    let post: any = null;
    let loading = true;
    let err: string | null = null;
    let comments: any[] = [];

    // Get the post id from the URL
    let id: string | null = null;

    onMount(async () => {
      id = get(page).url.searchParams.get('id');
        try {
            // Fetch the post
            const res = await fetch(`/api/posts?id=${id}`);
            if (!res.ok) throw new Error('Failed to load post');
            const posts = await res.json();
            console.log('Fetched posts:', posts);
            post = Array.isArray(posts) ? posts.find((p) => {
              console.log('Checking post:', p.id, 'against id:', id);
              return p.id === id
            }) : posts;
            if (!post) throw new Error('Post not found');

            // Fetch comments/reactions
            const cRes = await fetch(`/api/comments?post_id=${id}`);
            if (cRes.ok) {
                comments = await cRes.json();
            }
        } catch (e) {
            err = (e as Error).message;
        } finally {
            loading = false;
        }
    });
</script>

<main>
    {#if loading}
        <p>Loading post...</p>
    {:else if err}
        <p class="error">{err}</p>
    {:else if post}
        <div class="metadata glass">
          <h1>{post.title} <small>{post.subtitle ? " - " + post.subtitle : "" }</small></h1>
            <div class="meta">
                <span>Published: {post.date_published ? new Date(post.date_published).toLocaleDateString() : 'Unknown'}</span>
                <span>Author: {post.author_id}</span>
                <span>Views: {post.view_count ?? 0}</span>
                <span>Tags: {post.tags}</span>
            </div>
        </div>
        <div class="post-content glass"><div class="post">{@html post.content_html}</div></div>
            <!-- Post content will be rendered here -->
        <div class="reactions glass">
            <h3>Reactions & Comments</h3>
            {#if comments.length === 0}
                <p>No reactions yet.</p>
            {:else}
                <ul>
                    {#each comments as comment}
                        <li>
                            <strong>{comment.author_id}</strong> ({new Date(comment.date_created).toLocaleString()}):<br />
                            <span>{comment.content}</span>
                        </li>
                    {/each}
                </ul>
            {/if}
            <!-- Future: Add a form to submit a new comment/reaction -->
        </div>
    {:else}
        <p>Post not found.</p>
    {/if}
</main>

<style lang="scss">
@import '$lib/styles/global.scss';

.metadata {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0.5rem 2rem;
  h1 {
    margin-bottom: 0.5rem;
  }
  h2 {
    margin-bottom: 1rem;
    color: $text-muted;
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
    background: rgba(255,255,255,0.04);
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
  }
}
.error {
  color: $error;
}
</style>