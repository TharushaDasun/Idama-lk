// User accounts, stored in Upstash Redis. Identity comes entirely from
// Google — there is no password. Each user is a JSON object at key
// `user:<id>`, and `user:byGoogleId:<googleId>` maps a Google account's
// stable "sub" id to our internal user id.
const { redis } = require('./redis');

function newId() {
  return 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function findUserByGoogleId(googleId) {
  const id = await redis.get('user:byGoogleId:' + googleId);
  if (!id) return null;
  return redis.get('user:' + id);
}
async function findUserById(id) {
  if (!id) return null;
  return redis.get('user:' + id);
}

// Creates the user on first Google login, or just returns them on later
// logins. Also refreshes name/picture in case they changed on Google's side.
async function findOrCreateGoogleUser({ googleId, email, name, picture }) {
  let user = await findUserByGoogleId(googleId);
  if (user) {
    const updated = { ...user, name: name || user.name, email: email || user.email, picture: picture || user.picture };
    await redis.set('user:' + user.id, updated);
    return updated;
  }
  const id = newId();
  user = {
    id, googleId,
    name: (name || '').trim(),
    email: (email || '').trim().toLowerCase(),
    phone: '',
    picture: picture || '',
    createdAt: new Date().toISOString(),
  };
  await redis.set('user:' + id, user);
  await redis.set('user:byGoogleId:' + googleId, id);
  return user;
}

function toPublic(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, picture: user.picture };
}

module.exports = { findUserByGoogleId, findUserById, findOrCreateGoogleUser, toPublic };
