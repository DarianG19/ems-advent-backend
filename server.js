const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const app = express();
connectDB();

const allowedOrigins = [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2, process.env.ALLOWED_ORIGIN_3]; // Frontend-URL hier eintragen

app.use(
    cors({
        origin: 'https://ems-advent-51vxwm03j-dariang19s-projects.vercel.app', // Erlaubte Ursprünge
        credentials: true, // Cookies und Anmeldeinformationen erlauben
    })
);
app.use(cookieParser());
app.use(express.json());

// Authentifizierung und Türchen-Routen
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doors', require('./routes/door'));
app.use('/healthz', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
