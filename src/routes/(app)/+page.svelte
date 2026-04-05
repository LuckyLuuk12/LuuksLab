<script lang="ts">
    import { page } from "$app/stores";
    import PostCard from "$lib/components/PostCard.svelte";
    import type { Post } from "$lib/server/db/schema";
    import { onMount } from "svelte";

    let posts: Post[] = [];
    let loading = true;
    let error: string | null = null;
    let viewMode: "grid" | "list" = "list";
    let compact = false;
    let sortBy:
        | "date_desc"
        | "date_asc"
        | "likes_desc"
        | "views_desc"
        | "title_asc"
        | "title_desc" = "date_desc";
    let tagFilter = "all";
    let searchQuery = "";

    $: searchQuery = ($page.url.searchParams.get("q") ?? "")
        .trim()
        .toLowerCase();

    $: availableTags = Array.from(
        new Set(
            posts.flatMap((post) =>
                (post.tags ?? "")
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            ),
        ),
    ).sort((a, b) => a.localeCompare(b));

    $: visiblePosts = posts
        .filter((post) => post.view_state === "public")
        .filter((post) => {
            if (!searchQuery) return true;
            const haystack = [
                post.title,
                post.subtitle ?? "",
                post.summary ?? "",
                post.tags ?? "",
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(searchQuery);
        })
        .filter((post) => {
            if (tagFilter === "all") return true;
            const tags = (post.tags ?? "")
                .split(",")
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean);
            return tags.includes(tagFilter.toLowerCase());
        })
        .sort((a, b) => sortPosts(a, b, sortBy));

    function toDateMs(value: string | null): number {
        if (!value) return 0;
        const timestamp = new Date(value).getTime();
        return Number.isFinite(timestamp) ? timestamp : 0;
    }

    function toSafeNumber(value: number | null): number {
        return typeof value === "number" && Number.isFinite(value) ? value : 0;
    }

    function sortPosts(a: Post, b: Post, sort: typeof sortBy): number {
        if (sort === "date_asc")
            return toDateMs(a.date_published) - toDateMs(b.date_published);
        if (sort === "likes_desc")
            return toSafeNumber(b.likes) - toSafeNumber(a.likes);
        if (sort === "views_desc")
            return toSafeNumber(b.view_count) - toSafeNumber(a.view_count);
        if (sort === "title_asc") return a.title.localeCompare(b.title);
        if (sort === "title_desc") return b.title.localeCompare(a.title);
        return toDateMs(b.date_published) - toDateMs(a.date_published);
    }

    onMount(async () => {
        try {
            const res = await fetch("/api/posts");
            if (!res.ok) throw new Error("Failed to load posts");
            posts = await res.json();
            if (!Array.isArray(posts)) {
                throw new Error("Invalid posts data format");
            }
        } catch (e) {
            error = (e as Error).message;
        } finally {
            loading = false;
        }
    });
</script>

