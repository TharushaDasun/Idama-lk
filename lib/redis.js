// Upstash Redis client. Reads the URL/token from environment variables set in
// Vercel (Settings > Environment Variables). Quotes and stray spaces are
// stripped, so pasting "value" with quotes still works.
const { Redis } = require('@upstash/redis');

const clean = (v) => String(v || '').trim().replace(/^["']+|["']+$/g, '').trim();

const url = clean(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL);
const token = clean(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);

if (!url || !token) {
  throw new Error('Missing Upstash env vars: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN on the Idama-lk project in Vercel.');
}

const redis = new Redis({ url, token });

module.exports = { redis };
