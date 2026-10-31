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

Next.js 16 App Router, React 19, Tailwind CSS v4. `next dev` rewrites only the managed blocks above; this section is safe to edit.

### Commands
- `npm run dev` / `npm run build` / `npm run lint`
- `npx next typegen && npx tsc --noEmit` — typecheck routes without a full build. `next build` typechecks but no longer runs ESLint.
- No test runner is configured. Verify changes by building or hitting the dev server.

### Toolchain quirks
- Tailwind v4 runs through the `@tailwindcss/turbopack` loader rule in `next.config.ts`; there is no `postcss.config.*`. Do not add a PostCSS setup without replacing this one.
- `cacheComponents` and `partialPrefetching` are enabled. Follow `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` (`"use cache"`, Suspense boundaries) instead of older caching patterns.
- Route props use globally generated helpers (`LayoutProps<'/'>`, `PageProps<'/x/[id]'>`) with no import. They live in `.next/types`, so run `next typegen` after adding routes or `tsc` fails.
- Only one `next dev` per project: a second start exits and prints the existing PID. Reuse or kill that process.
- `Can't resolve 'shadcn/tailwind.css'` in dev while `next build` succeeds means stale `.next` state: stop dev, delete `.next`, restart. The import and package export are valid.

### UI / styling
- shadcn `base-nova` style uses Base UI (`@base-ui/react`), not Radix. `components/ui/*` import `@base-ui/react`, `class-variance-authority`, and `cn` directly, so those must stay in `package.json` even if the generator does not add them.
- Class merging is `import { cn } from "cn"` (shadcn's `cn` package, replacing clsx + tailwind-merge); `lib/utils.ts` re-exports it. Do not switch to clsx/tailwind-merge.
- `@/*` maps to the repo root. `components/ui` holds shadcn primitives; `components/shared` holds app components.
- Brand green is hardcoded (`#14532d`, hover `#166534`) in components. The shadcn tokens in `app/globals.css` are neutral defaults, so reuse the green rather than the default palette.
- `public/Image/` is capitalized; asset paths must match case (`/Image/uddokta-logo.png`) or break on Linux/Vercel.
