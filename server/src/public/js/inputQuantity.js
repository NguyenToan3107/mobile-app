document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.input-qty');
  const decreaseBtn = document.querySelector('.is-form.minus');
  const increaseBtn = document.querySelector('.plus.is-form');

  decreaseBtn.addEventListener('click', function () {
    input.value--;
  });

  increaseBtn.addEventListener('click', function () {
    input.value++;
  });
});
