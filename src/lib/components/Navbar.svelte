<script lang="ts">
    import Obfuscate from "./Obfuscate.svelte";

    export let data;
    export let showNav = true;
    const socials = [
        {
            href: "https://github.com/LuckyLuuk12",
            icon: "fa-brands fa-github",
            label: "GitHub"
        },
        {
            href: "https://linkedin.com/in/luuk-kablan",
            icon: "fab fa-linkedin",
            label: "LinkedIn"
        },
        {
            href: "https://discord.com/users/463695638094282772",
            icon: "fa-brands fa-discord",
            label: "Discord"
        }
    ];

    let imgError = false;
</script>
<div class="content">
    {#if showNav}
        <nav class="navbar">
            <input type="checkbox" id="nav-toggle" class="nav-toggle" checked />
            <label for="nav-toggle" class="hamburger" aria-label="Open navigation">
                <span></span>
                <span></span>
                <span></span>
            </label>

            <div class="nav-content">
                <a href="/" class="brand">
                    {#if !imgError}
                        <img src="/img/header.png" alt="Luuk's Lab" on:error={() => (imgError = true)} />
                    {/if}
                    {#if imgError}
                        <span>Luuk's Lab</span>
                    {/if}
                </a>
                <a href="/about" class="nav-link">Who the <Obfuscate text="fuck"/> is this guy!?</a>
                <div class="socials">
                    {#each socials as social}
                        <a href={social.href} target="_blank" rel="noopener" aria-label={social.label}>
                            <i class={social.icon}></i>
                        </a>
                    {/each}
                </div>
                <div class="auth">
                    {#if data?.user}
                        <form method="post" action="?/logout">
                            <button>Logout</button>
                        </form>
                    {:else}
                        <a href="/login" class="nav-link">Login</a>
                    {/if}
                </div>
            </div>
        </nav>
    {/if}
  <div class="page">
    <slot />
  </div>
</div>

<style lang="scss">
@use '$lib/styles/colors.scss' as *;

.content {
  width: 100vw;
  min-height: 100vh;
  padding: 4rem 10rem;
  @media screen and (max-width: 1080px) {
    padding: 3rem 2rem;
  }
}
.page {
  padding: 1rem;
}

.navbar {
    position: relative;
    top: 0;
    left: 0;
    width: calc(100%);
    z-index: 100;
    @media screen and (max-width: 860px) {
        .nav-link {
            font-size: x-small !important;
        }
        .brand {
            font-size: small !important;
            img {
                height: 1.2rem;
            }
        }
    }
}

.hamburger {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    z-index: 200;
}
.hamburger span {
    display: block;
    height: 0.3rem;
    width: 100%;
    background: $primary;
    border-radius: 0.2rem;
    transition: 0.3s;
}
// Hamburger animation when toggled
.nav-toggle:checked + .hamburger span:nth-child(1) {
    background: $error;
    transform: translateY(0.85rem) rotate(45deg);
}
.nav-toggle:checked + .hamburger span:nth-child(2) {
    opacity: 0;
}
.nav-toggle:checked + .hamburger span:nth-child(3) {
    background: $error;
    transform: translateY(-0.85rem) rotate(-45deg);
}

// Hamburger default (reset)
.hamburger span:nth-child(1),
.hamburger span:nth-child(3) {
    transition: transform 0.3s, background 0.3s;
}
.hamburger span:nth-child(2) {
    transition: opacity 0.3s;
}


.nav-toggle {
    display: none;
}
.nav-content {
    top: 0;
    left: 0;
    background: $glass-bg;
    border-bottom: $glass-border;
    box-shadow: $glass-shadow;
    backdrop-filter: $glass-backdrop;
    -webkit-backdrop-filter: $glass-backdrop;
    visibility: hidden;
    display: flex;
    align-items: center;
    gap: 3rem;
    padding: 1rem 2rem 1rem 5rem;
    height: 4rem;
    z-index: 150;
    border-radius: 0.25rem;
}
.nav-toggle:checked ~ .nav-content {
    // transform: translateY(0);
    visibility: visible;
}
.brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: $primary;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.brand img {
    height: 2.2rem;
    width: auto;
    border-radius: 0.4rem;
}
.nav-link, button {
    cursor: pointer;
    border: none;
    background: transparent;
    color: $text;
    text-decoration: none;
    font-size: 1.1rem;
    margin-right: 1.5rem;
    transition: color 0.2s;
    position: relative;
    overflow: hidden;

    // Custom animated underline
    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 2px;
        background: $accent;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
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

.socials {
  display: flex;
  gap: 2rem;
}
.socials a {
  color: $text;
  font-size: 1.5rem;
  transition: color 0.2s;
}
.socials a:hover i {
  color: $accent;
}
.auth {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
form {
  display: inline;
}
// button {
//   background: $primary;
//   color: #fff;
//   border: none;
//   border-radius: 0.5rem;
//   padding: 0.4rem 1rem;
//   cursor: pointer;
//   transition: background 0.2s;
// }
// button:hover {
//   background: $accent;
// }
// @media (min-width: 700px) {
//     .hamburger {
//         position: absolute;
//     }
//     .nav-content {
//         position: static;
//         transform: none !important;
//         width: 100%;
//         justify-content: flex-start;
//     }
//     .nav-toggle:not(:checked) ~ .nav-content {
//         display: flex;
//     }
// }
</style>