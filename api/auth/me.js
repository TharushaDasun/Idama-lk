const { getSession } = require('../../lib/session');
const { findUserById, toPublic } = require('../../lib/users');

module.exports = async (req, res) => {
  // This response is specific to whoever's session cookie sent the request —
  // it must never be cached by the browser or any CDN in between, or the
  // next person (or the same person after switching Google accounts) could
  // be served someone else's cached identity.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const session = getSession(req);
  if (!session) return res.status(401).json({ user: null });

  try {
    const user = await findUserById(session.id);
    if (!user) return res.status(401).json({ user: null });
    res.status(200).json({ user: toPublic(user) });
  } catch (err) {
    res.status(500).json({ error: 'Could not load account' });
  }
};
