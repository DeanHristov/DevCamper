const mongoose = require('mongoose');
const colors = require('colors');

module.exports = async (MONGO_URI) => {
    console.log(colors.yellow('[DB] Connecting to MongoDB....'))
    const connectDB = await mongoose.connect(MONGO_URI, {
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify: false,
       useUnifiedTopology: true,
    });

    console.log(colors.green(`[DB] MongoDB is connected to host: ${connectDB.connection.host.bold.underline}`))

    return  mongoose.connection;
}
