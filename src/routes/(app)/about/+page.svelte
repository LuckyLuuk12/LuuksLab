<main class="about">
  <h1>About Me</h1>
  <img src="/img/header.png" alt="Luuk Kablan" class="profile-img" />
  <h2>Luuk Kablan <span class="handle">(@LuckyLuuk_)</span></h2>

  <div class="about-section">
    <p>
      Hi! I'm Luuk Kablan, also known online as <strong>LuckyLuuk_</strong>. I'm a developer and tech enthusiast from the Netherlands, passionate about building modern web applications and experimenting with new technologies.
    </p>
  </div>

  <div class="about-section">
    <p>
      I enjoy working with frameworks like <strong>SvelteKit</strong> and deploying projects to platforms like <strong>Cloudflare</strong> for speed and scalability. My interests include open source, web performance, and making the web more fun and accessible for everyone.
    </p>
  </div>

  <div class="about-section">
    <p>
      When I'm not coding, you might find me gaming, tinkering with servers, or sharing knowledge with the community.
    </p>
  </div>

  <h3 class="about-heading">Find me online</h3>
  <ul class="socials">
    <li>
      <a href="https://github.com/LuckyLuuk12" target="_blank" rel="noopener">
        <i class="fab fa-github"></i> GitHub
      </a>
    </li>
    <li>
      <a href="https://twitter.com/LuckyLuuk_" target="_blank" rel="noopener">
        <i class="fab fa-reddit"></i> Reddit
      </a>
    </li>
    <!-- Add more socials as needed -->
  </ul>
</main>

<style lang="scss">
@import '$lib/styles/global.scss';
.about {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: $glass-bg;
  border-radius: 1rem;
  box-shadow: $glass-shadow;
  text-align: center;
}
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  background: #222;
}
.handle {
  color: $accent;
  font-size: 1rem;
}
.about-section {
  margin: 0 0 1rem 0;
  p {
    margin: 0;
    font-size: 1.08rem;
  }
}
.about-heading {
  margin-top: 0.5rem;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
  color: $primary;
  letter-spacing: 0.03em;
}
.socials {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  li a {
    color: $primary;
    font-weight: bold;
    text-decoration: none;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    &:hover {
      color: $accent;
    }
    i {
      font-size: 1.3em;
    }
  }
}
</style>