const express = require('express');

const reviewRouter = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('./../controllers/authController');

reviewRouter
  .route('/')
  .post(
    authController.protect,
    reviewController.setReview,
    reviewController.createReview
  )
  .get(authController.protect, reviewController.getReviewsOnMobile)
  .delete(authController.protect, reviewController.deleteReviewOnMobile);

reviewRouter.route('/').post(reviewController.createReview);

reviewRouter.route('/getAllReview').get(reviewController.getAllReview);
reviewRouter
  .route('/getAllReviewMinusTwo')
  .get(reviewController.getAllReviewsMinusTwo);

reviewRouter
  .route('/:id')
  .get(reviewController.getOneReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = reviewRouter;
