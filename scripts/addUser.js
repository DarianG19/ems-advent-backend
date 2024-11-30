require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const addUser = async (username, password) => {
    try {
        await connectDB();
        let user = await User.findOne({ username });
        if (user) {
            console.log('User already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });
        await user.save();
        console.log('User created successfully');
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
};

// Beispiel: `node scripts/addUser.js username password`
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.log('Usage: node scripts/addUser.js <username> <password>');
} else {
    addUser(args[0], args[1]);
}
