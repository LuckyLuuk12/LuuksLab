<script lang="ts">
    import { formatDate } from "$lib";
    import type { Post } from "$lib/server/db/schema";
    import PostCard from "./PostCard.svelte";

  export let post: Post;
</script>

<div style="display: contents;">
  <!-- <div class="metadata glass"> -->
    <!-- <h1>
      {@html post.title}
      {#if post.subtitle}
        <small> - {@html post.subtitle}</small>
      {/if}
    </h1>
    <div class="meta">
      <span>Published: {post.date_published ? formatDate(post.date_published) : formatDate(new Date())}</span>
      <span>Author: {@html post.author_id}</span>
      <span>Views: {post.view_count ?? 0}</span>
      <span>Tags: {@html post.tags}</span>
    </div>
  </div> -->
  <PostCard {post} />
  <div class="post-content glass">
    <div class="post">{@html post.content_html}</div>
  </div>
</div>


<style lang="scss">
@use '$lib/styles/colors.scss' as *;
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
    max-width: 800px;
    font-size: 1.2rem;
    line-height: 1.2;
    color: $text;
    word-break: break-word;
    text-wrap: balance;
    
  }
}

</style>