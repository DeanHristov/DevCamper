const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load config vars
dotenv.config();
const {
    API_VERSION, NODE_ENV, NODE_PORT
} = process.env;

// Creates an Express application
const app = express();
const PORT = NODE_PORT || 3000

// Including middlewares in DEV mode
if (NODE_ENV === 'dev elopment') {
    app.use(morgan('dev'))
}
// Connect to the db

// Load the routes
const bootcamps = require('./routes/bootcamps');

// Mount the routes
app.use(`${API_VERSION}/bootcamps`, bootcamps);

// Running the server
app.listen(PORT, () => console.log(
    `The server is running in "${NODE_ENV}" mode on port ${PORT}`
))

