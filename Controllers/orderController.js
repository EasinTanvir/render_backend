const HttpError = require("../helper/HttpError");
const orderModelSchema = require("../models/orderModelSchema");
const userSchema = require("../models/userSchema");

const AddOrderItems = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    itemPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    const errors = new HttpError("No order Items found", 500);
    return next(errors);
  } else {
    const orders = new orderModelSchema({
      orderItems,
      user: req.userData._id,
      shippingAddress,
      paymentMethod,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    try {
      const neworder = await orders.save();
      res.status(200).json(neworder);
    } catch (err) {
      const errors = new HttpError("Create order failed", 500);
      return next(errors);
    }
  }
};

const GetOrderItem = async (req, res, next) => {
  let orders;
  try {
    orders = await orderModelSchema
      .findById(req.params.id)
      .populate("user", "name email");
  } catch (err) {
    const errors = new HttpError("Fetch order failed", 500);
    return next(errors);
  }
  res.status(200).json(orders);
};

const UpdateOrderToPay = async (req, res, next) => {
  let orders;
  try {
    orders = await orderModelSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("Fetch order failed", 500);
    return next(errors);
  }

  orders.isPaid = true;
  orders.paidAt = Date.now();
  orders.paymentResults = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  let updateOrder;

  try {
    updateOrder = await orders.save();
  } catch (err) {
    const errors = new HttpError("Update order failed", 500);
    return next(errors);
  }

  res.status(200).json(updateOrder);
};

const UpdateOrderToDelivery = async (req, res, next) => {
  let order;
  try {
    order = await orderModelSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("Fetch order failed", 500);
    return next(errors);
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  let update;

  try {
    update = await order.save();
  } catch (err) {
    const errors = new HttpError("Update order failed", 500);
    return next(errors);
  }

  res.status(200).json(update);
};

const ShowOrderInProfile = async (req, res, next) => {
  let orders;
  try {
    orders = await orderModelSchema.find({ user: req.userData._id });
  } catch (err) {
    const errors = new HttpError("Fetch order failed for profile", 500);
    return next(errors);
  }

  res.status(200).json(orders);
};

const ShowAllOrders = async (req, res, next) => {
  let order;
  try {
    order = await orderModelSchema.find().populate("user", "id name");
  } catch (err) {
    const errors = new HttpError("Fetch all orders failed", 500);
    return next(errors);
  }

  res.status(200).json(order);
};

module.exports = {
  AddOrderItems,
  GetOrderItem,
  UpdateOrderToPay,
  ShowOrderInProfile,
  ShowAllOrders,
  UpdateOrderToDelivery,
};
