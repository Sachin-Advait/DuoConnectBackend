import mongoose from "mongoose";

async function connectMongoDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1); // Exit process with failure code
  }
}

export default connectMongoDb;
