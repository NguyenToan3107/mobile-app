const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v0/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    console.log(token);

    if (res.data.status === 'success') {
      showAlertReset('success', 'Thay đổi mật khẩu thành công !');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlertReset('error', 'Thất bại 💥');
    console.log(err.message);
    console.log(err);
  }
};

// DOM element
document.querySelector('.formReset').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('passwordReset').value;
  const passwordConfirm = document.getElementById('passwordConfirmReset').value;
  console.log(password, passwordConfirm);
  const regex = /\/([a-zA-Z0-9]+)$/;
  const match = window.location.pathname.match(regex);

  const alphanumericSequence = match ? match[1] : '';
  console.log(alphanumericSequence);

  resetPassword(alphanumericSequence, password, passwordConfirm);
});

// alert
const hideAlertReset = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertReset = (type, msg) => {
  hideAlertReset();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertReset, 5000);
};
