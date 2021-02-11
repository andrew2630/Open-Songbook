const fadeTime = +window.localStorage.getItem('fadeTime');
$('.loadingContainer').fadeIn(fadeTime);
$('.container').fadeOut(fadeTime);

$(async () => {
  const TextsOrganiser = new window.modules.TextsOrganiser();
  const selectedLanguage = window.localStorage.getItem('selectedLanguage');
  const selectedId = +window.location.search.slice(1);

  const DataHandler = new window.modules.DataHandler(window.localStorage.getItem('dbName'));
  const selectedRecord = (await DataHandler.getSingleRecord(selectedId))[0];

  $('.content').append(`<p class="h2 text-center">${selectedRecord['title' + selectedLanguage]}</p>`);

  Object.keys(selectedRecord)
    .filter(key => key.substr(0, 5) === 'title' && key !== `title${selectedLanguage}`)
    .forEach(key =>
      $('.content').append(
        `<p class="alphabeticalBlock numericBlock h5 otherLanguage text-center">(${selectedRecord[key]})</p>`
      )
    );

  $('.content').append(`<p class="h6 text-center">[${TextsOrganiser.getText('page')} ${selectedRecord.page}]</p>`);
  $('.content').append(`<p>${selectedRecord['text' + selectedLanguage]}</p>`);
  $('.content').append(`<p class="space"></p>`);
  $('.content').append(`<hr />`);
  $('.content').append(`<p class="space"></p>`);

  Object.keys(selectedRecord)
    .filter(key => key.substr(0, 4) === 'text' && key !== `text${selectedLanguage}`)
    .forEach(key =>
      $('.content').append(`<div class="alphabeticalBlock numericBlock otherLanguage">${selectedRecord[key]}</div>`)
    );

  $('.loadingContainer').fadeOut(fadeTime);
  $('.container').fadeIn(fadeTime);
  $('#navBar').css('display', 'inline');
});
