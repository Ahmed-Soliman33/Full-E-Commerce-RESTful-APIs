const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  craeteFilterObj,
} = require("../controllers/subCategoryController");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");
const { protect, allowedTo } = require("../controllers/authController");

// mergeParams : Merge params from parent route to child route
// example: I want to access categoryId from parent route
const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(craeteFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
