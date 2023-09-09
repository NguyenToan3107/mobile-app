const payment = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v0/payments/checkout-session`,
    });
    if (res.data.status === 'message') {
      window.open(res.data.sessionUrl, '_blank');
    }
  } catch (err) {
    console.log(err.message);
  }
};

document
  .querySelector('.payment__process')
  .addEventListener('click', async () => {
    await payment();
  });
