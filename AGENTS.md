<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project: AuraAI Video Creator

### Stack
- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** — uses `@import "tailwindcss"`, NOT `@tailwind base/components/utilities`
- **Prisma ORM v7** — uses `prisma-client` generator (NOT `prisma-client-js`), driver adapter required
- **Neon PostgreSQL** via `@prisma/adapter-pg`
- **Anthropic Claude** (`claude-opus-4-5`) for script generation
- **D-ID API** for avatar video generation
- **Vercel Blob** for file storage

### Key conventions
- Prisma client is at `generated/client/client.ts` (imported as `@generated/client/client`)
- Prisma config is at `prisma7.config.ts` (not `prisma.config.ts`)
- All API params are `Promise<{...}>` — always `await params` before use
- `react-hot-toast` for notifications (not sonner)

### Commands
```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # prisma generate + next build
npx prisma generate  # regenerate Prisma client after schema changes
npx prisma migrate dev --name <name>  # create and apply migration
```

### Environment variables required
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DIRECT_URL` | Same (direct connection for migrations) |
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `DID_API_KEY` | D-ID avatar API key (Basic auth encoded) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
| `NEXT_PUBLIC_APP_URL` | App base URL |

### Vercel Deployment
1. Go to https://vercel.com/new
2. Import from GitHub: `kevin21quirk/videocreation`
3. Set **Root Directory** to `video-app`
4. Add all environment variables listed above
5. Deploy — `prisma generate` runs automatically via `postinstall`

### D-ID API Key format
The D-ID API uses HTTP Basic Auth. The `DID_API_KEY` env var should be the
**base64-encoded** value of `username:password` (or just the API key as shown
in the D-ID dashboard — they sometimes provide it pre-encoded).
