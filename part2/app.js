const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'glockedinsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true if using https
        httpOnly: true, // make cookie inaccessible via javascript (helps prevent XSS)
        // sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;