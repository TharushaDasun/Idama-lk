// GET  /api/listings            -> search/list listings (query params: status, category, province, city, sellerId, minPrice, maxPrice)
// POST /api/listings            -> create a new listing (from the seller "Add Property" form) — requires a logged-in session
const { createListing, searchListings } = require('../lib/listings');
const { getSession } = require('../lib/session');
const { findUserById } = require('../lib/users');

module.exports = async (req, res) => {
  // Listing data changes per request (and per logged-in seller when
  // ?sellerId=... is used) — never let the browser or a CDN cache this.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (req.method === 'GET') {
    try {
      const listings = await searchListings(req.query);
      // TEMPORARY diagnostic logging — remove once the "same listings for
      // every account" issue is confirmed fixed.
      console.log('/api/listings GET query:', req.query,
        '-> returned', listings.length, 'listing(s), sellerIds:', listings.map(l => l.sellerId));
      res.status(200).json({ listings });
    } catch (err) {
      console.error('GET /api/listings failed:', err);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
    return;
  }

  if (req.method === 'POST') {
    const session = getSession(req);
    if (!session) return res.status(401).json({ error: 'Please log in to list a property' });

    try {
      const user = await findUserById(session.id);
      if (!user) return res.status(401).json({ error: 'Please log in to list a property' });

      // sellerId/sellerName/sellerContact always come from the verified
      // session, never from the request body — a client can't post a
      // listing under someone else's name.
      const listing = await createListing({
        ...(req.body || {}),
        sellerId: user.id,
        sellerName: user.name,
        sellerContact: user.phone || '',
      });
      console.log('/api/listings POST created:', { id: listing.id, sellerId: listing.sellerId, sellerName: listing.sellerName, sessionUserId: user.id });
      res.status(201).json({ listing });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create listing' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
