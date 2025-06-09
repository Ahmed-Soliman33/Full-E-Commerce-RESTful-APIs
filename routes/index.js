// Routes imports
const categoryRoute = require("./categoryRoute");
const brandRoute = require("./brandRoute");
const subCategoryRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
