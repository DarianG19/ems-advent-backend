const mongoose = require('mongoose');

const DoorSchema = new mongoose.Schema({
    day: { type: Number, required: true, unique: true }, // Der Tag, z.B. 1 für den 1. Dezember
    title: { type: String, required: true },             // Titel des Türchens
    description: { type: String, required: true },       // Beschreibung des Türcheninhalts
    imageUrl: { type: String, required: true },             // Bild-URL oder Pfad
    collected: { type: Boolean, default: false }         // Zeigt an, ob das Türchen bereits eingesammelt wurde
});

module.exports = mongoose.model('Door', DoorSchema);

