const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { toPublic } = require('../data/users');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
    res.status(200).json(toPublic(req.user));
});

module.exports = router;