$(() => {
  window.modules = {
    ...window.modules,
    Formatter: class {
      static getFormattedRecords(records) {
        const me = this;
        return records.map(record => {
          return {
            ...record,
            textPl: me.getFormattedText(record.textPl),
            textEng: me.getFormattedText(record.textEng)
          };
        });
      }

      static typeConvertRecords(records = []) {
        records.forEach(result =>
          Object.keys(result).forEach(key => {
            if (!isNaN(result[key])) {
              result[key] = +result[key];
            }
          })
        );
      }

      static escapeRecordsSpecialCharacters(records = []) {
        records.forEach(result =>
          Object.keys(result).forEach(key => {
            if (isNaN(result[key])) {
              result[key] = `${result[key]}`.replace(/(")/g, '""');
            }
          })
        );
      }

      static getEscapeSpecialCharactersText(text) {
        return `${text}`
          .replace(/(")/g, '""')
          .replace(/%C4%85/g, 'ą')
          .replace(/%C4%87/g, 'ć')
          .replace(/%C4%99/g, 'ę')
          .replace(/%C5%82/g, 'ł')
          .replace(/%C5%84/g, 'ń')
          .replace(/%C3%B3/g, 'ó')
          .replace(/%C5%9B/g, 'ś')
          .replace(/%C5%BA/g, 'ź')
          .replace(/%C5%BC/g, 'ż')
          .replace(/%C4%84/g, 'Ą')
          .replace(/%C4%86/g, 'Ć')
          .replace(/%C4%98/g, 'Ę')
          .replace(/%C5%81/g, 'Ł')
          .replace(/%C5%83/g, 'Ń')
          .replace(/%C3%93/g, 'Ó')
          .replace(/%C5%9A/g, 'Ś')
          .replace(/%C5%B9/g, 'Ź')
          .replace(/%C5%BB/g, 'Ż');
      }

      static getFormattedText(text) {
        return `<p>${text
          .replace(/(\\\\)/g, '')
          .replace(/(\\begin{enumerate}\[wide=*.pt,*.leftmargin=*..pt,*.labelwidth=*..pt,*.align=left]\r\n)/g, '')
          .replace(/(\\end{enumerate}\r\n)/g, '')
          .replace(/(\\end{enumerate})/g, '')
          .replace(/(\\setcounter{enumi}{*..}\r\n)/g, '')
          .replace(/(\\vspace{*..pt})/g, '\r\n')
          .replace(/(\\hspace{*..pt})/g, ''.padStart(+window.localStorage.getItem('indentation') || 3))
          .split('\\item')
          .reduce((acc, item, index) => acc + `${index}.` + item, '')
          .slice(2)
          .replace(/(\\textbf{Ref\.:})/g, '<span class="font-weight-bold">Ref.:</span>')
          .replace(/(\\textbf{Chorus:})/g, '<span class="font-weight-bold">Chorus:</span>')
          .replace(/(\\textbf{)/g, '<span class="font-weight-bold">')
          .replace(/(\\textit{)/g, '<span class="font-italic">')
          .replace(/(\{\\lsstyle )/g, '<span>')
          .replace(/(\\textlsSmall{)/g, '<span>')
          .replace(/(\\textlsSmaller{)/g, '<span>')
          .replace(/(\\textlsSmallest{)/g, '<span>')
          .replace(/(})/g, '</span>')
          .replace(/(\r\n\r\n)/g, '<br />')
          .replace(/(\n)/g, '<br />')}</p>`;
      }
    }
  };
});
