const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please tell us your email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true,
      unique: true,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'guide', 'lead-guide'],
      default: 'user',
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, 'Please provide your password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      minlength: 8,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
      type: Boolean,
      default: true,
    },
    mobiles: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Mobile',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property
// userSchema.virtual('createdAt').get(function () {
//   return this.createdAt.getTime();
// });

userSchema.pre('save', async function (next) {
  // Only run this function if password was already modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'mobiles',
    select: 'name newPrice oldPrice imageCover category',
  });
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.createdAt) {
    const changedTimestamp = parseInt(this.createdAt.getTime() / 1000, 10);
    if (JWTtimestamp < changedTimestamp) {
      return true;
    }
  }
  // false means NOT changes
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // mili second
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
