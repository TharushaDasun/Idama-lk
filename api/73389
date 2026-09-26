// GET  /api/listings            -> search/list listings (query params: status, category, province, city, minPrice, maxPrice)
// POST /api/listings            -> create a new listing (from the seller "Add Property" form)
const { createListing, searchListings } = require('../lib/listings');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const listings = await searchListings(req.query);
      res.status(200).json({ listings });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const listing = await createListing(req.body || {});
      res.status(201).json({ listing });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create listing' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
