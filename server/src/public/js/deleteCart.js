const deleteCart = async (idMobile) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v0/users/${idMobile}/mobiles`,
    });
    if (res.data.status === 'success') {
      console.log('success');
      location.reload(true);
    }
  } catch (err) {
    console.log(err.message);
    console.log(err);
  }
};

const deleteButtons = document.querySelectorAll('.remove');

deleteButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const cartProduct = btn.closest('.cart__product');
    const idMobile = cartProduct.dataset.cart;
    deleteCart(idMobile);
  });
});
