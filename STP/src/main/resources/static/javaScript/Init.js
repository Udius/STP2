import * as OnButtonClickEvents from './OnButtonClickEvents.js'
import * as OnChoseInputClick from './OnChoseInputClick.js'
import * as Utils from './Utils.js'

document.addEventListener('DOMContentLoaded', Init)
var mainTable = document.getElementById('mainTable')

function Init() {
    if (mainTable != undefined) {
        Utils.FillTable(mainTable)
        InitButtons()
        InitChoseInputs()
    }
    else {
    }
}

function InitButtons() {
    var tableName = mainTable.getAttribute('name')

    var deleteBtn = document.getElementById('deleteBtn')
    var updateBtn = document.getElementById('updateBtn')
    var insertBtn = document.getElementById('insertBtn')
    var submitDeleteBtn = document.getElementById('submitDeleting').getElementsByTagName('button')[0]
    var submitUpdateBtn = document.getElementById('updateRow').getElementsByTagName('button')[0]
    var submitInsertBtn = document.getElementById('insertRow').getElementsByTagName('button')[0]
    //var cancelInsertBtn = document.getElementById('insertRow').getElementsByTagName('button')[1]

    if (deleteBtn != undefined) {
        deleteBtn.addEventListener('click', OnButtonClickEvents.OnDeleteBtnClick)
        submitDeleteBtn.addEventListener('click', OnButtonClickEvents.OnSubmitDeleting)
    }
    if (updateBtn != undefined) {
        updateBtn.addEventListener('click', OnButtonClickEvents.OnUpdateBtnClick)
        submitUpdateBtn.addEventListener('click', OnButtonClickEvents.OnSubmitUpdating)
        InitUpdateForm()
    }
    if (insertBtn != undefined) {
        insertBtn.addEventListener('click', OnButtonClickEvents.OnInsertBtnClick)
        submitInsertBtn.addEventListener('click', OnButtonClickEvents.OnSubmitInserting)
    }
}

function InitChoseInputs() {
    var modalInsert = document.getElementById('insertRow')
    // Добавить modalUpdate

    var insertInputs = modalInsert.getElementsByTagName('input')
    for (let i = 0; i < insertInputs.length; i++) {
        if (insertInputs[i].getAttribute('readonly') != undefined) {
            insertInputs[i].addEventListener('click', OnChoseInputClick.OnChoseInputClick)
        }
    }
}

function InitUpdateForm() {
    var newTbody = document.createElement('tbody')
    var mainTableThead = mainTable.getElementsByTagName('thead')[0].cloneNode(true)
    var updateTable = document.getElementById('updateTable')
    var updateTableHeaders = updateTable.getElementsByTagName('th')

    updateTable.appendChild(newTbody)
    updateTable.appendChild(mainTableThead)

    for (let i = 0; i < updateTableHeaders.length; i++) {
        if (updateTableHeaders[i].getAttribute('d_inUpdateTime') == "hidden") {
            updateTableHeaders[i].style.display = 'none'
        }
    }
}