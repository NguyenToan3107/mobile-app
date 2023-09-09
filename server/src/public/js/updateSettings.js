const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v0/users/updatePassword'
        : '/api/v0/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlertSettings('message', 'Cập nhật thành công');
      console.log('success');
      location.reload(true);
    }
  } catch (err) {
    showAlertSettings('error', 'Cập nhật thất bại 💥');

    console.log('error', err);
  }
};

// DOM element

document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const photo = document.getElementById('photo').files[0];

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('photo', photo);

  updateSettings(formData, 'data');
});

document
  .querySelector('.form-user-settings')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Update...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// alert

const hideAlertSettings = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertSettings = (type, msg) => {
  hideAlertSettings();

  const makeup = `<div class='alert alert--${type}'>${msg}</div>`;

  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);

  window.setTimeout(hideAlertSettings, 5000);
};
