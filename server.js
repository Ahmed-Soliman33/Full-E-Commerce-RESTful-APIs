const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

// Routes imports
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

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
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);

// Catch-all route for undefined routes
app.use((req, res, next) => {
  const error = new ApiError(
    `Can't find ${req.originalUrl} on this server!`,
    400
  );
  next(error);
});

// Global Error handling middleware
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Handle unhandled promise (asynchronous) rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  // Close the server and exit the process
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
