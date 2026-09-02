# WordPress Playground

This directory contains [WordPress Playground](https://wordpress.org/playground/) blueprints for demoing and testing H2, plus the demo content they seed.

## Try the demo (no install)

Open the public blueprint on playground.wordpress.net:

> https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/humanmade/h2/main/.playground/blueprint.json

This spins up a temporary WordPress site in your browser with:

- The built H2 theme from the [`release` branch](https://github.com/humanmade/h2/tree/release), activated
- The required [Asset Loader](https://github.com/humanmade/asset-loader) plugin
- A small demo team (users, categories, pages, posts, and comments)
- You logged in as `admin`

The other demo accounts (`kanako`, `riley`, `sam`) all use the password `password`.

You can also run the same blueprint locally without Docker:

```sh
npm run playground:demo
```

## Test your local checkout

To run the theme from your working copy (including uncommitted changes) in Playground:

```sh
npm run build      # or `npm start` in another terminal for the dev server
npm run playground
```

This mounts the repository at `wp-content/themes/h2` inside Playground using `blueprint-local.json`, activates it, and seeds the same demo content. Local changes to PHP are picked up on reload; changes to JS/CSS need a rebuild (or the dev manifest via `npm start`).

## Files

- `blueprint.json` — public demo blueprint. Self-contained: installs the theme from the `release` branch and embeds a copy of `demo-content.php`, so it works from a URL with no other files.
- `blueprint-local.json` — local development blueprint. Expects the repo mounted at `/wordpress/wp-content/themes/h2` (the `npm run playground` script does this) and runs `demo-content.php` from the mount.
- `demo-content.php` — the demo content seed script. This is the source of truth.

## Editing the demo content

Edit `demo-content.php`, then sync the embedded copy in `blueprint.json`:

```sh
node -e "const fs=require('fs');const p='.playground/blueprint.json';const bp=JSON.parse(fs.readFileSync(p,'utf8'));bp.steps.find(s=>s.step==='runPHP').code=fs.readFileSync('.playground/demo-content.php','utf8');fs.writeFileSync(p,JSON.stringify(bp,null,'\t')+'\n')"
```

`blueprint-local.json` needs no sync — it loads the file directly.
