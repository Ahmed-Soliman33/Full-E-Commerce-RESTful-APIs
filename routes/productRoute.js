const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
