const express = require('express');
const Door = require('../models/Door');
const auth = require('../middleware/auth');
const router = express.Router();

// Alle eingesammelten Türcheninhalte anzeigen
router.get('/collected', auth, async (req, res) => {
    try {
        const doors = await Door.find({ collected: true });
        res.json(doors);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Route zum Abrufen der Türchendaten
router.get('/:day', auth, async (req, res) => {
    const requestedDay = parseInt(req.params.day);
    const currentDate = new Date();
    const today = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const otis = false;

    try {
        const door = await Door.findOne({ day: requestedDay });
        if (!door) return res.status(404).json({ msg: 'Door not found' });

        // Nur freigeschaltete Türchen anzeigen
        if (today < requestedDay || month !== 12 && otis) {
            return res.status(400).json({ msg: 'This door is not available yet' });
        }

        // Türchendaten zurückgeben, ohne das Türchen als 'collected' zu markieren
        res.json({
            day: door.day,
            title: door.title,
            description: door.description,
            imageUrl: door.imageUrl,
            collected: door.collected
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Route zum Einsammeln des Türchens
router.post('/collect/:day', auth, async (req, res) => {
    const requestedDay = parseInt(req.params.day);
    const today = new Date().getDate();

    try {
        const door = await Door.findOne({ day: requestedDay });
        if (!door) return res.status(404).json({ msg: 'Door not found' });

        // Überprüfen, ob das Türchen verfügbar ist (Tag ist erreicht oder vergangen)
        if (requestedDay > today) {
            return res.status(400).json({ msg: 'This door is not available yet' });
        }

        // Türchen als 'collected' markieren
        if (!door.collected) {
            door.collected = true;
            await door.save();
        }

        res.json({ msg: 'Door collected successfully', collected: door.collected });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
