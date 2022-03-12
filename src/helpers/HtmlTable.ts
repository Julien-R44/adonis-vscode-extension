import { ViewColumn, window } from 'vscode'

export class HtmlTable {
  /**
   * CSS Styling of the table
   */
  private static get tableStyle(): string {
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
        .search { padding-top: 15px; padding-bottom: 15px; width: 95vw; margin: auto; }
        #filter { display: block; padding: 5px; width: 100%; }
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
        html += '<td>' + item + '</td>'
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
        routeEvents()
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
