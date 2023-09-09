const delReview = async (idReview) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v0/reviews/${idReview}`,
    });
    console.log(res);
    if (res.status === 204) {
      console.log('success');
      location.reload(true);
    }
  } catch (err) {
    console.log(err.message);
  }
};

// DOM element

const deleteBtnReviews = document.querySelectorAll('.delete-button');
deleteBtnReviews.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const reviewBtn = btn.closest('#comments-list');
    const idReview = reviewBtn.dataset.review;
    console.log(reviewBtn);
    console.log(idReview);
    delReview(idReview);
  });
});

// alert

const hideAlertDelReview = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertDelReview = (type, msg) => {
  hideAlertDelReview();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertDelReview, 3000);
};
