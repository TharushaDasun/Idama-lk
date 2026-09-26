// GET    /api/listings/:id  -> fetch one listing
// PATCH  /api/listings/:id  -> update fields (e.g. admin sets status: "active" | "rejected")
// DELETE /api/listings/:id  -> remove a listing (e.g. admin deletes a reported one)
const { getListing, updateListing, deleteListing } = require('../../lib/listings');

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const listing = await getListing(id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ listing });
  }

  if (req.method === 'PATCH') {
    const updated = await updateListing(id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ listing: updated });
  }

  if (req.method === 'DELETE') {
    await deleteListing(id);
    return res.status(200).json({ deleted: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
