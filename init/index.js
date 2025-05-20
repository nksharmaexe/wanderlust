require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./updated_data.js");
const Listing = require("../models/listing.js");

const dbUrl = "mongodb+srv://wanderlust:IJF5IUs0CPRgQHQZ@cluster0.hcvgxxy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const initDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
    
    // Clear existing data
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    
    // Prepare data with owner field
    const modifiedData = initData.data.map((obj) => ({
      ...obj,
      owner: "682ccf5bb86e2cee0f9bcaea",
    }));
    
    // Insert new data
    await Listing.insertMany(modifiedData);
    console.log("Data was initialized");
    
    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (err) {
    console.error('Initialization error:', err);
    process.exit(1); // Exit with error code
  }
};

initDB();