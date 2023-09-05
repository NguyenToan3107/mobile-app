const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../util/catchAsync');
const User = require('./../models/userModel');
const Mobile = require('../models/mobileModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images. ', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// choise image
exports.uploadUserPhoto = upload.single('photo');

// change size
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterOption = (obj, ...allowFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Update me
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  // filter feilds allow change
  const filterObj = filterOption(req.body, 'name', 'email');
  if (req.file) filterObj.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, filterObj, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// delete account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      active: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'Delete user success.',
  });
});

// create new user
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// get user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
  });
});

// add mobile
exports.addMobile = catchAsync(async (req, res, next) => {
  // const { id } = req.params;
  // const quantity = parseInt(req.params.quantity);
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
        sum: { $sum: '$mobilesData.newPrice' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    sum: sumPrice[0].sum,
    user,
  });
});

// delete mobile on cart
exports.deleteMobileOnUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { mobiles: req.params.id },
    },
    {
      new: true,
    }
  );
  //
  res.status(200).json({
    status: 'success',
    user,
  });
});
