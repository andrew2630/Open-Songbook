$(() => {
  window.modules = {
    ...window.modules,
    LocalDB: class {
      constructor(name) {
        this.db = window.openDatabase(`[Database]com.andrzejpudzisz.${name}`, '1.0', `${name}`, 2 * 1024 * 1024);
      }

      executeSQL(sql) {
        const me = this;
        return new Promise((resolve, reject) => {
          me.db.transaction(tx => tx.executeSql(sql, [], (tx, response) => resolve(response)), err => reject(err));
        });
      }
    }
  };
});
