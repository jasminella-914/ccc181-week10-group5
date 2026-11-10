const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, toPublic } = require('../data/users');

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/', (req, res) => {
    const { email, password } = req.body || {};

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !EMAIL_PATTERN.test(email.trim()) ||
        password.length === 0
    ) {
        return res.status(400).json({error: 'Email and password are required.'});
    }

    const user = findByEmail(email.trim().toLocaleLowerCase());

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({error: 'Invalid email or password.'});
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    return res.status(200).json({token, user: toPublic(user)});
})

module.exports = router;