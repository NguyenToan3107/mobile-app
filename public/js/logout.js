const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v0/users/logout',
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log('error', err);
  }
};

document.querySelector('.btn--logout').addEventListener('click', logout);
