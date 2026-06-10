import { env } from "./env";

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let accessToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: env.CJ_API_EMAIL, password: env.CJ_API_TOKEN }),
  });

  const data = await res.json();
  if (!data.result) throw new Error(`CJ auth failed: ${data.message}`);

  accessToken = data.data.accessToken as string;
  // tokens expire in 30 days; refresh every 29 days
  tokenExpiry = Date.now() + 29 * 24 * 60 * 60 * 1000;
  return accessToken;
}

export async function cjFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${CJ_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
      ...(options.headers ?? {}),
    },
  });
  return res.json();
}
