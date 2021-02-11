$(async () => {
  [...document.getElementsByTagName('body')].forEach(
    item => (item.style['font-size'] = window.localStorage.getItem('fontSize'))
  );

  const TextsOrganiser = new window.modules.TextsOrganiser();
  const DataHandler = new window.modules.DataHandler(window.localStorage.getItem('dbName'));

  $('body').append(
    `<div id="navBar">
      <button id="menu"></button>
      <div id="leftBox">
        <div class="leftLine">
          <button id="displaySwitch"></button>
          <button id="favourites"></button>
        </div>
        <div class="leftLine">
          <button id="showLanguageBtn"></button>
          <button id="addToFavouritesBtn" class="notSelected"></button>
        </div>
      </div>
      <input type="search" id="input" placeholder="${TextsOrganiser.getText('search')}"></input>
      <button id="increaseFontBtn"></button>
      <button id="decreaseFontBtn"></button>
    </div>`
  );

  handleFavourites = async () => {
    if (window.location.href.match('song.html')) {
      const addToFavouritesBtn = document.getElementById('addToFavouritesBtn');
      const selectedId = +window.location.search.slice(1);
      const selectedRecords = await DataHandler.getSingleFavouritesRecord(selectedId);

      if (selectedRecords.length) {
        addToFavouritesBtn.classList.remove('notSelected');
        addToFavouritesBtn.classList.add('selected');
      } else {
        addToFavouritesBtn.classList.remove('selected');
        addToFavouritesBtn.classList.add('notSelected');
      }
    }
  };

  handleFavourites();

  disableInactiveButtons = () => {
    if (window.location.href.match('menu.html')) {
      const menu = document.getElementById('menu');
      menu.onclick = () => {};
      menu.classList.add('inactive');
    }

    if (!window.location.href.match('menu.html') && !window.location.href.match('favourites.html')) {
      const displaySwitch = document.getElementById('displaySwitch');
      displaySwitch.onclick = () => {};
      displaySwitch.classList.add('inactive');
    }

    if (window.location.href.match('favourites.html')) {
      const favourites = document.getElementById('favourites');
      favourites.onclick = () => {};
      favourites.classList.add('inactive');
    }

    if (!window.location.href.match('song.html')) {
      const addToFavouritesBtn = document.getElementById('addToFavouritesBtn');
      addToFavouritesBtn.onclick = () => {};
      addToFavouritesBtn.classList.remove('notSelected');
      addToFavouritesBtn.classList.add('inactive');
    }

    // document.getElementById('showLanguageBtn').onclick = () => {};
    // document.getElementById('input').onkeypress = () => {};
    // document.getElementById('increaseFontBtn').onclick = () => {};
    // document.getElementById('decreaseFontBtn').onclick = () => {};
  };

  document.getElementById('menu').onclick = () => (window.location.href = 'menu.html');

  document.getElementById('displaySwitch').onclick = async () => {
    let option = window.localStorage.getItem('displayOption');
    const alphabeticalElements = [...document.getElementsByClassName('alphabetical')];
    const alphabeticalBlockElements = [...document.getElementsByClassName('alphabeticalBlock')];
    const numericElements = [...document.getElementsByClassName('numeric')];
    const numericBlockElements = [...document.getElementsByClassName('numericBlock')];

    if (option === 'alphabetical') {
      alphabeticalElements.forEach(item => (item.style.display = 'none'));
      alphabeticalBlockElements.forEach(item => (item.style.display = 'none'));
      numericElements.forEach(item => (item.style.display = 'inline'));
      numericBlockElements.forEach(item => (item.style.display = 'block'));
      option = 'numeric';
    } else {
      alphabeticalElements.forEach(item => (item.style.display = 'inline'));
      alphabeticalBlockElements.forEach(item => (item.style.display = 'block'));
      numericElements.forEach(item => (item.style.display = 'none'));
      numericBlockElements.forEach(item => (item.style.display = 'none'));
      option = 'alphabetical';
    }

    [...document.getElementsByClassName('otherLanguage')].forEach(item => (item.style.display = 'none'));

    window.localStorage.setItem('displayOption', option);
  };

  document.getElementById('showLanguageBtn').onclick = async () => {
    let option = window.localStorage.getItem('displayOption');
    const otherLanguageElements = [...document.getElementsByClassName('otherLanguage')];
    const foundElement = otherLanguageElements.find(element => element.className.match(option));

    if (foundElement && (foundElement.style.display === 'none' || !foundElement.style.display)) {
      otherLanguageElements
        .filter(item => item.className.match(option))
        .forEach(item => (item.style.display = 'inline'));

      otherLanguageElements
        .filter(item => item.className.match(`${option}Block`))
        .forEach(item => (item.style.display = 'block'));
    } else {
      otherLanguageElements
        .filter(item => item.className.match(option) || item.className.match(`${option}Block`))
        .forEach(item => (item.style.display = 'none'));
    }
  };

  document.getElementById('favourites').onclick = () => (window.location.href = 'favourites.html');

  $('#input').keydown(e => {
    if (e.which == 13) {
      window.location.href = `searchResults.html?${$('#input').val()}`;
    }
  });

  document.getElementById('addToFavouritesBtn').onclick = async () => {
    const addToFavouritesBtn = document.getElementById('addToFavouritesBtn');
    const selectedId = +window.location.search.slice(1);

    if (selectedId > 0) {
      if (addToFavouritesBtn.className === 'notSelected') {
        addToFavouritesBtn.classList.remove('notSelected');
        addToFavouritesBtn.classList.add('selected');
        await DataHandler.addToFavourites(selectedId);
      } else {
        addToFavouritesBtn.classList.remove('selected');
        addToFavouritesBtn.classList.add('notSelected');
        await DataHandler.removeFromFavourites(selectedId);
      }
    }
  };

  document.getElementById('increaseFontBtn').onclick = async () => {
    let selectedFontIndex = +window.localStorage.getItem('selectedFontIndex');
    const fontSizes = JSON.parse(window.localStorage.getItem('fontSizes'));

    selectedFontIndex += 1;
    const newFontSize = fontSizes[selectedFontIndex] || window.localStorage.getItem('fontSize');

    window.localStorage.setItem('selectedFontIndex', selectedFontIndex);
    window.localStorage.setItem('fontSize', newFontSize);
    $('.content').css('font-size', newFontSize);
  };

  document.getElementById('decreaseFontBtn').onclick = async () => {
    let selectedFontIndex = +window.localStorage.getItem('selectedFontIndex');
    const fontSizes = JSON.parse(window.localStorage.getItem('fontSizes'));

    selectedFontIndex -= 1;
    const newFontSize = fontSizes[selectedFontIndex] || window.localStorage.getItem('fontSize');

    window.localStorage.setItem('selectedFontIndex', selectedFontIndex);
    window.localStorage.setItem('fontSize', newFontSize);
    $('.content').css('font-size', newFontSize);
  };

  disableInactiveButtons();
});
