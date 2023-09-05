const catchAsync = require('../util/catchAsync');
const Mobile = require('./../models/mobileModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently booked tour
  const mobileIds = req.user.mobiles.map((mobile) => mobile._id);
  const mobiles = await Mobile.find({ _id: { $in: mobileIds } });

  const lineItems = mobiles.map((mobile) => {
    const mobileReferenceId = mobile._id; // Replace this with your own logic to generate a unique identifier
    console.log(
      `${req.protocol}://${req.get('host')}/img/${mobile.category}/${
        mobile.imageCover
      }`
    );
    return {
      price_data: {
        currency: 'vnd',
        product_data: {
          name: `${mobile.name} Mobile`,
          images: [
            `${req.protocol}://${req.get('host')}/img/${mobile.category}/${
              mobile.imageCover
            }`,
          ],
        },
        unit_amount: mobile.newPrice * 1000000,
      },
      quantity: 1,
      client_reference_id: mobileReferenceId, // Assign the unique identifier to the client_reference_id
    };
  });

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`, // implement when payment success
    cancel_url: `${req.protocol}://${req.get('host')}/`, // if they choose to cancel the current payment
    customer_email: req.user.email,
    client_reference_id: lineItems
      .map((item) => item.client_reference_id)
      .join(','), // tao 1 booking moi trong database khi success
    line_items: lineItems,
  });
  // 3. Create session as response
  res.status(200).json({
    status: 'message',
    session,
    sessionUrl: session.url,
  });
});
