<script lang="ts">
  import type { Post } from '$lib/server/db/schema';
  import { formatDate } from '$lib';

  export let post: Post;

</script>

<div class="post-card glass">
    <a href={`/post?id=${post.id}`}>
      <div class="header-row">
          <div class="title-group">
              <h2>{@html post.title}</h2>
              {#if post.subtitle}
                  <span class="subtitle">{@html post.subtitle}</span>
              {/if}
          </div>
          <div class="meta">
              <span><strong>Published:</strong> {post.date_published ? formatDate(post.date_published) : formatDate(null)}</span>
              {#if post.last_modified}
                  <span><strong>Last modified:</strong> {formatDate(post.last_modified)}</span>
              {/if}
              <span><strong>Likes:</strong> {post.likes ?? 0}</span>
              <span><strong>Views:</strong> {post.view_count ?? 0}</span>
          </div>
      </div>
      <p class="summary">{@html post.summary}</p>
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
  </a>
</div>


<style lang="scss">
@use '$lib/styles/colors.scss' as *;

.post-card {
    margin: 0;
    padding: 1.1rem 1.2rem;
    border-radius: 0.25rem;
    min-width: 0;
    box-shadow: $glass-shadow;
    display: flex;
    flex-direction: column;
    background: $glass-bg;
    font-size: 0.98rem;
    transition: background 0.2s, transform 0.18s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    height: 100%;
    margin-bottom: 0.5rem;
}

.post-card:hover {
    transform: scale(1.005);
}

.header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 0.2rem;
}

.title-group {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
    h2 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 600;
        line-height: 1.1;
    }
    .subtitle {
        color: $text-muted;
        font-size: 0.98rem;
        margin: 0;
        line-height: 1.1;
        margin-top: 0.1rem;
    }
}

.meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem 1.2rem;
    font-size: 0.92em;
    color: $text-muted;
    justify-content: flex-end;
    align-items: flex-start;
    text-align: right;
    span {
        white-space: nowrap;
    }
}

.summary {
    color: darken($secondary, 25); // Use your accent cyan for summary text
    max-width: 75%;
    margin: 0.3rem 0 0.4rem 0;
    font-size: 0.97rem;
    max-height: 3.6em; // ~2 lines
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cover-image {
    width: 100%;
    max-height: 120px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
    justify-content: flex-end;
    position: absolute;
    right: 1.2rem;
    bottom: 1.1rem;
    z-index: 2;
}

.tag {
    background: rgba($primary, 0.18);
    color: $accent;
    border-radius: 0.4rem;
    padding: 0.1rem 0.6rem;
    font-size: 0.85em;
}

</style>