<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

## Project notes

Next.js 16.4 App Router at the repo root (`app/`, not `src/app`), React 19, Tailwind v4. The README is create-next-app boilerplate; trust this file and the code instead. `next dev` rewrites only the managed blocks above; this section is safe to edit.

### Commands
- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` runs `eslint` over the whole repo. `next build` typechecks but no longer runs ESLint.
- `npx next typegen && npx tsc --noEmit` — typecheck without a full build. Run `typegen` after adding or moving routes: `PageProps`/`LayoutProps` are generated into `.next/types`, and `tsc` fails without them.
- No test runner. Verify with typecheck/build or by hitting the dev server.
- Known baseline failures: lint reports unescaped apostrophes in `app/joined-events` and `app/signin`, and `tsc` errors on the `Select` `onValueChange` handler in `app/create-event`. Check whether they predate your change instead of chasing them.
- One `next dev` per project: a second start exits and prints the existing PID. `Can't resolve 'shadcn/tailwind.css'` in dev while `next build` succeeds means stale `.next` state — stop dev, delete `.next`, restart.

### Architecture
- The frontend talks to a **separate API at `http://localhost:5000`**, hardcoded in pages/components. Event pages need that server running; there are no local event routes.
  - `GET /upcoming-events`, `GET /events`, `GET /events/:id`, `POST /events`, `PATCH/DELETE /events/:id`, `POST /join-event`, `GET /joined-events?email=`.
  - Don't move these fetches into `app/api` unless the backend move is intentional.
- Auth is better-auth + MongoDB: `lib/auth.ts` (db `uddokta-bd`), mounted by `app/api/auth/[...all]/route.ts`, client/hooks in `lib/auth-client.ts`. Needs `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` in `.env` (gitignored).
  - `/profile` edits the user through `authClient.updateUser` (name, `image`) and `authClient.changeEmail` (email). Email changes only work because `user.changeEmail` is enabled with `updateEmailWithoutVerification`; there is no email provider, so verified (Google) accounts cannot change email.
- `proxy.ts` at the repo root is Next 16's Proxy (renamed middleware). It redirects unauthenticated `/create-event`, `/manage-events`, `/joined-events`, and `/profile` to `/signin`. It only checks that the session cookie exists (better-auth's optimistic check), not that the session is valid.
- Routes: `/`, `/about`, `/upcoming-events`, `/events/[id]`, `/create-event`, `/manage-events`, `/joined-events`, `/profile`, `/signin`, `/signup`. `signin` still links to `/register`; the real route is `/signup`.
- `components/ui` holds shadcn primitives, `components/shared` Navbar/Footer, `components/home` landing sections. `@/*` maps to the repo root.
- `toast` from `react-toastify` is called in Navbar/auth/manage-events, but no `ToastContainer` is mounted in `app/layout.tsx`, so toasts do not render yet.

### Toolchain / styling
- `cacheComponents` and `partialPrefetching` are enabled. Use `"use cache"` and Suspense per `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`, not older caching patterns.
- Tailwind v4 runs through the `@tailwindcss/turbopack` loader rule in `next.config.ts`; there is no `postcss.config.*`. Do not add a PostCSS setup without replacing it.
- shadcn `base-nova` uses Base UI (`@base-ui/react`), not Radix. Keep `@base-ui/react`, `class-variance-authority`, `cn`, and `tw-animate-css` in `package.json` even if a generator omits them.
- Class merging is `import { cn } from "cn"` (the `cn` package, not clsx/tailwind-merge); `lib/utils.ts` re-exports it.
- The font is Belgrano (`--font-belgrano`) in `app/layout.tsx`, not Geist.
- Colors are hardcoded and two greens coexist: pages/home use `#14A06F` (hover `#10875E`, sometimes `#10865D`), orange `#F0562F`, hero `#064E3B`; the Navbar uses `#14532d` (hover `#166534`). `app/globals.css` tokens are neutral shadcn defaults — match the neighboring component instead of substituting them.
- `public/Image/` is capitalized; asset paths must match case (`/Image/uddokta-logo.png`) or break on Linux/Vercel.
