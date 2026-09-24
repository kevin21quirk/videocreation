# AuraAI — AI Video Creator

Turn any idea into a stunning AI avatar video in minutes. Write a quote, describe your vision, upload assets, and let AI do the rest.

## Features

- **AI Script Generation** — Claude AI writes a compelling, natural-sounding script from your quote and description
- **AI Avatar Video** — D-ID brings your script to life with a photorealistic talking avatar
- **Asset Uploads** — Drag & drop images, videos, and audio files
- **Project Dashboard** — Track all your video projects and their status
- **Neon PostgreSQL** — Serverless Postgres database for project storage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL + Prisma ORM v7 |
| AI Script | Anthropic Claude API |
| AI Video | D-ID Avatar API |
| File Storage | Vercel Blob |
| Deployment | Vercel |

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/kevin21quirk/videocreation
cd videocreation/video-app
npm install
```

### 2. Environment Variables

Copy `env.example` to `.env` and fill in your keys:

```bash
cp env.example .env
```

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
ANTHROPIC_API_KEY="sk-ant-..."
DID_API_KEY="your-d-id-api-key"
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Migrations

```bash
npx prisma migrate dev
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Keys Required

| Service | Where to get |
|---------|-------------|
| Anthropic (Claude) | [platform.anthropic.com](https://platform.anthropic.com) |
| D-ID | [studio.d-id.com](https://studio.d-id.com) → API keys |
| Vercel Blob | Vercel dashboard → Storage → Blob |

## Deployment

Deploy to Vercel with one click — all environment variables must be set in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevin21quirk/videocreation)
