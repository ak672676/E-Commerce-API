const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");

// Admin Routes

// Create Product
const createProduct = async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Created Successfully",
    user: req.user._id,
    product,
  });
};

// Get All Products
const getAllProductAdmin = async (req, res, next) => {
  const products = await Product.find();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "All Products",
    products,
    productCount: products.length,
  });
};

// Get Product Details
const getProductDetailsAdmin = async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Details",
    product,
  });
};

// Update Product
const updateProductAdmin = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Updated",
    product,
  });
};

// Details Product
const deleteProductAdmin = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Deleted",
    product,
  });
};

// PRODUCT REVIEW

// Create a product review
const createProductReview = async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not found"));
  }
  product.reviews.push(req.body);
  product.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Review Created",
    product,
  });
};

// Remove a product review
const removeProductReview = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not found"));
  }
  const review = product.reviews.id(req.query.rid);
  if (!review) {
    return next(new Error("Review not found"));
  }
  review.remove();
  product.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Review Deleted",
  });
};

// Update a product review
const updateProductReview = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not found"));
  }
  const review = product.reviews.id(req.query.rid);
  if (!review) {
    return next(new Error("Review not found"));
  }
  if (req.user._id.toString() !== review.user.toString()) {
    return next(new Error("You are not authorized to update this review"));
  }

  for (let key in req.body) {
    review[key] = req.body[key];
  }
  product.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Review Updated",
  });
};

// Get a product
const getProductReview = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not found"));
  }
  const review = product.reviews.id(req.query.rid);
  if (!review) {
    return next(new Error("Review not found"));
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Review",
    review,
  });
};

module.exports = {
  createProduct,
  getAllProductAdmin,
  getProductDetailsAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  createProductReview,
  removeProductReview,
  updateProductReview,
  getProductReview,
};
