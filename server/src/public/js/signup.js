const signup = async (email, name, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v0/users/signup`,
      data: {
        email,
        name,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlertSignUp('success', 'Đăng ký thành công.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlertSignUp('error', err.response.data.message);
  }
};

// DOM element
document.querySelector('.formSignUp').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  signup(email, name, password, passwordConfirm);

  // reset feild
  document.getElementById('email').value = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('passwordConfirm').value = '';
});

// alert
const hideAlertSignUp = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertSignUp = (type, msg) => {
  hideAlertSignUp();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('header').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlertSignUp, 3000);
};
