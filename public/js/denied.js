const denied = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v0/users/deleteMe',
    });

    if (res.data.status === 'success') {
      showAlertDenied('success', 'Tài khoản đã bị tắt trạng thái. ');
      location.assign('/');
    }
  } catch (err) {
    showAlertDenied('success', 'Tắt trạng thái thất bại.  ');
  }
};

// DOM element

document.querySelector('.denied').addEventListener('click', () => {
  const html = `<div id="confirmationBox" class='centered-box'>
    <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
    <div class="confirm_denied">
        <button id="confirmBtn">Chắc chắn</button>
        <button id="cancelBtn">Hủy bỏ</button>
    </div>    
  </div>`;
  document.querySelector('header').insertAdjacentHTML('afterbegin', html);

  const cancelBtn = document.querySelector('#cancelBtn');
  const confirmBtn = document.querySelector('#confirmBtn');
  const confirmationBox = document.querySelector('#confirmationBox');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      confirmationBox.style.display = 'none';
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', denied);
  }
});

// Alert

const hideAlertDenied = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlertDenied = (type, msg) => {
  hideAlertDenied();
  const makeup = `<div class='error-${type} error'>${msg}</div>`;
  document.querySelector('header').insertAdjacentHTML('afterbegin', makeup);
  window.setTimeout(hideAlertDenied, 3000);
};
