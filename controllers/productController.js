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

module.exports = {
  createProduct,
  getAllProductAdmin,
  getProductDetailsAdmin,
  updateProductAdmin,
  deleteProductAdmin,
};
