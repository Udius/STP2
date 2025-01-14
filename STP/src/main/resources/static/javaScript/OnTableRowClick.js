export function OnTableRowClick() {
    var tableId = this.getAttribute('d_tableId')
    var row = this;

    if (tableId == "mainTable") {
        chosenRow = this;
        OnMainTableRowClick(tableId, row)
    } else if (tableId == "choseTable") {
        var choseMF = document.getElementById('choseRowMF')
        OnRowChosen(this)
        choseMF.close()

        //console.log("[WARN] - Событие 'onTableRowClick' сработало как в 'choseTable', но не было обработано")
    } else {
        //var choseMF = document.getElementById('choseRow')
        //OnChoseFieldClick.OnRowChosen(this)
        //choseMF.close()

        console.log("[WARN] - Событие 'onTableRowClick' сработало, но не было обработано")
    }
}

function OnMainTableRowClick(tableId, row) {
    var table = document.getElementById(tableId);
    var rows = table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
        rows[i].style.backgroundColor = null;
    }
    row.style.backgroundColor = "#CCC";
}

function OnRowChosen(row) {
    var text

    text = row.cells[0].textContent
    for (let i = 1; i < row.cells.length && i < 2; i++) {
        if (row.cells[i].textContent != '') {
            text += ', \n' + row.cells[i].textContent
        }
    }

    choseFild.setAttribute('d_value', row.getAttribute('d_FKValue'))
    choseFild.textContent = text
    choseFild.setAttribute('value', text)
}