import { ViewColumn, window } from 'vscode'

export class HtmlTable {
  /**
   * CSS Styling of the table
   */
  private static get tableStyle() {
    return `
      <style>
        * { box-sizing: border-box; }
        body { padding: 0; margin: 0; }
        table { border-collapse: collapse; width: 95vw; margin: auto; }
        table thead { font-size: 16px; text-align: left; }
        table tbody { font-size: 14px; }
        table td, table th { padding: 10px; }
        table tbody tr:nth-child(odd) { background-color: rgba(0,0,0,0.25); }
        table td a { color: #4080d0; cursor: pointer; }
        .hidden { display: none; }
        .search {
          padding-top: 15px;
          padding-bottom: 15px;
          width: 95vw;
          margin: auto;
          display: flex;
        }
        .rotate { animation: spin 1s linear infinite; }
        #filter { display: block; padding: 5px; width: 100%; }
        #search-icon {
          cursor: pointer;
          margin-left: 10px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `
  }

  /**
   * Generate an HTML table with the given headers and rows
   */
  private static generateHtml(tableHeaders: string[], tableRows: string[][]) {
    let html = `
      <div class="search">
        <input type="text" id="filter" placeholder="Search a route">
        <div id="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>
        </div>
      </div>
    `

    html += `${this.tableStyle}<table>`

    /**
     * Create <thead> with given table headers
     */
    html += '<thead><tr>'
    tableHeaders.forEach((header) => (html += `<th>${header}</th>`))
    html += '</tr></thead>'

    /**
     * Create <tbody> with given table rows
     */
    html += '<tbody>'
    tableRows.forEach((row) => {
      html += '<tr>'
      row.forEach((item) => {
        html += `<td>${item}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table>'

    return html
  }

  /**
   * Insert <script> tags in the given html with the search box logic
   */
  private static generateScriptSearchBox() {
    return `
      <script>
        const filter = document.querySelector('#filter')
        filter.focus()
        function filterItems(){
          let v = filter.value
          document.querySelectorAll('tbody > tr').forEach(row => {
            let txt = row.textContent
            let reg = new RegExp(v, 'ig')
            if (reg.test(txt) || v.length == 0) {
              row.classList.remove('hidden')
            } else {
              row.classList.add('hidden')
            }
          })
        }
        filter.addEventListener('input', filterItems)
      </script>
    `
  }

  /**
   * Generate a script tag with the logic for refreshing the table
   */
  private static generateScriptRefreshLogic() {
    return `
      <script>
        const vscode = acquireVsCodeApi();
        const icon = document.querySelector('#search-icon')

        icon.addEventListener('click', () => {
          vscode.postMessage({ command: 'refresh' })
          icon.classList.add('rotate')
        })

        function refreshCommand() {
          const body = document.querySelector('table tbody')
          let rows = event.data.rows
          let html = ''
          rows.forEach(row => {
            html += '<tr>'
            row.forEach(item => {
              html += '<td>' + item + '</td>'
            })
            html += '</tr>'
          })
          body.innerHTML = html
          filterItems()
          icon.classList.remove('rotate')
        }

        window.addEventListener('message', event => {
          if (event.data.command === 'refresh') {
            refreshCommand()
          } else if (event.data.command === 'refresh-failed') {
            icon.classList.remove('rotate')
          }
        })
      </script>
    `
  }

  /**
   * Open a virtual html file in the VSCode integrated webview
   */
  public static async openPanelWithTable(
    openPath: string,
    title: string,
    headers: string[],
    rows: string[][]
  ) {
    /**
     * Generate the whole HTML to insert in the Webview
     */
    let html = this.generateHtml(headers, rows)
    html += this.generateScriptSearchBox()
    html += this.generateScriptRefreshLogic()

    /**
     * Create a new VS Code panel with the given html as a WebView
     */
    const panel = window.createWebviewPanel(openPath, title, ViewColumn.Active, {
      enableScripts: true,
      retainContextWhenHidden: true,
    })

    panel.webview.html = html
    return panel
  }
}
