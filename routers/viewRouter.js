const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const viewRouter = express.Router();

viewRouter.get('/account', authController.protect, viewController.account);
viewRouter.get('/forgetPassword', viewController.forgetPassword);
viewRouter.get('/resetPassword/:token', viewController.resetPassword);

// check cookie
viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/products', viewController.getAllMobile);
viewRouter.get('/products/:category', viewController.getAllMobileOfCategory);

// increase sort
viewRouter.get('/increase', viewController.increaseSort);

// decrease sort
viewRouter.get('/decrease', viewController.decreaseSort);

viewRouter.get('/:slug', viewController.getMobile);
viewRouter.get('/login', viewController.isLoggin);
viewRouter.get('/signup', viewController.isSignup);
viewRouter.get('/cart', viewController.cart);

module.exports = viewRouter;
