const jwt = require('jsonwebtoken');
const { findById } = require('../data/users');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer (\S+)$/);
      console.log('Authorization header:', header ? header.slice(0, 30) + '...' : '(none)');

    if (!match) {
        return res.status(401).json({ error: 'Not logged in.'});
    }

    try {
        const payload = jwt.verify(match[1], process.env.JWT_SECRET);
        const user = findById(payload.userId);
        if(!user) {
            return res.status(401).json({ error: 'Not logged in.'});
        }
        req.user = user;
        return next();
    } catch (err) {
        console.log('requireAuth error:', err.message);
        return res.status(401).json({ error: 'Not logged in.'});
    }
}

module.exports = requireAuth;