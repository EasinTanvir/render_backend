const express = require("express");
const router = express.Router();
const protectRoutes = require("../helper/protectRoutes");
const adminProtect = require("../helper/AdminProtect");
const AllProducts = require("../Controllers/ProductControllers");
const fileUpload = require("../helper/FileUpload");

router.route("/").get(AllProducts.AllProducts);
router.route("/top").get(AllProducts.GetTopProducts);
router.route("/:id").get(AllProducts.SingleProduct);
router.use(protectRoutes);
router.route("/:id/reviews").post(AllProducts.ReviewProduct);
router.use(adminProtect);
router.route("/:id").delete(AllProducts.DeleteProduct);
router.post("/create", fileUpload.single("image"), AllProducts.CreateProduct);
router.route("/update/:id").patch(AllProducts.UpdateProduct);

module.exports = router;
