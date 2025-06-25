# Luuk's Lab Blog
<p align="center">
  <a href="https://github.com/LuckyLuuk12">
    <img alt="Author" src="https://img.shields.io/badge/Author-Luuk%20Kablan-blue?logo=github">
  </a>
  <a href="https://github.com/LuckyLuuk12/LuuksLab/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/LuckyLuuk12/LuuksLab?color=brightgreen">
  </a>
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/LuckyLuuk12/LuuksLab?style=social">
</p>

<p align="center">
  <a href="https://kit.svelte.dev/">
    <img alt="SvelteKit" src="https://img.shields.io/badge/SvelteKit-Serverless-orange?logo=svelte&logoColor=white">
  </a>
  <a href="https://orm.drizzle.team/">
    <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle%20ORM-TypeSafe-blueviolet">
  </a>
  <a href="https://developers.cloudflare.com/d1/">
    <img alt="Cloudflare D1" src="https://img.shields.io/badge/Cloudflare%20D1-SQLite%20Serverless-orange">
  </a>
</p>

## What

**Luuk's Lab** is a modern, full-stack blog platform built with [SvelteKit](https://kit.svelte.dev/), [Drizzle ORM](https://orm.drizzle.team/), and [Cloudflare D1](https://developers.cloudflare.com/d1/).  
It features a clean UI, live post previews, Markdown/HTML support, user authentication, reactions, and comments.  
This project serves as both a personal blog and a template for anyone wanting to build their own SvelteKit-powered blog with a serverless backend.

---

## How (Setup & Local Development)

### 1. **Clone the repository**
```sh
git clone https://github.com/luukkablan/luuks-lab.git
cd luuks-lab
```

### 2. **Install dependencies**
```sh
npm install
```

### 3. **Configure environment variables**
- Copy `.env.example` to `.env` and fill in the required values (e.g., Cloudflare D1 credentials).

### 4. **Run database migrations**
```sh
npx drizzle-kit push
```
*(Or use `npx wrangler d1 migrations apply DB` if using Wrangler directly)*

### 5. **Start the development server**
```sh
npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### 6. **(Optional) Open in browser automatically**
```sh
npm run dev -- --open
```

---

## Where

- **Live site:** [https://luuks-lab.kablan.nl/](https://luuks-lab.kablan.nl/)
- **Documentation:**  
  - [SvelteKit Docs](https://kit.svelte.dev/docs)
  - [Drizzle ORM Docs](https://orm.drizzle.team/docs)
  - [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- **Source code:** [https://github.com/luukkablan/luuks-lab](https://github.com/luukkablan/luuks-lab)
- **Contact:** See the [about page](https://luuks-lab.kablan.nl/about) on the live site.

---

> **Note:**  
> If you want to use this as a base for your own site, fork the repo, update the branding, and follow the setup steps above.  
> For Cloudflare D1, make sure to configure your own database and environment variables.

---