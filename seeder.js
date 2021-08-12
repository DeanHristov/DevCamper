const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load config vars
dotenv.config();
const { MONGO_URI } = process.env;

// Load modules
const BootcampSchema = require('./src/models/Bootcamps');

// Connect to db
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const mockBootcamps = fs.readFileSync(`${__dirname}/src/mockData/bootcamps.json`, 'utf8')

const importIntoDB = async () => {
    try {
        await BootcampSchema.create(JSON.parse(mockBootcamps));
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
