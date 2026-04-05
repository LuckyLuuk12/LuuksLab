<script lang="ts">
    import { page } from "$app/stores";

    export let data;
    export let showNav = true;
    const socials = [
        {
            href: "https://github.com/LuckyLuuk12",
            icon: "fa-brands fa-github",
            label: "GitHub",
        },
        {
            href: "https://linkedin.com/in/luuk-kablan",
            icon: "fab fa-linkedin",
            label: "LinkedIn",
        },
        {
            href: "https://discord.com/users/463695638094282772",
            icon: "fa-brands fa-discord",
            label: "Discord",
        },
    ];

    let imgError = false;
    $: navQuery = $page.url.searchParams.get("q") ?? "";
</script>

<div class="content">
    {#if showNav}
        <nav class="navbar">
            <div class="nav-content">
                <div class="nav-left">
                    <a href="/" class="brand">
                        {#if !imgError}
                            <img
                                src="/img/header.png"
                                alt="Luuk's Lab"
                                on:error={() => (imgError = true)}
                            />
                        {/if}
                        {#if imgError}
                            <span>Luuk's Lab</span>
                        {/if}
                    </a>
                    <a href="/about" class="nav-link">About</a>
                </div>
                <div class="nav-right">
                    <form class="search-form" method="get" action="/">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="search"
                            name="q"
                            placeholder="Search posts, projects, or tags"
                            value={navQuery}
                        />
                    </form>
                    <div class="socials">
                        {#each socials as social}
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener"
                                aria-label={social.label}
                            >
                                <i class={social.icon}></i>
                            </a>
                        {/each}
                    </div>
                    <div class="auth">
                        {#if data?.user}
                            {#if data?.user?.role === "admin"}
                                <a href="/post-blog" class="nav-link"
                                    >Write Post</a
                                >
                            {/if}
                            <form method="post" action="?/logout">
                                <button class="nav-action">Logout</button>
                            </form>
                        {:else}
                            <a href="/login" class="nav-link">Login</a>
                        {/if}
                    </div>
                </div>
            </div>
        </nav>
    {/if}
    <div class="page">
        <slot />
    </div>
</div>

<style lang="scss">
    @use "$lib/styles/colors.scss" as *;

    .content {
        width: 100%;
        min-height: 100vh;
    }

    .page {
        padding: 1.2rem 1rem 2rem;
        max-width: 1180px;
        margin: 0 auto;
    }

    .navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba($surface, 0.48);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba($border, 0.35);
        padding: 0.7rem 1rem;
    }

    .nav-content {
        width: 100%;
        max-width: 1180px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 3.2rem;
    }

    .nav-left,
    .nav-right {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }

    .nav-right {
        margin-left: auto;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    @media screen and (max-width: 860px) {
        .nav-content {
            gap: 0.6rem;
        }

        .nav-link,
        .nav-action {
            font-size: 0.9rem;
        }

        .search-form {
            min-width: 100%;
            order: 2;
        }

        .socials,
        .auth {
            order: 3;
        }

        .brand {
            font-size: 1rem;

            img {
                height: 1.4rem;
            }
        }
    }

    .brand {
        font-size: 1.25rem;
        font-weight: bold;
        color: $primary;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .brand img {
        height: 1.8rem;
        width: auto;
        border-radius: 0.4rem;
    }

    .nav-link,
    .nav-action {
        cursor: pointer;
        border: none;
        background: transparent;
        color: $text;
        text-decoration: none;
        font-size: 0.98rem;
        margin-right: 0.2rem;
        transition: color 0.2s;
        position: relative;
        overflow: hidden;

        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 2px;
            background: $gradient-accent;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 2px;
        }

        &:hover,
        &:focus {
            color: $accent;
            &::after {
                transform: scaleX(1);
            }
        }
    }

    .search-form {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        min-width: 250px;
        background: rgba($surface, 0.78);
        border: 1px solid rgba($border, 0.82);
        border-radius: 999px;
        padding: 0.35rem 0.65rem;

        i {
            font-size: 0.85rem;
            color: $text-muted;
        }

        input {
            width: 100%;
            border: none;
            padding: 0;
            background: transparent;
            box-shadow: none;
            font-size: 0.9rem;
        }
    }

    .socials {
        display: flex;
        gap: 0.9rem;
    }

    .socials a {
        color: $text;
        font-size: 1.1rem;
        transition: color 0.2s;
        padding: 0.15rem;
    }

    .socials a:hover i {
        color: $accent;
    }

    .auth {
        display: flex;
        align-items: center;
        gap: 0.55rem;
    }

    form {
        display: inline;
    }
</style>
