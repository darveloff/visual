create table if not exists public.generation_runs (
  id bigint generated always as identity primary key,
  source_url text not null,
  node_id text,
  output_json jsonb not null,
  status text not null default 'success',
  created_at timestamptz not null default now()
);

create index if not exists generation_runs_created_at_idx
  on public.generation_runs (created_at desc);