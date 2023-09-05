const e = require('express');
const Review = require('../models/reviewModel');
const catchAsync = require('../util/catchAsync');

exports.setReview = (req, res, next) => {
  if (!req.body.mobile) req.body.mobile = req.params.mobileId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// get reviews on mobile when know user log in
exports.getReviewsOnMobile = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    mobile: req.params.mobileId,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    review: reviews,
  });
});

// delete remove on mobile when know user log in
exports.deleteReviewOnMobile = catchAsync(async (req, res, next) => {
  await Review.findOneAndDelete({
    mobile: req.params.mobileId,
    user: req.user.id,
  });
  res.status(204).json({
    status: 'success',
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getAllReviewsMinusTwo = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const reviews = await Review.find().skip((page - 1) * limit);
  // .limit(parseInt(limit));

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      review: reviews,
    },
  });
});

// Get All Reviews
exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      review: reviews,
    },
  });
});

exports.getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      review: review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});
