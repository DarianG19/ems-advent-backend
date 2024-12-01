const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Door = require("../models/Door");
const auth = require('../middleware/auth');
const router = express.Router();

// Anmeldung
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log("User: ", user.id);
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        /*res.cookie('jwt', token, {
            httpOnly: true, // Verhindert Zugriff über JavaScript (XSS-Schutz)
            secure: process.env.NODE_ENV === 'production', // Nur über HTTPS
            maxAge: 3600000, // 1 Stunde
            sameSite: 'none', // CSRF-Schutz
        });*/
        res.setHeader('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=None`);

        res.status(200).json({ msg: 'Login successful' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Abmeldung
router.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    res.status(200).json({ msg: 'Logout successful' });
});

router.get('/check', auth, async (req, res) => {
    try {
        res.status(200).send('Authenticated');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;


module.exports = router;
