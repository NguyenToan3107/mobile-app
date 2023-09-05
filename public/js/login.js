const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v0/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlertLogIn('message', 'Đăng nhập thành công');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlertLogIn('error', 'Đăng nhập thất bại');
    console.log(err.response.data.message);
  }
};

document.querySelector('.formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);

  // reset feild
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});

const hideAlertLogIn = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertLogIn = (type, msg) => {
  hideAlertLogIn();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertLogIn, 5000);
};
