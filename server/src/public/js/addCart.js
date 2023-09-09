const addCart = async (idMobile) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v0/users/${idMobile}/mobiles`,
    });

    if (res.data.status === 'success') {
      showAlertAddCart('message', 'Thêm thành công');
    }
  } catch (err) {
    console.log(err.message);
    showAlertAddCart(
      'error',
      'Thêm thất bại. Vui lòng đăng nhập hoặc kiểm tra tài khoản của bạn!'
    );
  }
};

// DOM Elelent

document.querySelector('.button__cart').addEventListener('click', (e) => {
  const idMobile = document.querySelector('.product__id').dataset.mobile;
  addCart(idMobile);
});

// alert

const hideAlertAddCart = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertAddCart = (type, msg) => {
  hideAlertAddCart();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertAddCart, 3000);
};
