const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

/**
 * Connect to Database
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('DB is connected');
    } catch (error) {
        console.log('It has an error');
        console.log(error);
        process.exit(1); // Stop app
    }
};

module.exports = connectDB;
