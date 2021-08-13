const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');

const connectDB = require('./src/core/connectDB');

// Load config vars
dotenv.config();
const { MONGO_URI } = process.env;

// Load modules
const BootcampSchema = require('./src/models/Bootcamps');
const CoursesSchema = require('./src/models/Courses');

// Connect to db
connectDB(MONGO_URI);

const mockBootcamps = fs.readFileSync(`${__dirname}/src/mockData/bootcamps.json`, 'utf8')
const mockCourses = fs.readFileSync(`${__dirname}/src/mockData/courses.json`, 'utf8')

const importIntoDB = async () => {
    try {
        await BootcampSchema.create(JSON.parse(mockBootcamps));
        await CoursesSchema.create(JSON.parse(mockCourses));
        console.log(colors.green('Great! Data ware imported!'));
        process.exit(0);
    } catch (reason) {
        console.log(colors.bgRed(reason));
        process.exit(1);
    }
}

const removeDataFromDB = async () => {
    try {
        await BootcampSchema.deleteMany();
        await CoursesSchema.deleteMany();
        console.log(colors.green('The data have been removed successfully'));
        process.exit(0);
    } catch (reason) {
        console.log(colors.bgRed(reason));
        process.exit(1);
    }
}

// Pushing the mock data into DB
if (process.argv[2] === '-i') {
    importIntoDB()
}

// Removing the data from DB
if (process.argv[2] === '-d') {
    removeDataFromDB()
}
