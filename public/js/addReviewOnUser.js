const addReview = async (review, idMobile) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v0/mobiles/${idMobile}/reviews`,
      data: {
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlertAddReview('message', 'Thêm thành công');
      location.reload(true);
    }
  } catch (err) {
    showAlertAddReview(
      'error',
      'Thêm thất bại. Vui lòng đăng nhập hoặc kiểm tra tài khoản của bạn!'
    );
  }
};

document
  .querySelector('#comment-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const idMobile = document.querySelector('.product__id').dataset.mobile;
    const review = document.querySelector('#comment-input').value;
    await addReview(review, idMobile);

    document.querySelector('#comment-input').value = '';
  });

// alert

const hideAlertAddReview = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertAddReview = (type, msg) => {
  hideAlertAddReview();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertAddReview, 3000);
};
