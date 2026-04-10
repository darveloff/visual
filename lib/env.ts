type EnvConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  // #region agent log
  fetch("http://127.0.0.1:7409/ingest/c52de449-0a85-4260-8a9f-34e8cd43f571", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5200d9" },
    body: JSON.stringify({
      sessionId: "5200d9",
      runId: "env-missing-debug",
      hypothesisId: "H1-H3",
      location: "lib/env.ts:getEnv:entry",
      message: "Reading server env keys",
      data: {
        hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
        hasSupabaseAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
        nodeEnv: process.env.NODE_ENV ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (cachedEnv) {
    return cachedEnv;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    // #region agent log
    fetch("http://127.0.0.1:7409/ingest/c52de449-0a85-4260-8a9f-34e8cd43f571", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5200d9" },
      body: JSON.stringify({
        sessionId: "5200d9",
        runId: "env-missing-debug",
        hypothesisId: "H1-H4",
        location: "lib/env.ts:getEnv:missingUrl",
        message: "SUPABASE_URL missing before throw",
        data: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseAnonKey: Boolean(supabaseAnonKey),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw new Error("Missing SUPABASE_URL environment variable.");
  }

  if (!supabaseAnonKey) {
    // #region agent log
    fetch("http://127.0.0.1:7409/ingest/c52de449-0a85-4260-8a9f-34e8cd43f571", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5200d9" },
      body: JSON.stringify({
        sessionId: "5200d9",
        runId: "env-missing-debug",
        hypothesisId: "H1-H4",
        location: "lib/env.ts:getEnv:missingAnon",
        message: "SUPABASE_ANON_KEY missing before throw",
        data: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseAnonKey: Boolean(supabaseAnonKey),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw new Error("Missing SUPABASE_ANON_KEY environment variable.");
  }

  // #region agent log
  fetch("http://127.0.0.1:7409/ingest/c52de449-0a85-4260-8a9f-34e8cd43f571", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5200d9" },
    body: JSON.stringify({
      sessionId: "5200d9",
      runId: "env-missing-debug",
      hypothesisId: "H2-H4",
      location: "lib/env.ts:getEnv:success",
      message: "Env keys loaded successfully",
      data: { hasSupabaseUrl: true, hasSupabaseAnonKey: true },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  cachedEnv = { supabaseUrl, supabaseAnonKey };
  return cachedEnv;
}
