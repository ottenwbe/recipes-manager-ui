# AGENTS.md — recipes-manager-ui

React frontend for [recipes-manager](https://github.com/ottenwbe/recipes-manager). TypeScript + Vite 8 + MUI + Jest.

## Commands

```sh
npm install          # install deps
npm run dev          # Vite dev server on :3000, proxies /api → localhost:8080
npm run build        # typecheck (tsc --noEmit) + vite build → dist/
npm run preview      # serve the production build
npm run lint         # ESLint flat config (eslint.config.js)
npm test             # Jest + jsdom (Babel: preset-env, preset-react automatic, preset-typescript)
npm run typecheck    # tsc --noEmit only
```

**Verification order:** `npm run lint` → `npm test` → `npm run build`

## Project structure

```
src/
├── api/                  # API layer — single source of truth for backend contracts
│   ├── types.ts          #   Recipe, RecipeComponent, response shapes (verified vs Go/Python backend)
│   ├── recipes.ts        #   typed fetch wrappers with runtime validation
│   └── index.ts          #   re-exports
├── components/
│   └── AppShell.tsx      # App shell: header, drawer, main, footer (no routing logic)
├── context/
│   └── RecipeCountContext.tsx  # { count, refresh } — badge count + refresh callback
├── common/
│   ├── components/       # reusable UI: App.tsx (routing only), Home, Footer, PageHeader, ...
│   ├── context/          # TextContext, TextContextProvider (i18n strings)
│   └── types.ts          # re-exports API types + UI extensions (Ingredient, RecipePicture, ...)
├── features/
│   └── recipes/          # recipe feature: Recipes, RecipeForm, RecipeDialog, RecipeAlerts
├── pages/                # index.tsx (lazy App), signup.tsx
├── assets/               # logo.svg
└── index.tsx             # entry point
test/
├── api/recipes.test.ts   # API contract tests (28 total across 5 suites)
├── mocks/fileMock.js     # Jest stub for svg/png imports
└── *.test.*              # component/unit tests
```

## Architecture

- **Entry:** `src/index.tsx` → `src/pages/index.tsx` → lazy `App`
- **Routing only:** `src/common/components/App.tsx` wraps routes in `<AppShell>`
- **Shell:** `src/components/AppShell.tsx` owns layout + recipe count; provides `RecipeCountContext`
- **API layer:** all backend calls go through `src/api/recipes.ts` — never call `fetch()` directly in components
- **Features:** feature-specific code in `src/features/<name>/`; shared UI in `src/common/components/`

## Backend API contracts (verified)

| Endpoint | Response shape | Notes |
|----------|---------------|-------|
| `GET /api/v1/recipes/num` | bare number as string | `c.String()` in Go — parse with `parseInt` |
| `GET /api/v1/recipes` | `{ recipes: string[] }` | `RecipeList` struct |
| `GET /api/v1/recipes?name=&description=` | `{ recipes: string[] }` | search |
| `GET /api/v1/recipes/r/:id?servings=` | `Recipe` object directly | no envelope |
| `GET /api/v1/recipes/rand` | `Recipe` object directly | no envelope |
| `DELETE /api/v1/recipes/r/:id` | 200 empty | |
| `GET /api/v1/recipes/r/:id/pictures/:name/` | `{ id, name, picture }` JSON | |
| `GET /api/v1/recommendation/:id/components` | `{ recipes: string[] }` | Python recommender |

## Gotchas

- Dev proxy: `vite.config.ts` proxies `/api` → `http://localhost:8080` (backend must be running)
- Jest can't parse SVG imports — mapped to `test/mocks/fileMock.js` via `moduleNameMapper`
- `response.json() as T` is compile-time only; API layer adds runtime validators (`validateRecipe`, `validateRecipesResponse`)
- Helm ingress: `/api/v1/recommendation` → recommender; `/api`, `/swagger` → backend; `/` → UI
- Docker in this env is a Podman shim; push with `podman push --tls-verify=false`

## Conventions

- Components: PascalCase, one per file, default export for pages
- Types: API contracts in `src/api/types.ts`; UI extensions in `src/common/types.ts`
- Hooks: `useCallback` for functions passed to children/effects; don't overuse
- Commits: conventional style (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`)
