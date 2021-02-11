$(() => {
  window.modules = {
    ...window.modules,
    TextsOrganiser: class {
      constructor() {
        this.language = window.localStorage.getItem('selectedLanguage');
      }

      getText(name) {
        try {
          return this._texts[name][this.language];
        } catch (e) {
          return ' ';
        }
      }

      _texts = {
        dataLoading: { Pl: 'Ładowanie danych...', Eng: 'Loading data...' },
        noResults: { Pl: 'Brak wyników', Eng: 'No results' },
        index: { Pl: 'Spis treści', Eng: 'Index' },
        page: { Pl: 'str.', Eng: 'p.' },
        search: { Pl: ' Szukaj', Eng: ' Search' },
        searchResults: { Pl: 'Wyniki wyszukiwania', Eng: 'Search results' },
        favourites: { Pl: 'Ulubione', Eng: 'Favourites' }
      };
    }
  };
});
