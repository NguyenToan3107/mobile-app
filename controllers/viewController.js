const Mobile = require('./../models/mobileModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('../util/catchAsync');

// overview page
exports.getOverview = catchAsync(async (req, res, next) => {
  res.status(200).render('overview', {
    title: 'Overview Mobile App',
  });
});

// All mobile page
exports.getAllMobile = catchAsync(async (req, res, next) => {
  const mobiles = await Mobile.find();

  res.status(200).render('products', {
    title: 'All Mobile',
    mobiles,
  });
});

exports.getAllMobileOfCategory = catchAsync(async (req, res, next) => {
  const mobiles = await Mobile.find({ category: req.params.category });

  res.status(200).render('products', {
    title: `All ${req.params.category
      .charAt(0)
      .toUpperCase()}${req.params.category.slice(1)}`,
    mobiles,
  });
});

// decrease page
exports.decreaseSort = catchAsync(async (req, res, next) => {
  const mobiles = await Mobile.find().sort('-newPrice');

  res.status(200).render('products', {
    title: 'All Mobile',
    mobiles,
  });
});

// increase page
exports.increaseSort = catchAsync(async (req, res, next) => {
  const mobiles = await Mobile.find().sort('newPrice');

  res.status(200).render('products', {
    title: 'All Mobile',
    mobiles,
  });
});

// Detail mobile page
exports.getMobile = catchAsync(async (req, res, next) => {
  const mobile = await Mobile.findOne({ slug: req.params.slug });

  if (!mobile) {
    return next();
  }
  const mobilesOfDetail = await Mobile.find({
    category: mobile.category,
    _id: { $ne: mobile._id },
  });

  const reviewOnMobile = await Review.find({
    mobile: mobile.id,
  });
  // .skip(0)
  // .limit(2);

  res.status(200).render('detail', {
    title: `${mobile.name} Mobile`,
    mobile,
    mobilesOfDetail,
    reviewOnMobile,
  });
});

// Log in page
exports.isLoggin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

// Sign up page
exports.isSignup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
});

// Account page
exports.account = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Account',
  });
});

// Cart page
exports.cart = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { mobiles: req.params.id },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const sumPrice = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: 'mobiles', // The collection name of the 'Mobile' model
          localField: 'mobiles',
          foreignField: '_id',
          as: 'mobilesData',
        },
      },
      { $unwind: '$mobilesData' },
      {
        $group: {
          _id: null,
          sumPrice: { $sum: '$mobilesData.newPrice' },
        },
      },
    ]);

    res.status(200).render('cart', {
      title: 'Giỏ hàng',
      sumPrice: sumPrice[0].sumPrice,
    });
  } catch (err) {
    res.status(200).render('cart', {
      title: 'Giỏ hàng',
    });
  }
};

// Forget password page
exports.forgetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgetPassword', {
    title: 'Quên mật khẩu ',
  });
});

// Reset password page
exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'Mật khẩu mới',
  });
});
