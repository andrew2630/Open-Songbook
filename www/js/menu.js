const fadeTime = +window.localStorage.getItem('fadeTime');
$('.loadingContainer').fadeIn(fadeTime);
$('.container').fadeOut(fadeTime);

$(async () => {
  const TextsOrganiser = new window.modules.TextsOrganiser();
  const selectedLanguage = window.localStorage.getItem('selectedLanguage');

  $('.loadingText').append(`<p class="h5">${TextsOrganiser.getText('dataLoading')}</p>`);

  const DataHandler = new window.modules.DataHandler(window.localStorage.getItem('dbName'));
  const records = await DataHandler.getRecords();

  const alphabeticallySortedRecords = JSON.parse(
    JSON.stringify(
      records.sort((first, second) =>
        first[`title${selectedLanguage}`].localeCompare(second[`title${selectedLanguage}`])
      )
    )
  );

  const numericallySortedRecords = JSON.parse(
    JSON.stringify(records.sort((first, second) => first.page - second.page))
  );

  $('.content').append(
    `<div>
      <p class="h2 text-center">${TextsOrganiser.getText('index')}</p>
      <p class="space"></p>
    </div>`
  );

  if (records.length) {
    let letters = [...new Set(alphabeticallySortedRecords.map(item => item[`title${selectedLanguage}`][0]))];

    $('.content').append(`<h4 class="text-center alphabeticalBlock">${letters[0]}</h3>`);
    alphabeticallySortedRecords.forEach(record => {
      if (record['title' + selectedLanguage][0] !== letters[0]) {
        letters = letters.splice(1);
        $('.content').append(`<h4 class="text-center alphabeticalBlock">${letters[0]}</h3>`);
      }

      $('.content').append('<p class="alphabetical">');
      $('.content').append(
        `<span class="h6 alphabetical">[${TextsOrganiser.getText('page')} ${record.page}]</span>
        <a class="alphabetical" href="song.html?${record.id}">${record['title' + selectedLanguage]}</a> `
      );

      Object.keys(record)
        .filter(key => key.substr(0, 5) === 'title' && key !== `title${selectedLanguage}`)
        .forEach(key => $('.content').append(`<span class="h6 otherLanguage alphabetical"> (${record[key]})</span>`));

      $('.content').append('</p>');
    });

    let pageNumbers = [...new Set(numericallySortedRecords.map(item => item.page))];

    $('.content').append(`<h4 class="text-center numericBlock">
      ${TextsOrganiser.getText('page')} ${pageNumbers[0]}
    </h3>`);

    numericallySortedRecords.forEach(record => {
      if (record.page !== pageNumbers[0]) {
        pageNumbers = pageNumbers.splice(1);
        $('.content').append(`<h4 class="text-center numericBlock">
          ${TextsOrganiser.getText('page')} ${pageNumbers[0]}
        </h3>`);
      }

      $('.content').append('<p class="numeric">');
      $('.content').append(
        `<a class="numeric" href="song.html?${record.id}">${record['title' + selectedLanguage]}</a> `
      );

      Object.keys(record)
        .filter(key => key.substr(0, 5) === 'title' && key !== `title${selectedLanguage}`)
        .forEach(key => $('.content').append(`<span class="h6 otherLanguage numeric"> (${record[key]})</span>`));

      $('.content').append('</p>');
    });
  } else {
    $('.content').append(`<div><p class="text-center">${TextsOrganiser.getText('noResults')}</p></div>`);
  }

  $('.loadingContainer').fadeOut(fadeTime);
  $('.container').fadeIn(fadeTime);
  $('#navBar').css('display', 'inline');
});
