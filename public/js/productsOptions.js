const products = async (price) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v0/mobiles/?newPrice=${price}`,
    });
    if (res.data.status === 'success') {
      console.log('Success');
    }
  } catch (err) {
    console.log('Error');
  }
};

const filter = document.querySelector('.btn-filter');
if (filter) {
  filter.addEventListener('click', () => {
    const filterInput = document.querySelector('.input-filter').value;
    console.log(filterInput);
    const price = filterInput / 1000000;
    products(price);
  });
}
