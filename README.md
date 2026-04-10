# Visual - Figma-to-Production Mini Builder

Weekend MVP that ingests a Figma URL, generates section-based output, and stores generation runs in Supabase.

## Requirements

- Node.js 20+
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

- `POST /api/ingest-figma`: validate/parse Figma URL
- `POST /api/generate`: run generation pipeline + persist run
- `GET /api/history`: fetch last 10 generation runs

## Database Setup

Run SQL in Supabase SQL editor:

`supabase/migrations/001_generation_runs.sql`

## Current Limitation

`fetchDesignContext` currently returns deterministic mock data for pipeline iteration.
Replace with a server-side Figma context adapter when ready.
