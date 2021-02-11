$(() => {
  window.localStorage.clear();
  window.localStorage.setItem('apiAddress', '*YOUR API ADDRESS*');
  window.localStorage.setItem('fadeTime', '200');
  window.localStorage.setItem('indentation', '3');
  window.localStorage.setItem('selectedLanguage', 'Pl');
  window.localStorage.setItem('dbName', 'open_songbook');
  window.localStorage.setItem('displayOption', 'alphabetical');

  const fontSize = '24px';
  window.localStorage.setItem('fontSize', fontSize);

  window.localStorage.setItem(
    'fontSizes',
    JSON.stringify(
      [...Array(30).keys()].map(x => x + 1).reduce((result, item) => {
        result[item] = `${item * 2}px`;
        return result;
      }, {})
    )
  );

  let selectedFontIndex = '12';
  try {
    selectedFontIndex = Object.entries(JSON.parse(window.localStorage.getItem('fontSizes'))).find(
      property => property[1] === fontSize
    )[0];
  } catch (e) {}

  window.localStorage.setItem('selectedFontIndex', selectedFontIndex);

  window.location.href = 'view/languageSelection.html';
});
