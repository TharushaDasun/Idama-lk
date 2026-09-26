// Upstash Redis client. Needs UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN set as environment variables (locally in a
// .env file, and in the Vercel project's Settings > Environment Variables).
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = { redis };
