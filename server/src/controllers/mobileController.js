const express = require('express');
const Mobile = require('./../models/mobileModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const APIFeature = require('./../util/apiFeature');

exports.aliasTopMobile = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'newPrice,ram';
  req.query.feilds = 'name,newPrice';
  next();
};

exports.getAllMobile = catchAsync(async (req, res, next) => {
  // BUILD QUERY

  const features = new APIFeature(Mobile.find(), req.query)
    .filter()
    .sort()
    .limitFeilds()
    .pagination();
  const mobiles = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: mobiles.length,
    data: {
      mobiles,
    },
  });
});

exports.createMobile = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const mobile = await Mobile.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      mobile,
    },
  });
});

exports.getMobile = async (req, res) => {
  try {
    const { id } = req.params;

    const mobile = await Mobile.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        mobile,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateMobile = async (req, res) => {
  try {
    const { id } = req.params;

    const mobile = await Mobile.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        mobile,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteMobile = async (req, res) => {
  try {
    await Mobile.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
  }
};
