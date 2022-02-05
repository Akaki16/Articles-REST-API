require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const articlesRouter = require('./controllers/articles');

// connect to the MongoDB database
const DB_URI = config.DB_URI_TO_CONNECT;
mongoose.connect(DB_URI)
.then(res => {
    logger.info('MongoDB database connected successfuly');
})
.catch(err => {
    logger.error('MongoDB database cannot be connected');
});

/* middlewares */

// init cors middleware
app.use(cors());

// init express json middleware
app.use(express.json());

/* route middlewares */
app.use('/api/articles', articlesRouter);

// export app
module.exports = app;