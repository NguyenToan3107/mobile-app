# **_Mobiles_**

App mobile

![This is my logo](/public/img/icon-logo1.png)

## _Mobile_

- Create Mobile
- Get All Mobiles
- Get One Mobile
- Update Mobile
- Delete Mobile

#### Create Mobile

Create new mobile

```js
POST
127.0.0.1:8000/api/v0/mobiles/
```

```js
const mobile = await Mobile.create(req.body);
```

#### Get All Mobile

```js
GET
127.0.0.1:8000/api/v0/mobiles/

vd: 127.0.0.1:8000/api/v0/mobiles/?sort=newPrice&feilds=name,newPrice&newPrice[gt]=15
```

```js
const features = new APIFeature(Mobile.find(), req.query)
  .filter()
  .sort()
  .limitFeilds()
  .pagination();
const mobiles = await features.query;
```

#### Get One Mobile

```js
GET
127.0.0.1:8000/api/v0/mobiles/:id

vd: 127.0.0.1:8000/api/v0/mobiles/6478b5bf1bd0b009a77b7a3b
```

```js
const mobile = await Mobile.findById(req.params);
```

#### Update Mobile

```js
PATCH
127.0.0.1:8000/api/v0/mobiles/:id

vd: 127.0.0.1:8000/api/v0/mobiles/6478b5bf1bd0b009a77b7a3b
```

```js
const mobile = await Mobile.findByIdAndUpdate(req.params, req.body, {
  new: true,
  runValidators: true,
});
```

#### Delete Mobile

```js
DELETE
127.0.0.1:8000/api/v0/mobiles/:id

vd: 127.0.0.1:8000/api/v0/mobiles/6478b5bf1bd0b009a77b7a3b
```

```js
await Mobile.findByIdAndDelete(req.params.id);
```

## _User_

- Create new user (By admin)
- Get All User (By admin)
- Get One User
- Update User
- Delete User
- Update Current User (When you signed up and logged in)

#### Create New User

```js
POST
127.0.0.1:8000/api/v0/users
```

```js
const user = await User.create(req.body);
```

#### Get All User

```js
127.0.0.1:8000/api/v0/users
```

```js
const users = await User.find();
```

#### Get User By ID

```js
127.0.0.1:8000/api/v0/users/:id

vd: 127.0.0.1:8000/api/v0/users/647dea31e0c273459c7d1ec
```

```js
const user = await User.findById(req.params.id);
```

#### Update User

```js
127.0.0.1:8000/api/v0/users/:id

vd: 127.0.0.1:8000/api/v0/users/647dea31e0c273459c7d1ec
```

```js
const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true,
});
```

#### Delete User

```js
127.0.0.1:8000/api/v0/users/:id

vd: 127.0.0.1:8000/api/v0/users/647dea31e0c273459c7d1ec
```

```js
await User.findByIdAndDelete(req.params.id);
```

#### Update Current User

```js
127.0.0.1:8000/api/v0/users/updateMe
```

```js
- Use multer from multer and sharp from sharp to alter information user

- multer (Alter image)

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

- sharp (config image)
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

- Update
const filterObj = filterOption(req.body, 'name', 'email');
  if (req.file) filterObj.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, filterObj, {
    new: true,
    runValidators: true,
  });

```

## _Authentication_

- Sign Up
- Log In
- Log Out
- protect (check token)
- Update Password
- Delete Me
- Forget Password
- Update Password

#### Sign Up

```js
POST
127.0.0.1:8000/api/v0/users/signup
```

```js
const user = await User.create(req.body);

(create jwt variable to save jwt )
pm.environment.set("jwt", pm.response.json().token);

```

#### Log In

```js
POST
127.0.0.1:8000/api/v0/users/login
```

```js
const user = await User.findOne({ email: req.body.email }).select('+password');

(create jwt variable to save jwt )
pm.environment.set("jwt", pm.response.json().token);

```

#### protect

(This is only middleware to check token , it's return next())

```js
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
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

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
```

#### Log Out

```js
POST
127.0.0.1:8000/api/v0/users/logout
```

```js
Reset cookie

res.cookie('jwt', 'log out your account', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
```

#### Update Pessword

```js
PATCH
127.0.0.1:8000/api/v0/users/updatePassword
```

```js
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
```

#### Forget Password

```js
POST
127.0.0.1:8000/api/v0/users/forgetPassword
```

```js
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
```

#### Reset Password

```js
PATCH
127.0.0.1:8000/api/v0/users/resetPassword/:token

vd: 127.0.0.1:8000/api/v0/users/resetPassword/49e596ea93a3f25aa41c8e7f7152c2d91e7376389b4e7a00ab687c40818f2968
```

```js
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
```

#### Delete Me

```js
DELETE
127.0.0.1:8000/api/v0/users/deleteMe

```

```js
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
```
