import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** Server-only uploads (service role). Never import in client components. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export async function uploadBuffer(args: {
  bucket: string;
  path: string;
  body: Buffer | Blob;
  contentType: string;
}) {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)");
  const { error } = await sb.storage.from(args.bucket).upload(args.path, args.body, {
    contentType: args.contentType,
    upsert: true,
  });
  if (error) throw error;
  return { path: args.path };
}

export async function getSignedUrl(bucket: string, path: string, expiresSec = 3600) {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase is not configured");
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, expiresSec);
  if (error) throw error;
  return data.signedUrl;
}

