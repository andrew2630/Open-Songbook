$(() => {
  window.modules = {
    ...window.modules,
    DataHandler: class {
      constructor(localDBName) {
        this.db = new window.modules.LocalDB(localDBName);
        this.apiAddress = window.localStorage.getItem('apiAddress');
      }

      initialiseLocalDB() {
        return this.db.executeSQL(
          'CREATE TABLE IF NOT EXISTS songs ' +
            '(id i primary key, page i, titlePl text, titleEng text, textPl text, textEng text, version i)'
        );
      }

      initialiseLocalFavouritesDB() {
        return this.db.executeSQL(
          'CREATE TABLE IF NOT EXISTS favourites ' +
            '(id i primary key, page i, titlePl text, titleEng text, textPl text, textEng text, version i)'
        );
      }

      updateLocalDB() {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve => {
          me
            ._getNewestVersions()
            .then(async response => {
              let externalIndexes = JSON.parse(response);
              Formatter.typeConvertRecords(externalIndexes);

              const internalDBRecords = await me._fetchFromInternalDB();

              const recordsToUpdate = externalIndexes.filter(
                externalIndex =>
                  !internalDBRecords.find(
                    internalRecord =>
                      internalRecord.id === externalIndex.id && internalRecord.version >= externalIndex.version
                  )
              );

              const parameters = `indexes=${recordsToUpdate.reduce((acc, item) => acc + ' OR id = ' + item.id, '0')}`;
              // if (!!window.localStorage.getItem('isDBFetchNeeded')) {
              me
                ._fetchFromExternalDB(parameters)
                .then(async dbResponse => {
                  const results = JSON.parse(dbResponse);
                  Formatter.typeConvertRecords(results);
                  Formatter.escapeRecordsSpecialCharacters(results);

                  await me._fillInternalDB(results);
                  resolve();
                })
                .catch(async () => resolve());
              // } else {}
            })
            .catch(() => resolve());
        });
      }

      getRecords() {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve => resolve(Formatter.getFormattedRecords(await me._fetchFromInternalDB())));
      }

      getFavourites() {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve => resolve(Formatter.getFormattedRecords(await me._fetchFromFavouritesDB())));
      }

      getSingleRecord(index) {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve =>
          resolve(Formatter.getFormattedRecords(await me._fetchSingleFromInternalDB(index)))
        );
      }

      getSingleFavouritesRecord(index) {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve =>
          resolve(Formatter.getFormattedRecords(await me._fetchSingleFromFavouritesDB(index)))
        );
      }

      getFilteredRecords(searchedText) {
        const Formatter = window.modules.Formatter;
        const me = this;

        return new Promise(async resolve =>
          resolve(Formatter.getFormattedRecords(await me._fetchFilteredFromInternalDB(searchedText)))
        );
      }

      async addToFavourites(index) {
        const record = (await this._fetchSingleFromInternalDB(index))[0];

        if (!record) {
          return;
        }

        return this.db.executeSQL(
          `INSERT INTO favourites (id, page, titlePl, titleEng, textPl, textEng, version) ` +
            `VALUES (${record.id}, ${record.page}, "${record.titlePl}", "${record.titleEng}", ` +
            `"${record.textPl}", "${record.textEng}", ${record.version})`
        );
      }

      removeFromFavourites(index) {
        return this.db.executeSQL(`DELETE FROM favourites WHERE id = ${index}`);
      }

      _getNewestVersions() {
        const me = this;
        return new Promise((resolve, reject) => {
          const xmlhttp = new XMLHttpRequest();

          xmlhttp.onload = () => resolve(xmlhttp.responseText);
          xmlhttp.onerror = () => reject();

          xmlhttp.open('GET', `${me.apiAddress}/getUpdates.php`, true);
          xmlhttp.send(null);
        });
      }

      _fetchFromExternalDB(parameters) {
        const me = this;
        return new Promise((resolve, reject) => {
          const xmlhttp = new XMLHttpRequest();

          xmlhttp.onload = () => resolve(xmlhttp.responseText);
          xmlhttp.onerror = () => reject();

          xmlhttp.open('GET', `${me.apiAddress}/getSongs.php?${parameters}`, true);
          xmlhttp.send(null);
        });
      }

      _fetchFromInternalDB() {
        return new Promise(resolve =>
          this.db.executeSQL('SELECT * FROM songs').then(response => resolve([...response.rows]))
        );
      }

      _fetchFromFavouritesDB() {
        return new Promise(resolve =>
          this.db.executeSQL('SELECT * FROM favourites').then(response => resolve([...response.rows]))
        );
      }

      _fetchSingleFromInternalDB(index) {
        return new Promise(resolve =>
          this.db.executeSQL(`SELECT * FROM songs WHERE id = ${index}`).then(response => resolve([...response.rows]))
        );
      }

      _fetchSingleFromFavouritesDB(index) {
        return new Promise(resolve =>
          this.db
            .executeSQL(`SELECT * FROM favourites WHERE id = ${index}`)
            .then(response => resolve([...response.rows]))
        );
      }

      _fetchFilteredFromInternalDB(searchedText) {
        return new Promise(resolve => {
          let query = '';
          if (isNaN(searchedText)) {
            query = `SELECT * FROM songs
              WHERE titlePl LIKE '%${searchedText}%'
                OR titleEng LIKE '%${searchedText}%'
                OR textPl LIKE '%${searchedText}%'
                OR textEng LIKE '%${searchedText}%'`;
          } else {
            query = `SELECT * FROM songs  WHERE page = '${searchedText}'`;
          }

          this.db.executeSQL(query).then(response => resolve([...response.rows]));
        });
      }

      _fillInternalDB(rows) {
        const me = this;
        return new Promise(async (resolve, reject) => {
          const existingRecords = await me._fetchFromInternalDB();
          const recordsToInsert = rows.filter(row => !existingRecords.find(record => record.id === row.id));
          const recordsToUpdate = rows.filter(row =>
            existingRecords.find(record => record.id === row.id && record.version < row.version)
          );

          let queries = [];
          recordsToInsert.forEach(row =>
            queries.push(
              me.db.executeSQL(
                `INSERT INTO songs (id, page, titlePl, titleEng, textPl, textEng, version) ` +
                  `VALUES (${row.id}, ${row.page}, "${row.titlePl}", "${row.titleEng}", ` +
                  `"${row.textPl}", "${row.textEng}", ${row.version})`
              )
            )
          );

          recordsToUpdate.forEach(row =>
            queries.push(
              me.db.executeSQL(
                `UPDATE songs SET page = ${row.page}, titlePl = "${row.titlePl}", titleEng = "${row.titleEng}", ` +
                  `textPl = "${row.textPl}", textEng = "${row.textEng}", version = ${row.version} ` +
                  `WHERE id = ${row.id}`
              )
            )
          );

          Promise.all(queries).then(response => resolve(response)).catch(error => reject(error));
        });
      }
    }
  };
});
