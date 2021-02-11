const fadeTime = +window.localStorage.getItem('fadeTime');
$('.loadingContainer').fadeIn(fadeTime);

$(async () => {
  const TextsOrganiser = new window.modules.TextsOrganiser();

  $('.loadingText').append(`<p class="h5">${TextsOrganiser.getText('dataLoading')}</p>`);

  const DataHandler = new window.modules.DataHandler(window.localStorage.getItem('dbName'));
  await DataHandler.initialiseLocalDB();
  await DataHandler.updateLocalDB();
  await DataHandler.initialiseLocalFavouritesDB();

  $('.loadingContainer').fadeOut(fadeTime);

  window.location.href = 'menu.html';
});
