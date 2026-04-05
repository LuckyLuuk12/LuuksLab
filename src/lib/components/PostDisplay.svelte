<script lang="ts">
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
  @use "$lib/styles/colors.scss" as *;
  .post-content {
    margin-bottom: 2rem;
    padding: 2rem;
    min-height: 200px;
    border-radius: 1rem;
    border: 1px solid rgba($border, 0.75);
    .post {
      margin: auto;
      max-width: 800px;
      font-size: clamp(1rem, 2vw, 1.1rem);
      line-height: 1.75;
      color: $text;
      word-break: break-word;
      text-wrap: pretty;
    }
  }
</style>
