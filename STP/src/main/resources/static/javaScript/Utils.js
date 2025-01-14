import * as OnTableRowClick from './OnTableRowClick.js'
import * as ErrorHandler from './ErrorHandler.js'

export function FillTable(table, tableName = table.getAttribute('name')) {
    var url = '/getAll_' + encodeURIComponent(tableName)

    fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw response;
            } else {
                return response.json()
            }
        })
        .then(rows => {
            if (rows.length > 0) {

                var row = AddRow(rows[0], table, tableName);
                if (table.getAttribute('id') == 'mainTable') {
                    chosenRow = row
                    row.style.backgroundColor = "#CCC"
                }
                for (let i = 1; i < rows.length; i++) {
                    AddRow(rows[i], table, tableName)
                }
            }
            console.log("[INFO] - fetch 'getAllData' was complited")
        })
        .catch(error => {
            console.log(error)
            //ErrorHandler.HandleFetchError(error)
        })
}

export function AddRow(rowData, table, tableName) {
    var PKName = table.getAttribute('d_PKName')
    var tableBody = table.querySelector('tbody')
    var headers = table.querySelectorAll('th')
    var row = tableBody.insertRow()
    row.tabIndex = 1

    // Запоминаем значение первичного ключа записи
    row.setAttribute('d_FKValue', rowData[PKName])
    // Запоминаем какой таблице в HTML принадлежит запись
    row.setAttribute('d_tableId', table.getAttribute('id'))

    for (let i = 0; i < headers.length; i++) {
        var cell = row.insertCell()
        var headerName = headers[i].getAttribute('name')
        let value = rowData[headerName]

        cell.setAttribute('d_value', value)
        cell.textContent = value
        if (value == null) {
            continue
        }

        // Расширить, если необходимо
        if (headers[i].getAttribute('d_extandBy') != undefined) {
            var extandTableName = headers[i].getAttribute('d_extandBy')
            ExtandCell(cell, extandTableName)
        }
    }

    row.addEventListener('click', OnTableRowClick.OnTableRowClick);

    return row
}

function ExtandCell(cell, tableName) {
    var url = '/getRow/' + encodeURIComponent(tableName) + '/'
        url += cell.getAttribute('d_value')
    
    fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw response;
            } else {
                return response.json()
            }
        })
        .then(row => {
            //var row = rows[0]
            var names

            switch (tableName) {
            case "reader":
                names = ['name', 'phone']
                break;
            case "book":
                names = ['isbn', 'title']
                break;
            }
            //console.log(names, rows)
            cell.textContent = row[names[0]]
            for (let i = 1; i < names.length; i++) {
                if (row[names[i]] != null) {
                    if (names[i] == 'f_name' || names[i] == 'p_name') {
                        cell.textContent += ' ' + row[names[i]]
                    } else {
                        cell.textContent += ', ' + row[names[i]]
                    }

                }
            }
            console.log("[INFO] - fetch 'getRow' was complited")
        })
        .catch(error => {
            ErrorHandler.HandleFetchError(error)
        })
}