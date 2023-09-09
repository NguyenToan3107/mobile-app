const express = require('express');
const mobileController = require('./../controllers/mobileController');
const authController = require('./../controllers/authController');

const reviewRouter = require('./../routers/reviewRouter');

const mobileRouter = express.Router();

mobileRouter.use('/:mobileId/reviews', reviewRouter);

mobileRouter
  .route('/top-5-cheap')
  .get(mobileController.aliasTopMobile, mobileController.getAllMobile);

mobileRouter
  .route('/')
  .get(mobileController.getAllMobile)
  .post(
    authController.protect,
    authController.resTrictTo('admin'),
    mobileController.createMobile
  );

mobileRouter.use(authController.protect);

mobileRouter
  .route('/:id')
  .get(mobileController.getMobile)
  .patch(authController.resTrictTo('admin'), mobileController.updateMobile)
  .delete(authController.resTrictTo('admin'), mobileController.deleteMobile);

module.exports = mobileRouter;
