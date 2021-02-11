const fadeTime = +window.localStorage.getItem('fadeTime');
$('.loadingContainer').fadeIn(fadeTime);
$('.container').fadeOut(fadeTime);

$(() => {
  $('.buttonPl').click(() => goToLoadingPage('Pl'));

  $('.buttonEng').click(() => goToLoadingPage('Eng'));

  $('.loadingContainer').fadeOut(fadeTime);
  $('.container').fadeIn(fadeTime);
});

function goToLoadingPage(selectedLanguage) {
  window.localStorage.setItem('selectedLanguage', selectedLanguage);
  window.location.href = 'loading.html';
}
