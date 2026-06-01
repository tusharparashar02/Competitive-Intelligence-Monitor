const HEALTH_URL = `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/health`;

export async function checkApiConnection() {
  try {
    const res = await fetch(HEALTH_URL, { method: 'GET', signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}
