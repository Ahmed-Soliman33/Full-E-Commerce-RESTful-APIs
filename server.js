const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");

// Connect to the database
dbConnection();

// Load environment variables from config.env file
dotenv.config({ path: "config.env" });

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares

// Body parser middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
app.use("/api/v1/categories", categoryRoute);

// Catch-all route for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  next(error.message);
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  res.status(400).json({
    err,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
