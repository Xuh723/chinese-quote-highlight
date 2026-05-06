# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is an **Obsidian community plugin** written in TypeScript. The plugin ID is `silly-tavern-format` and the release name is `Silly Tavern Export Format`.

- Entry point: `src/main.ts`, bundled by esbuild to `main.js` at the repository root.
- Required release artifacts: `main.js`, `manifest.json`, and optional `styles.css`.
- The project uses npm and esbuild (see `esbuild.config.mjs` and `package.json`).
- No test runner is configured; testing is manual.

## Common commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start esbuild in watch mode (rebuilds on change). |
| `npm run build` | Run TypeScript type-checking (`tsc -noEmit -skipLibCheck`) then esbuild in production mode. |
| `npm run lint` | Run ESLint with `typescript-eslint` and `eslint-plugin-obsidianmd`. |
| `npm run version` | Bump `manifest.json` and `versions.json` from `package.json` version and stage them. |

To manually test the plugin, copy `main.js`, `manifest.json`, and `styles.css` (if present) into:
```
<Vault>/.obsidian/plugins/silly-tavern-format/
```
Then reload Obsidian and enable the plugin in **Settings → Community plugins**.

## Architecture

- **Source code lives in `src/`**. Keep `main.ts` minimal and focused on plugin lifecycle (`onload`, `onunload`, command registration, settings loading). Delegate feature logic to separate modules.
- **`src/settings.ts`** contains the settings interface, defaults, and the `PluginSettingTab` UI. Settings are persisted with `this.loadData()` / `this.saveData()`.
- **Build configuration**: `esbuild.config.mjs` bundles everything into `main.js` (CommonJS, target `es2018`). It externalizes `obsidian`, `electron`, all CodeMirror packages, and Node built-in modules.
- **`manifest.json`** declares plugin metadata. Never change the `id` after release. Keep `minAppVersion` accurate when using newer APIs.
- **`versions.json`** maps each plugin version to the minimum Obsidian app version required.
- **TypeScript config**: `tsconfig.json` enables strict checking (`strictNullChecks`, `noUncheckedIndexedAccess`, `noImplicitAny`, etc.) and uses `baseUrl: "src"`.
- **Linting**: Configured in `eslint.config.mts` using the flat config format. It ignores `node_modules`, `dist`, `main.js`, build scripts, and `versions.json`.

## CI

`.github/workflows/lint.yml` runs on push and PR to any branch, testing Node 20.x and 22.x with:
```
npm ci && npm run build && npm run lint
```

## Important conventions

- Use `this.registerEvent`, `this.registerDomEvent`, and `this.registerInterval` for any listeners so they are cleaned up automatically on plugin unload.
- Prefer `async/await` over promise chains. Handle errors gracefully.
- Bundle all runtime dependencies into `main.js`. Avoid large dependencies and Node/Electron APIs unless the plugin is desktop-only (`isDesktopOnly: true`).
- Command IDs and settings keys are stable APIs once released; avoid renaming them.
- Default to local/offline operation. Only make network requests when essential, and disclose them clearly.

## Reference

- Detailed developer conventions, code snippets, and troubleshooting are documented in `AGENTS.md`.
- Obsidian API docs: https://docs.obsidian.md
- Plugin guidelines: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
