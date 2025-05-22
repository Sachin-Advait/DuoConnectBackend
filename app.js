import express from "express";
import connectMongoDb from "./connection.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
const PORT = 8000;

const MONGO_URL = process.env.MONGO_URL;

// Connection
connectMongoDb(MONGO_URL);

// Middleware - plugin
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/", () => {});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
