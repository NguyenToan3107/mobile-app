const express = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');

const mobileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A mobile must have a name'],
      default: 'mobile phone',
      unique: true,
    },
    feature: [String],
    newPrice: Number,
    oldPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val >= this.newPrice;
        },
        message: 'Old price  ({VALUE}) should be bigger  than the new price',
      },
    },
    category: {
      type: String,
      required: [true, 'A mobile must have a category'],
    },
    slug: String,
    imageCover: {
      type: String,
      required: [true, 'A mobile must have a image'],
    },
    images: [String],

    // details mobile
    screenTechnology: String,
    resolution: String,
    wideScreen: Number,
    operatingSystem: String,
    cpu: String,
    ram: Number,
    numberOfSimSlots: String,
    memoryInternal: Number,
    capacity: Number,
    network: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // dinh dang noi dung cua schema
    toObject: { virtuals: true },
  }
);
mobileSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;
