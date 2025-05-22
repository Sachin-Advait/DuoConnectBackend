import mongoose from "mongoose";

async function connectMongoDb(url) {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1); // Exit process with failure code
  }
}

export default connectMongoDb;
