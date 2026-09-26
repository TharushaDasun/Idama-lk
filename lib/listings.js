// Data-access layer for property listings, stored in Upstash Redis.
// Each listing is a JSON object at key `listing:<id>`, and every id is
// tracked in the set `listings:index` so we can list/search them.
const { redis } = require('./redis');

function newId() {
  return 'lst_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function createListing(data) {
  const id = newId();
  const listing = {
    id,
    title: data.title || '',
    category: data.category || '',        // land | house | apartment | commercial
    price: Number(data.price) || 0,
    priceUnit: data.priceUnit || 'sale',   // sale | month (for rent)
    province: data.province || '',
    city: data.city || '',
    perches: data.perches ? Number(data.perches) : null,
    bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
    bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
    floor: data.floor ? Number(data.floor) : null,
    floorAreaSqft: data.floorAreaSqft ? Number(data.floorAreaSqft) : null,
    description: data.description || '',
    images: data.images || [],
    sellerName: data.sellerName || '',
    sellerContact: data.sellerContact || '',
    status: 'pending',                    // pending | active | rejected
    reportCount: 0,
    createdAt: new Date().toISOString(),
  };
  await redis.set(`listing:${id}`, listing);
  await redis.sadd('listings:index', id);
  return listing;
}

async function getListing(id) {
  return redis.get(`listing:${id}`);
}

async function updateListing(id, patch) {
  const existing = await redis.get(`listing:${id}`);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await redis.set(`listing:${id}`, updated);
  return updated;
}

async function deleteListing(id) {
  await redis.del(`listing:${id}`);
  await redis.srem('listings:index', id);
  return true;
}

// filters: { status, category, province, city, minPrice, maxPrice }
async function searchListings(filters = {}) {
  const ids = await redis.smembers('listings:index');
  if (!ids.length) return [];
  const listings = await Promise.all(ids.map((id) => redis.get(`listing:${id}`)));

  return listings
    .filter(Boolean)
    .filter((l) => !filters.status || l.status === filters.status)
    .filter((l) => !filters.category || l.category === filters.category)
    .filter((l) => !filters.province || l.province === filters.province)
    .filter((l) => !filters.city || l.city === filters.city)
    .filter((l) => !filters.minPrice || l.price >= Number(filters.minPrice))
    .filter((l) => !filters.maxPrice || l.price <= Number(filters.maxPrice))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { createListing, getListing, updateListing, deleteListing, searchListings };
