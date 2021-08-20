const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const connectDB = require('./src/core/connectDB');
const errorHandler = require('./src/middlewares/errorHandler');

// Load config vars
dotenv.config();
const {
    API_VERSION, NODE_ENV, NODE_PORT,
    MONGO_URI, FILE_UPLOAD_MAX_LIMIT_SIZE
} = process.env;

// Connected to DB:
connectDB(MONGO_URI)

// Creates an Express application
const app = express();
const PORT = NODE_PORT || 3000

// Added third-party middlewares
app.use(express.json());
app.use(cookieParser());
app.use(hpp())

// Enable CORS
app.use(cors());
// Prevent multiple request from one client per time
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Prevent XSS attacks
app.use(xssClean());

// Set security headers
app.use(helmet());

// To remove data
app.use(mongoSanitize({
    replaceWith: '_',
}));

// Uploading file
app.use(fileUpload({
    limits: { fileSize: FILE_UPLOAD_MAX_LIMIT_SIZE },
}));

// Adding static folder
app.use(express.static(path.join(__dirname, 'public')))

// Including middlewares in DEV mode
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// Connect to the db

// Load the routes
const bootcampsRouter = require('./src/routes/bootcamps');
const coursesRouter = require('./src/routes/courses');
const authRouter = require('./src/routes/auth');
const adminRouter = require('./src/routes/admin');
const reviewsRouter = require('./src/routes/reviews');

// Mount the routes
app.use(`${API_VERSION}/bootcamps`, bootcampsRouter);
app.use(`${API_VERSION}/courses`, coursesRouter);
app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/auth/users`, adminRouter);
app.use(`${API_VERSION}/auth/reviews`, reviewsRouter);

app.use(errorHandler);

// Running the server
const server = app.listen(PORT, () => console.log(
    colors.green(`[SERVER] The server is running in "${NODE_ENV.underline}" mode on port ${PORT.underline}`)
))

process.on('unhandledRejection', async (reason, promise) => {
    console.log(colors.bgRed(`[SERVER] Error! ${reason.message}`));
    server.close(() => process.exit(1))
})

