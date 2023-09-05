const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);
userRouter.route('/logout').get(authController.logout);

// Forget and reset password
userRouter.route('/forgetPassword').post(authController.forgotPassword);
userRouter.route('/resetPassword/:token').patch(authController.resetPassword);

// product
userRouter.use(authController.protect);

userRouter.route('/:id/mobiles').patch(userController.addMobile);
userRouter.route('/:id/mobiles').delete(userController.deleteMobileOnUser);

userRouter.route('/updatePassword').patch(authController.updatePassword);
userRouter.route('/deleteMe').delete(userController.deleteMe);
userRouter
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

// only admin
userRouter.use(authController.resTrictTo('admin'));

userRouter
  .route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
