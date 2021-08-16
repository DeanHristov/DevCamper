const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');

const connectDB = require('./src/core/connectDB');
const errorHandler = require('./src/middlewares/errorHandler');

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

app.use(express.json());

// Uploading file
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// Adding static folder
app.use(express.static(path.join(`${__dirname}/src`, 'public')))

// Including middlewares in DEV mode
if (NODE_ENV === 'dev elopment') {
    app.use(morgan('dev'))
}
// Connect to the db

// Load the routes
const bootcampsRouter = require('./src/routes/bootcamps');
const coursesRouter = require('./src/routes/courses');

// Mount the routes
app.use(`${API_VERSION}/bootcamps`, bootcampsRouter);
app.use(`${API_VERSION}/courses`, coursesRouter);

app.use(errorHandler);

// Running the server
const server = app.listen(PORT, () => console.log(
    colors.green(`[SERVER] The server is running in "${NODE_ENV.underline}" mode on port ${PORT.underline}`)
))

process.on('unhandledRejection', async (reason, promise) => {
    console.log(colors.bgRed(`[SERVER] Error! ${reason.message}`));
    server.close(() => process.exit(1))
})

