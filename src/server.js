const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');


const connectDB = require('./core/connectDB');

// Load config vars
dotenv.config();
const {
    API_VERSION, NODE_ENV, NODE_PORT,
    MONGO_URI
} = process.env;

// Connected to DB:
connectDB(MONGO_URI)
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
const server = app.listen(PORT, () => console.log(
    colors.green(`The server is running in "${NODE_ENV.underline}" mode on port ${PORT.underline}`)
))

process.on('unhandledRejection', async (reason, promise) => {
    console.log(colors.bgRed(`Error! ${reason.message}`));
    server.close(() => process.exit(1))
})
