<script lang="ts">
    import { formatDate } from "$lib";
    import type { Post } from "$lib/server/db/schema";

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
                <span class="meta-item meta-published"
                    ><strong>Published:</strong>
                    {post.date_published
                        ? formatDate(post.date_published)
                        : formatDate(null)}</span
                >
                {#if post.last_modified}
                    <span class="meta-item meta-modified"
                        ><strong>Last modified:</strong>
                        {formatDate(post.last_modified)}</span
                    >
                {/if}
                <span class="meta-item meta-likes"
                    ><strong>Likes:</strong>
                    {Number(post.likes ?? 0) || 0}</span
                >
                <span class="meta-item meta-views"
                    ><strong>Views:</strong>
                    {Number(post.view_count ?? 0) || 0}</span
                >
            </div>
        </div>
        <p class="summary">{@html post.summary}</p>
        {#if post.cover_image_url}
            <img
                class="cover-image"
                src={post.cover_image_url}
                alt="Cover image for {post.title}"
            />
        {/if}
        {#if post.tags}
            <div class="tags">
                {#each post.tags.split(",") as tag}
                    <span class="tag">{tag.trim()}</span>
                {/each}
            </div>
        {/if}
    </a>
</div>

<style lang="scss">
    @use "sass:color";
    @use "$lib/styles/colors.scss" as *;

    .post-card {
        margin: 0;
        padding: 1.05rem 1.1rem;
        border-radius: 0.9rem;
        min-width: 0;
        box-shadow: $glass-shadow;
        display: flex;
        flex-direction: column;
        background: $glass-bg;
        font-size: 0.98rem;
        transition:
            transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.2s;
        position: relative;
        overflow: hidden;
        max-height: none;
        margin-bottom: 0.5rem;
        border: 1px solid rgba($border, 0.75);
    }

    .post-card a {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
    }

    .post-card:hover {
        transform: translateY(-2px);
        border-color: rgba($primary, 0.45);
        box-shadow:
            inset 4px 0 0 rgba($primary, 0.9),
            $glass-shadow;
    }

    .header-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.2rem;
        margin-bottom: 0;
    }

    .title-group {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        min-width: 0;
        h2 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 700;
            line-height: 1.2;
        }
        .subtitle {
            color: $text-muted;
            font-size: 0.93rem;
            margin: 0;
            line-height: 1.3;
            margin-top: 0.1rem;
        }
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem 0.8rem;
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
        color: color.adjust($text-muted, $lightness: 6%);
        max-width: 100%;
        margin: 0.35rem 0;
        font-size: 0.95rem;
        max-height: 4.4em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 3;
        -webkit-line-clamp: 3;
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
        margin-top: 0.15rem;
        justify-content: flex-start;
    }

    .tag {
        background: rgba($secondary, 0.16);
        color: $text;
        border-radius: 0.4rem;
        padding: 0.15rem 0.6rem;
        font-size: 0.85em;
    }

    @media (max-width: 760px) {
        .header-row {
            flex-direction: column;
            gap: 0.4rem;
        }

        .meta {
            justify-content: flex-start;
            text-align: left;
        }
    }
</style>
