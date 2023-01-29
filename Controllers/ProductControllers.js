const HttpError = require("../helper/HttpError");
const mongoose = require("mongoose");
const productSchema = require("../models/productSchema");

const AllProducts = async (req, res, next) => {
  let ress;

  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  let totalcount;

  try {
    totalcount = await productSchema.count({ ...keyword });
    ress = await productSchema
      .find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  } catch (err) {
    const errors = new HttpError("fetch all product failed", 500);
    return next(errors);
  }
  res.status(200).json({ ress, page, pages: Math.ceil(totalcount / pageSize) });
};

const SingleProduct = async (req, res, next) => {
  const params = req.params.id;
  let ress;

  try {
    ress = await productSchema.findById(params);
  } catch (err) {
    const errors = new HttpError("fetch single product failed", 500);
    return next(errors);
  }
  res.status(200).json(ress);
};

const DeleteProduct = async (req, res, next) => {
  const params = req.params.id;
  let ress;

  try {
    ress = await productSchema.findByIdAndDelete(params);
  } catch (err) {
    const errors = new HttpError("fetch single product failed", 500);
    return next(errors);
  }
  res.status(200).json({ message: "Product Delete successfully" });
};

const CreateProduct = async (req, res, next) => {
  const {
    name,
    brand,
    category,
    description,
    reviews,
    rating,
    numReviews,
    price,
    countInStock,
  } = req.body;

  const newProduct = new productSchema({
    user: req.userData._id,
    name,
    image: req.file.path,
    brand,
    category,
    description,
    reviews,
    rating,
    numReviews,
    price,
    countInStock,
  });
  let finalproduct;

  try {
    finalproduct = await newProduct.save();
  } catch (err) {
    const errors = new HttpError("create product failed", 500);
    return next(errors);
  }
  res.status(200).json(finalproduct);
};

const UpdateProduct = async (req, res, next) => {
  let existingProduct;

  try {
    existingProduct = await productSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("fetch single product failed", 500);
    return next(errors);
  }
  const {
    name,
    brand,
    category,
    description,
    reviews,
    rating,
    numReviews,
    price,
    countInStock,
  } = req.body;

  (existingProduct.name = name),
    (existingProduct.brand = brand),
    (existingProduct.category = category),
    (existingProduct.description = description),
    (existingProduct.reviews = reviews),
    (existingProduct.rating = rating),
    (existingProduct.numReviews = numReviews),
    (existingProduct.price = price),
    (existingProduct.countInStock = countInStock);

  let updateProducts;
  try {
    updateProducts = await existingProduct.save();
  } catch (err) {
    const errors = new HttpError("product update failed", 500);
    return next(errors);
  }

  res.status(200).json(updateProducts);
};

const ReviewProduct = async (req, res, next) => {
  let product;

  try {
    product = await productSchema.findById(req.params.id);
  } catch (err) {
    const errors = new HttpError("fetch single product failed", 500);
    return next(errors);
  }
  const { rating, comment } = req.body;

  const existingreview = product.reviews.find(
    (rev) => rev.user.toString() === req.userData._id.toString()
  );

  if (existingreview) {
    const errors = new HttpError("product already reviewd", 500);
    return next(errors);
  }

  const newReview = {
    name: req.userData.name,
    rating: Number(rating),
    comment,
    user: req.userData._id,
  };

  product.reviews.push(newReview);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, cur) => cur.rating + acc, 0) /
    product.reviews.length;

  try {
    await product.save();
    res.status(200).json({ message: "Review Added" });
  } catch (err) {
    const errors = new HttpError("product rating update failed", 401);
    return next(errors);
  }
};

const GetTopProducts = async (req, res, next) => {
  let product;

  try {
    product = await productSchema.find({}).sort({ rating: -1 }).limit(3);
  } catch (err) {
    const errors = new HttpError("fetch top product failed", 401);
    return next(errors);
  }
  res.status(200).json(product);
};

module.exports = {
  AllProducts,
  SingleProduct,
  DeleteProduct,
  CreateProduct,
  UpdateProduct,
  ReviewProduct,
  GetTopProducts,
};
