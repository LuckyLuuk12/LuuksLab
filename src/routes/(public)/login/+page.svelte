<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    let { form }: { form: ActionData } = $props();
</script>

<main>
    <!-- ...existing code... -->
    <form method="post" action="?/login" use:enhance>
        <a href="/"><i class="fa-solid fa-user"></i> Continue as Guest</a>
        <h1>Account Access</h1>
        <p class="subtitle">Sign in to manage posts and comments.</p>
        <label>
            Username
            <input name="username" />
        </label>
        <label>
            Password
            <input type="password" name="password" />
        </label>
        <button>Login</button>
        <button formaction="?/register">Register</button>
    </form>

    <p class="error">{form?.message ?? ""}</p>

    <!-- Add this below your form -->
    <div class="google-login-button">
        <script src="https://accounts.google.com/gsi/client" async></script>
        <!-- <div id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID

"
        data-login_uri="https://your.domain/your_login_endpoint

"
        data-auto_prompt="false">
    </div>-->
        <div
            class="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
        ></div>
    </div>
</main>

<style lang="scss">
    @use "$lib/styles/colors.scss" as *;

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 72vh;
        gap: 1rem;
    }

    form {
        background: rgba($card, 0.75);
        border: 1px solid rgba($border, 0.75);
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        max-width: 420px;
        margin: auto;
        padding: 1.4rem;
        border-radius: 1rem;
    }

    h1 {
        font-size: 1.8rem;
    }

    .subtitle {
        color: $text-muted;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }
    .google-login-button {
        width: 100%;
        background: rgba($card, 0.75);
        border: 1px solid rgba($border, 0.75);
        padding: 1.2rem;
        max-width: 420px;
        display: inline-block;
        text-decoration: none;
        border-radius: 1rem;
    }

    .error {
        color: $error;
        min-height: 1rem;
    }
</style>
