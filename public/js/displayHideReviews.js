const btnDisplayReview = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v0/reviews/getAllReviewMinusTwo?page=2&limit=2',
    });
    console.log(res);
    if (res.data.status == 'success') {
      console.log('success');
      //   location.reload(true);
    }
  } catch (err) {
    console.log(err.message);
  }
};

// DOM Element

const showMoreButton = document.querySelector('.showMoreButton');
const showLessButton = document.querySelector('.showLessButton');
const hiddenReviews = document.getElementsByClassName('hidden-review');

showMoreButton.addEventListener('click', async () => {
  for (let i = 0; i < hiddenReviews.length; i++) {
    hiddenReviews[i].style.display = 'block';
  }
  showMoreButton.style.display = 'none';
  showLessButton.style.display = 'inline-block';
});

showLessButton.addEventListener('click', async () => {
  for (let i = 0; i < hiddenReviews.length; i++) {
    hiddenReviews[i].style.display = 'none';
  }
  showMoreButton.style.display = 'inline-block';
  showLessButton.style.display = 'none';
});
