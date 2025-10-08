// Simple in-memory token blacklist.
// For production, use a persistent store with token expiry handling.

const blacklisted = new Set();

function blacklistToken(token) {
  blacklisted.add(token);
}

function isTokenBlacklisted(token) {
  return blacklisted.has(token);
}

module.exports = { blacklistToken, isTokenBlacklisted };


