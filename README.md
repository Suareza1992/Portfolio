# Ángel Suárez — Portfolio

A single-page personal portfolio: a fixed hero with a parallax portrait, and
glassmorphic panels that slide in over it for About, Projects and Contact.

Static HTML, CSS and vanilla JavaScript. No framework, no server, no runtime
dependencies. The only build step compiles Tailwind ahead of time.

---

## Run it locally

```bash
python3 -m http.server 3001
```

Then open <http://localhost:3001>.

Use this rather than `npx serve`. `serve` rewrites URLs by default — it strips
`/index.html` and the trailing slash, which changes the document's base URL and
breaks the templates gallery's relative links locally even though they are
correct. `http.server` serves files exactly as requested, the same as GitHub
Pages, so what you see locally is what ships.

## Build the CSS

Tailwind is **compiled ahead of time** and the result is committed, so
deploying stays a matter of copying static files. It is not loaded from a CDN —
`cdn.tailwindcss.com` ships a full compiler to every visitor and is not meant
for production.

```bash
npm install        # once
npm run build:css  # writes assets/tailwind.css
```

While working on styles:

```bash
npm run watch:css
```

**Re-run `npm run build:css` and commit `assets/tailwind.css` whenever you add
or change a Tailwind class in `index.html` or `main.js`.** Tailwind only emits
the classes it finds in the files listed under `content` in
`tailwind.config.js`; a class added without a rebuild simply will not exist in
the stylesheet.

---

## Project layout

```
index.html          markup for every panel
main.js             project data, navigation, focus handling, contact form
styles.css          hand-written CSS: layout, glass panels, transitions
src/input.css       Tailwind entry point (source for the build)
tailwind.config.js  content globs for the Tailwind build
assets/
  tailwind.css      generated — do not edit by hand
  portrait-*.webp   responsive portrait (WebP)
  portrait-900.png  fallback for browsers without WebP
  favicon.svg
templates/
  index.html        gallery of the ten business templates
  01-barberia/ …    one self-contained site per folder
```

## The templates section

`templates/` is a gallery of ten complete business websites (Spanish, aimed at
Puerto Rico businesses), shipped with the portfolio and linked from the fourth
project card. Each site is a single self-contained `index.html` — no build, no
dependencies, no images.

The gallery links to them with **relative** paths (`01-barberia/index.html`),
which is why the local server must not rewrite URLs — see "Run it locally".
To add or remove a template, edit the array near the bottom of
`templates/index.html`; the `href` is relative to `templates/`.

## Adding a project

Projects live in one array at the top of `main.js` — the cards and the detail
view are both rendered from it, so this is the only place to edit:

```js
{
  title: "Project name",
  role: "Your role · Client project",
  status: "live",                           // "live" or "wip"
  description: "A paragraph shown on the detail page.",
  highlights: ["Bullet one", "Bullet two"],
  techStack: ["Node.js", "PostgreSQL"],
  liveLink: "https://example.com",          // optional
  liveLabel: "Browse the templates",        // optional, overrides the button text
  repoLink: "https://github.com/you/repo",  // optional
  videoSrc: "assets/demo.mp4",              // optional
}
```

`status` drives the pill on the card and the detail view: `"live"` reads
**Live**, `"wip"` reads **In development** in amber. It describes build state,
not link availability — a project can be live without public source.

`liveLink`, `repoLink` and `videoSrc` are all optional. The detail view only
renders buttons for links that exist, so a project never links to a dead `#`.
A project with neither link shows a short "private repository" note instead.
Without `videoSrc`, the media column is dropped and the copy uses the full
panel width.

## Contact form

The form posts through [EmailJS](https://www.emailjs.com/docs/) directly from
the browser — there is no backend. The three IDs at the top of `main.js` are
public by design; EmailJS expects them in client code.

Restrict them under **Account → Security → Allowed origins** so the template
can only be sent from this site's domain. Without that, anyone can send through
your template from anywhere.

## Layout notes

The desktop hero is deliberate rather than incidental. The portrait's width and
inset are CSS custom properties (`--portrait-width`, `--portrait-inset`), and
the hero copy derives its right-hand boundary from them:

```css
right: calc(var(--portrait-inset) + var(--portrait-width) + var(--gutter));
```

That is what keeps the headline off the photo at every viewport width. If you
change the portrait's size or position, change the custom properties — do not
hard-code a new width on the copy, or the two will drift apart again.

Panels are revealed with a forced reflow (`void page.offsetWidth`) rather than
`requestAnimationFrame`. Browsers pause rAF in background tabs, which would
leave a panel that was opened just before switching away stuck invisible.

## Deploying

Everything needed is committed, so any static host works — push the repo and
point the host at the root.

For GitHub Pages the repository must be **public**. Update `og:url`, `og:image`
and the canonical link in `index.html` if you deploy to a custom domain.
