//Require the mongoose library 
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
// Remove the useNewParser option if you have it
const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
        useNewUrlParser: true, // You can keep this if it's there
        useUnifiedTopology: true, // Add this to avoid any deprecation warnings
        });
    console.log('MongoDB is connected');
    } catch (error) {
        console.error('Error Connecting to MongoDB', error.message);
        process.exit(1) // exit process with failure
    }
};
module.exports = { connect: connectDB };

// module.exports = { O'Reilly JavaScript Everywhere (outdated)
//     connect: DB_HOST => {
//         // Use the Mongo drivers updated URL string parser 
//         mongoose.set('useNewParser', true);
//         // Use FindOneAndUpdate() in place of findAndModify()
//         mongoose.set('useFindAndModify', false);
//         // Use createIndex() in place of ensureIndex()
//         mongoose.set('useCreateIndex', true);
//         // Use the new server discorvery and monitoring engine 
//         mongoose.set('useUnifiedTopology', true);
//         // Connect to the DB
//         mongoose.connect(DB_HOST);
//         // Log an error if we fail to connect
//         mongoose.connection.on('error', err => {
//             console.error(err)
//             console.log('MongoDB connection error. Please make sure MongoDB is running.');
//             process.exit();
//         });
//     },
    
//     close: () => {
//         mongoose.connection.close();
//     }
// };