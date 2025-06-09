const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
