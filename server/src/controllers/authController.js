const catchAsync = require('../util/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../util/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('./../util/email');
const crypto = require('crypto');

// create token by JWT
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

// response JWT, cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000
    ), // mls
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // only HTTPS

  res.cookie('jwt', token, cookieOptions);

  // remove passsword from output
  user.password = undefined;

  // render
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Sign Up
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  // 3. Send it to user's email when user sign up success
  try {
    const login = `${req.protocol}://${req.get('host')}/login`;

    const subject = `Xin vui lòng click vào link dưới đây để đang nhập!`;
    const html = `<a href=${login}>Click here</a>`;
    const options = {
      email: user.email,
      message: 'Bạn đã đang ký thành công!!!',
      subject: subject,
      html: html,
    };

    await sendEmail(options);

    // response
    createSendToken(user, 200, res);
  } catch (err) {
    return next(
      new AppError(
        `There was an error sending the email. Try again later!. ${err}`,
        500
      )
    );
  }
});

// Log In
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // chech email, password
  if (!email || !password)
    return next(new AppError('Please provide email && password', 400));

  // if user not correct
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return next(new AppError('User not exist. Please sign up the user.', 400));

  if (!(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'Password is not the same. Please confirm password correct.',
        400
      )
    );
  }
  // Response
  createSendToken(user, 200, res);
});

// Log Out
exports.logout = catchAsync(async (req, res, next) => {
  // Reset cookie become empty
  res.cookie('jwt', 'log out your account', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
});

// Protect
exports.protect = catchAsync(async (req, res, next) => {
  // get && check token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // verify token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next('The user belonging to this token does no longer exist!', 401);
  }

  // Check if user change password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again. ', 401)
    );
  }
  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

// For views
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1. Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY
      );
      // 2. Check user exist
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) return next();

      // 3. Check if user changed password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser;
      req.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// restrict
exports.resTrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role.includes(roles)) {
      return next(
        new AppError('You do not have permission to perform this action. ', 403)
      );
    }
    next();
  };
};

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // check user
  const { passwordCurrent } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('Account does not exist', 401));
  }

  // check current password with user password
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

// Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const { email } = req.body;

  // check user exist
  const user = await User.findOne({
    email,
    active: true,
  });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  // 2. Generate the random reset
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v0/users/${resetToken}`;
    const resetPasswordLink = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword/${resetToken}`;

    const subject = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn trong 10 phút (kể từ bây giờ).`;
    const html = `<a href=${resetPasswordLink}>Click here</a>`;
    const options = {
      email: user.email,
      message: resetURL,
      subject: subject,
      html: html,
    };

    await sendEmail(options);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was an error sending the email. Try again later!. ${err}`,
        500
      )
    );
  }
});

// Reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. decode hash reset token
  const hashResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // 3. if everthing is okay, send jwt
  createSendToken(user, 200, res);
});
