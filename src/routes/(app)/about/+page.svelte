<main class="about">
  <h1>About Me</h1>
  <img src="/img/header.png" alt="Luuk Kablan" class="profile-img" />
  <h2>BSc. Luuk Kablan <span class="handle">(@LuckyLuuk_)</span></h2>

  <div class="about-section">
    <p>
      Hi, I am Luuk Kablan, also known online as <strong>LuckyLuuk_</strong>. I
      am a software developer from the Netherlands focused on building modern,
      reliable web applications.
    </p>
  </div>

  <div class="about-section">
    <p>
      I enjoy combining thoughtful frontend experiences with robust backend
      systems, turning ideas into products that are both intuitive and
      technically solid. Practical impact and maintainability are central to how
      I design and ship software.
    </p>
  </div>

  <div class="about-section">
    <p>
      Outside software, I spend time gaming, studying, and playing football.
      Those activities keep me curious, disciplined, and collaborative.
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
      <a
        href="https://linkedin.com/in/luuk-kablan"
        target="_blank"
        rel="noopener"
      >
        <i class="fab fa-linkedin"></i> LinkedIn
      </a>
    </li>
    <!-- Add more socials as needed -->
  </ul>
</main>

<style lang="scss">
  @use "$lib/styles/colors.scss" as *;
  .about {
    max-width: 760px;
    margin: 1.5rem auto;
    padding: clamp(1.2rem, 4vw, 2.2rem);
    background: $glass-bg;
    border-radius: 1.1rem;
    box-shadow: $glass-shadow;
    text-align: center;
    border: 1px solid rgba($border, 0.75);
  }
  .profile-img {
    width: 108px;
    height: 108px;
    border-radius: 50%;
    margin: 0.55rem auto 1rem;
    object-fit: cover;
    background: $surface;
    border: 2px solid rgba($primary, 0.55);
  }
  .handle {
    color: $text-muted;
    font-size: 0.95rem;
  }
  .about-section {
    margin: 0 0 0.6rem;
    p {
      color: $text-muted;
      line-height: 1.65;
      max-width: 62ch;
      margin: 0 auto;
    }
  }
  .about-heading {
    margin-top: 1rem;
    margin-bottom: 0.8rem;
    font-size: 1.15rem;
    color: $primary;
    letter-spacing: 0.02em;
  }
  .socials {
    list-style: none;
    padding: 0;
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    li a {
      color: $text;
      font-weight: 600;
      text-decoration: none;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba($surface, 0.75);
      border: 1px solid rgba($border, 0.72);
      border-radius: 999px;
      padding: 0.35rem 0.8rem;
      &:hover {
        color: $primary;
        border-color: rgba($primary, 0.65);
      }
      i {
        font-size: 1.1em;
      }
    }
  }
</style>
