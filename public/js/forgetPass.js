const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v0/users/forgetPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlertForget('success', 'Kiểm tra Email của bạn !');
    }
  } catch (err) {
    showAlertForget('error', 'Thất bại 💥');
  }
};

// DOM element
document.querySelector('.formForget').addEventListener('submit', (e) => {
  e.preventDefault();
  const emailForget = document.getElementById('emailForget').value;
  console.log(emailForget);
  forgetPassword(emailForget);
});

// alert
const hideAlertForget = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertForget = (type, msg) => {
  hideAlertForget();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertForget, 5000);
};