<main class="workspace">
    <aside class="intro-panel panel">
        <h1>Luuk's Lab</h1>
        <p class="subtitle">
            Engineering notes, experiments, and product-minded development
            updates.
        </p>
        <p class="intro-text">
            This blog shares practical write-ups from projects I build and
            lessons learned while shipping them. Use the controls to switch
            views, sort by relevance, and filter by tags.
        </p>
        <div class="stats-row">
            <span>{visiblePosts.length} posts visible</span>
            <span>{availableTags.length} tags indexed</span>
        </div>
    </aside>

    <section class="feed-shell panel">
        <header class="filters-bar">
            <div class="segmented" role="group" aria-label="Layout mode">
                <button
                    type="button"
                    class:active={viewMode === "list"}
                    aria-label="List view"
                    on:click={() => (viewMode = "list")}
                >
                    <i class="fa-solid fa-list"></i>
                </button>
                <button
                    type="button"
                    class:active={viewMode === "grid"}
                    aria-label="Grid view"
                    on:click={() => (viewMode = "grid")}
                >
                    <i class="fa-solid fa-grip"></i>
                </button>
            </div>

            <button
                type="button"
                class="compact-toggle"
                class:active={compact}
                on:click={() => (compact = !compact)}
            >
                <i class="fa-solid fa-compress"></i>
                {compact ? "Compact on" : "Compact"}
            </button>

            <label class="control-field">
                <select bind:value={sortBy}>
                    <option value="date_desc">Date: newest first</option>
                    <option value="date_asc">Date: oldest first</option>
                    <option value="likes_desc">Most liked</option>
                    <option value="views_desc">Most viewed</option>
                    <option value="title_asc">Title A-Z</option>
                    <option value="title_desc">Title Z-A</option>
                </select>
            </label>

            <label class="control-field">
                <select bind:value={tagFilter}>
                    <option value="all">All tags</option>
                    {#each availableTags as tag}
                        <option value={tag}>{tag}</option>
                    {/each}
                </select>
            </label>
        </header>

        <div class="feed-scroll">
            {#if loading}
                <p class="state">Loading posts...</p>
            {:else if error}
                <p class="state error">{error}</p>
            {:else if visiblePosts.length === 0}
                <p class="state">
                    No posts match the current search/filter settings.
                </p>
            {:else}
                <ul
                    class="post-list"
                    class:list={viewMode === "list"}
                    class:compact
                >
                    {#each visiblePosts as post}
                        <li class="post-preview">
                            <PostCard {post} />
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </section>
</main>

<style lang="scss">
    @use "$lib/styles/colors.scss" as *;

    .workspace {
        display: grid;
        grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
        gap: 1rem;
        max-width: 1180px;
        margin: 0 auto;
        height: calc(100vh - 8.2rem);
        min-height: 540px;
    }

    .panel {
        background: linear-gradient(
            180deg,
            rgba($surface, 0.52),
            rgba($surface, 0.44)
        );
        border: 1px solid rgba($border, 0.42);
        border-radius: 0.95rem;
    }

    .intro-panel {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        padding: 1rem;
        position: sticky;
        top: 0;
        height: fit-content;
    }

    h1 {
        font-size: clamp(2rem, 3vw, 2.55rem);
    }

    .subtitle {
        color: $text-muted;
        max-width: 45ch;
    }

    .intro-text {
        color: $text-muted;
        line-height: 1.7;
    }

    .stats-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        color: $text-muted;
        font-size: 0.86rem;
    }

    .feed-shell {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        overflow: hidden;
    }

    .segmented {
        display: flex;
        border: 1px solid rgba($border, 0.8);
        border-radius: 0.75rem;
        overflow: hidden;
        width: fit-content;
    }

    .segmented button {
        background: rgba($surface, 0.68);
        border: none;
        border-right: 1px solid rgba($border, 0.8);
        min-width: 2.4rem;
        border-radius: 0;
        padding: 0.4rem 0.7rem;
        box-shadow: none;
    }

    .segmented button:last-child {
        border-right: none;
    }

    .segmented button.active {
        background: $gradient-main;
        color: $background;
    }

    .compact-toggle {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba($surface, 0.68);
        border: 1px solid rgba($border, 0.8);
        box-shadow: none;
        font-size: 0.725rem;
    }

    .compact-toggle.active {
        background: $gradient-main;
        color: $background;
    }

    .control-field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

        select {
            background: rgba($surface, 0.68);
            border: 1px solid rgba($border, 0.8);
            color: $text;
            padding: 0.65rem 0.75rem;
            border-radius: 0.5rem;
        }
    }

    .filters-bar {
        position: sticky;
        top: 0;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        gap: 0.7rem;
        padding: 0.8rem;
        border-bottom: 1px solid rgba($border, 0.45);
        background: linear-gradient(
            180deg,
            rgba($surface, 0.76),
            rgba($surface, 0.64)
        );
    }

    .feed-scroll {
        min-height: 0;
        height: 100%;
        overflow: auto;
        padding: 0.9rem;
    }

    .state {
        color: $text-muted;
        padding: 0.6rem 0.3rem;
    }

    .state.error {
        color: $error;
    }

    .post-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        width: 100%;
    }

    .post-list:not(.list) {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .post-list.compact {
        gap: 0.65rem;
    }

    .post-list.list :global(.post-card .header-row) {
        flex-direction: column;
        gap: 0.35rem;
    }

    .post-list.list :global(.post-card .meta) {
        justify-content: flex-start;
        text-align: left;
    }

    .post-list.compact :global(.post-card) {
        padding: 0.8rem;
    }

    .post-list.compact :global(.post-card .title-group h2) {
        font-size: 1.05rem;
    }

    .post-list.compact :global(.post-card .summary) {
        display: none;
    }

    .post-list.compact :global(.post-card .tags),
    .post-list.compact :global(.post-card .cover-image),
    .post-list.compact :global(.post-card .meta-modified),
    .post-list.compact :global(.post-card .meta-likes),
    .post-list.compact :global(.post-card .meta-views) {
        display: none;
    }

    .post-preview {
        margin: 0;
        border-radius: 0.9rem;
        min-width: 0;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        font-size: 0.98rem;
        transition: transform 0.18s ease;
        position: relative;

        &:hover {
            transform: translateY(-1px);
        }
    }

    .post-preview :global(.post-card.glass) {
        background: rgba($surface, 0.56);
        border: 1px solid rgba($border, 0.52);
        box-shadow: none;
        transition:
            border-color 0.2s,
            box-shadow 0.2s,
            transform 0.2s;
    }

    .post-preview:hover :global(.post-card.glass) {
        border-color: rgba($primary, 0.5);
        box-shadow: inset 4px 0 0 rgba($primary, 0.9);
    }

    @media (max-width: 700px) {
        .workspace {
            grid-template-columns: 1fr;
            height: auto;
        }

        .intro-panel {
            position: static;
        }

        .feed-shell {
            min-height: 70vh;
        }
    }
</style>
