// config.js

module.exports = {
    PORT: process.env.PORT || 3030, // Port for the server to listen on
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/VehicleServiceDB', // MongoDB connection URI
    // Add more configuration variables as needed...
  };