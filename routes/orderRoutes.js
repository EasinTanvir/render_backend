const express = require("express");
const router = express.Router();
const orderItems = require("../Controllers/orderController");
const protectRoutes = require("../helper/protectRoutes");
const adminProtect = require("../helper/AdminProtect");

router.use(protectRoutes);
router.route("/").post(orderItems.AddOrderItems);
router.route("/myorders").get(orderItems.ShowOrderInProfile);
router.route("/allorders").get(adminProtect, orderItems.ShowAllOrders);
router.route("/:id").get(orderItems.GetOrderItem);
router.route("/:id/pay").put(orderItems.UpdateOrderToPay);
router
  .route("/:id/deliver")
  .put(adminProtect, orderItems.UpdateOrderToDelivery);

module.exports = router;
