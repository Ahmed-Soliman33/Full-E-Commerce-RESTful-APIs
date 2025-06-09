const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoryRoute = require("./subCategoryRoute");
const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

// Nested routes
router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);
module.exports = router;
