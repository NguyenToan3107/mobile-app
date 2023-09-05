const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must have a content'],
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user. '],
      },
    ],
    mobile: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Mobile',
        required: [true, 'Review must belong to a mobile. '],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // dinh dang noi dung cua schema
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ mobile: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'mobile',
    select: 'name newPrice',
  });
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
