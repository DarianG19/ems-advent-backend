const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.jwt; // Token aus den Cookies lesen

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token prüfen
        req.user = decoded.user; // Benutzerinformationen in req speichern
        next(); // Weiter zur nächsten Middleware oder Route
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        }
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
