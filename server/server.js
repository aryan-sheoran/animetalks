const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load env vars FIRST

const express = require('express');
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'Anime';

// Single database connection in server.js
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME
})
.then(() => {
    console.log('Connected to MongoDB (dbName:', DB_NAME + ')');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});