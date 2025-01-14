import * as Utils from './Utils.js'

var choseTableHTML = '<table border="1" class="table" id="choseTable">\n' + 
                        '<!-- Таблица полностью заполняется автоматически-->\n' + 
                        '<thead>\n' + 
                            '<tr class="attributes"></tr>\n' + 
                        '</thead>\n' + 
                        '<tbody></tbody>\n' + 
                    '</table>'

export function OnChoseInputClick() {
    var choseMF = document.getElementById('choseRowMF')
    choseFild = this

    ClearChoseMF()
    FillChoseMF(this.getAttribute('d_extandBy'))

    choseMF.showModal()
}

function ClearChoseMF() {
    var choseTable = document.getElementById('choseTable')
    choseTable.innerHTML = choseTableHTML
}

function FillChoseMF(extandBy) {
    var choseTable = document.getElementById('choseTable')
    var headers = choseTable.getElementsByTagName('tr')[0]
    var header

    if (extandBy == 'reader') {
        choseTable.setAttribute('d_PKName', 'id')

        header = document.createElement('th')
        header.setAttribute('name', 'name')
        header.textContent = 'Имя читателя'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'phone')
        header.textContent = 'Номер Телефона'
        headers.appendChild(header)
    } else if (extandBy == 'book') {
        choseTable.setAttribute('d_PKName', 'isbn')

        header = document.createElement('th')
        header.setAttribute('name', 'isbn')
        header.textContent = 'Номер книги'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'title')
        header.textContent = 'Название'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'author_l_name')
        header.textContent = 'Фамилия автора'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'author_f_name')
        header.textContent = 'Имя автора'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'author_p_name')
        header.textContent = 'Отчество автора'
        headers.appendChild(header)

        header = document.createElement('th')
        header.setAttribute('name', 'year')
        header.textContent = 'Год издания'
        headers.appendChild(header)
    }

    Utils.FillTable(choseTable, extandBy)
}