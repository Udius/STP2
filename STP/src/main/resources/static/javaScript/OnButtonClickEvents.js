import * as OnChoseInputClick from './OnChoseInputClick.js'
//import * as Utils from './Utils.js'
import * as ErrorHandler from './ErrorHandler.js'

var mainTable = document.getElementById('mainTable')

// _______ Удаление записи _______
export function OnDeleteBtnClick() {
    var submitMF = document.getElementById('submitDeleting')
    submitMF.showModal()
}

export async function OnSubmitDeleting() {
    var tableNameHTML = mainTable.getAttribute('name')
    var FKValue = chosenRow.getAttribute('d_FKValue')

    var url = '/deleteRow/' + tableNameHTML + '/'
        url += FKValue

    fetch(url, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw response
            }
            location.reload()
            console.log('[INFO] - Запись была удалена\n' + chosenRow)
        })
        .catch(error => {
            ErrorHandler.HandleFetchError(error)
        })
}

// _______ Обновление записи _______
export function OnUpdateBtnClick() {
    var mainTableHeaders = mainTable.getElementsByTagName('th')
    var updateMF = document.getElementById('updateRow')
    var updateTable = document.getElementById('updateTable')
    var updateTableTbody = updateTable.getElementsByTagName('tbody')[0]
    var newRow = chosenRow.cloneNode(true)

    if (updateTable.rows.length > 1) {
        updateTable.deleteRow(1)
    }

    newRow.setAttribute('d_tableName', 'updateTable')
    newRow.style.backgroundColor = null

    for (let i = 0; i < mainTableHeaders.length; i++) {
        var editType = mainTableHeaders[i].getAttribute('d_updateType')

        if (editType == 'manual') {
            newRow.cells[i].contentEditable = true
        } else if (editType == 'chose' || editType == 'select' ) {
            newRow.cells[i].contentEditable = false
        } else if (editType == 'date') {
            newRow.cells[i].contentEditable = true
        } else if (editType == 'non_editable') {
            newRow.cells[i].contentEditable = false
            newRow.cells[i].style.backgroundColor = "#EEE";
        } else {
            newRow.cells[i].style.backgroundColor = "#C00";
        }

        if (mainTableHeaders[i].getAttribute('d_inUpdateTime') == "hidden") {
            newRow.cells[i].style.display = 'none'
        }
    }

    // Подписываемся на событие выбора записи из другой таблицы по клику
    var headers = updateTable.getElementsByTagName('th')
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].getAttribute('d_updateType') == 'chose') {
            newRow.cells[i].addEventListener('click', OnChoseInputClick.OnChoseInputClick)
            newRow.cells[i].setAttribute('d_extandBy', headers[i].getAttribute('d_extandBy'))
        }
    }

    updateTableTbody.appendChild(newRow)

    updateMF.showModal()
}

export function OnSubmitUpdating() {
    var mainTableHeaders = mainTable.getElementsByTagName('th')
    var updateTable = document.getElementById('updateTable')
    var updateTableHeaders = updateTable.getElementsByTagName('th')
    var tableNameHTML = mainTable.getAttribute('name')
    var updateTableTbody = updateTable.getElementsByTagName('tbody')[0]
    var row = updateTableTbody.getElementsByTagName('tr')[0]
    var newData = { }

    var FKValue = chosenRow.getAttribute('d_FKValue')
    //newData['FK'] = ChTD.tablesData[tableNameHTML]['d_db_FKName']
    //newData[ChTD.tablesData[tableNameHTML]['d_db_FKName']] = chosenRow.getAttribute('D_FKValue')

    for (let i = 0; i < row.cells.length; i++) {
        var editType = mainTableHeaders[i].getAttribute('d_updateType')

        if (updateTableHeaders[i].getAttribute('d_inUpdateTime') == "hidden") {
            continue
        }

        if (row.cells[i].getAttribute('d_value') == 'null' && row.cells[i].textContent == '') {
            continue
        }
        
        if (editType == 'manual' || editType == 'date' || editType == 'select') {
            newData[mainTableHeaders[i].getAttribute('name')] = row.cells[i].textContent
            if (row.cells[i].textContent == '') newData[mainTableHeaders[i].getAttribute('name')] = null;
        } else if (editType == 'non_editable' || editType == 'chose') {
            newData[mainTableHeaders[i].getAttribute('name')] = row.cells[i].getAttribute('d_value')
        }
    }

    var url = '/updateRow/' + encodeURIComponent(tableNameHTML) + '/'
        url += FKValue
    var jsonData = JSON.stringify(newData)

    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
            if (!response.ok) {
                throw response
            }

            alert("Запись успешно отредактирована!")

            location.reload()
            console.log("[INFO] - Запись отредактирована");
        })
        .catch(error => {
            ErrorHandler.HandleFetchError(error)
        })
}

// _______ Добавление записи _______
export function OnInsertBtnClick() {
    var insertMF = document.getElementById('insertRow')

    // Подписываемся на событие выбора записи из другой таблицы по клику
    var inputs = insertMF.getElementsByTagName('input')
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('d_inputType') == 'chose') {
            inputs[i].addEventListener('click', OnChoseFieldClick.OnChoseFieldClick)
        }
    }
    
    insertMF.showModal()
}

export async function OnSubmitInserting() {
    var inputs = document.getElementsByTagName('input')

    var newData = checkInputs(inputs)
    console.log(newData)

    if (newData == -1) {
        return;
    }

    var tableNameHTML = mainTable.getAttribute('name')
    var jsonData = JSON.stringify(newData)
    var url = '/insert/' + tableNameHTML

    await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }

            var message = "Новая запись была добавлена:\n"
            Object.entries(newData).forEach(([key, value]) => {
                message += '\n' + key + ': ' + value
            });
            alert(message)

            location.reload()
            console.log('[INFO] - ' + message)
        })
        .catch(error => {
            ErrorHandler.HandleFetchError(error)
        })
    //await Utils.insertRow(newData, mainTable.getAttribute('name'))
    //location.reload()
}

export function checkInputs(inputs) {
    var isDataFull = true
    var nullData = "Не все обязательные поля заполнены:"
    var newData = { }
    
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '' && inputs[i].getAttribute('d_nullable') == 'true') {
            continue
        } else if (inputs[i].value == '' && inputs[i].getAttribute('d_data') == undefined) {
            isDataFull = false
            nullData += '\n' + inputs[i].getAttribute('d_dbName')
            continue
        }

        if (inputs[i].getAttribute('d_value') == undefined) {
            newData[inputs[i].getAttribute('d_dbName')] = inputs[i].value;
        } else {
            newData[inputs[i].getAttribute('d_dbName')] = inputs[i].getAttribute('d_value');
        }
    }
    
    if (!isDataFull) {
        console.log("[WARN] - " + nullData)
        alert(nullData)
        return -1
    }

    return newData
}

/*
export function OnContinueBtnClick() {
    var nextMF = document.getElementById(this.getAttribute('d_nextStage'))
    var inputs = document.getElementById(this.getAttribute('d_currentStage')).getElementsByTagName('input')

    if (checkInputs(inputs) == -1) {
        return
    }
    
    nextMF.showModal()
}
*/