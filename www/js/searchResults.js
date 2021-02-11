const fadeTime = +window.localStorage.getItem('fadeTime');
$('.loadingContainer').fadeIn(fadeTime);
$('.container').fadeOut(fadeTime);

$(async () => {
  const TextsOrganiser = new window.modules.TextsOrganiser();
  const Formatter = window.modules.Formatter;
  const selectedLanguage = window.localStorage.getItem('selectedLanguage');

  const searchedText = Formatter.getEscapeSpecialCharactersText(window.location.search.slice(1).replace(/(%20)/g, ' '));

  $('.loadingText').append(`<p class="h5">${TextsOrganiser.getText('dataLoading')}</p>`);

  const DataHandler = new window.modules.DataHandler(window.localStorage.getItem('dbName'));
  const records = await DataHandler.getFilteredRecords(searchedText);

  $('.content').append(
    `<div>
      <p class="h2 text-center">${TextsOrganiser.getText('searchResults')}
        <span class="h4">(${records.length})</span>
      </p>
      <p class="h5 text-center font-italic">"${searchedText}"</p>
      <p class="space"></p>
    </div>`
  );

  records.forEach(record => {
    $('.content').append('<p>');
    $('.content').append(
      `<span class="h6">[${TextsOrganiser.getText('page')} ${record.page}]</span>
      <a href="song.html?${record.id}">${record['title' + selectedLanguage]}</a> `
    );

    Object.keys(record)
      .filter(key => key.substr(0, 5) === 'title' && key !== `title${selectedLanguage}`)
      .forEach(key => $('.content').append(`<span class="alphabetical numeric h6 otherLanguage"> (${record[key]})</span>`));

    $('.content').append('</p>');
  });

  $('.loadingContainer').fadeOut(fadeTime);
  $('.container').fadeIn(fadeTime);
  $('#navBar').css('display', 'inline');
});
