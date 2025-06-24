<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main>
<!-- ...existing code... -->
<form method='post' action='?/login' use:enhance>
    <label>
        Username
        <input name='username' />
    </label>
    <label>
        Password
        <input type='password' name='password' />
    </label>
    <button>Login</button>
    <button formaction='?/register'>Register</button>
</form>

<p style='color: red'>{form?.message ?? ''}</p>

<!-- Add this below your form -->
<div class='google-login-button'>
    <script src="https://accounts.google.com/gsi/client" async></script>
    <!-- <div id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID

"
        data-login_uri="https://your.domain/your_login_endpoint

"
        data-auto_prompt="false">
    </div>-->
    <div class="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left">
    </div> 
</div>
</main>


<style lang="scss">
@use '$lib/styles/colors.scss' as *;

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: fit-content;
    gap: 2rem;
    margin-left: 50%;
    transform: translateX(-50%);
}

form {
    background: $card;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border-radius: 0.25rem;
}

label {
    display: flex;
    flex-direction: column;
}
.google-login-button {
    width: 100%;
    background: $card;
    padding: 2rem;
    max-width: 400px;
    display: inline-block;
    text-decoration: none;
    border-radius: 0.25rem;
}

</style>