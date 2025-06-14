let date = new Date();                    // текущая дата 2025.1.1
const fy = (d = date) => d.getFullYear(); // получение текущего года
const gm = (d = date) => d.getMonth();    // получение месяца
let currentDate = structuredClone(date);  // new Date(); // точный клон "объекта" текущей даты
let currentYear = fy(currentDate);        // текущий год числом

let dayName = document.querySelector('.ui-datepicker-material-day'); // для дня недели словом
dayName.textContent = new Date().toLocaleString('default', { weekday: 'long' }); // день недели словом (две буквы), взято отсюда -  https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format

let dayNum = document.querySelector('.ui-datepicker-material-day-num'); // для текущего дня числом
dayNum.textContent = currentDate.getDate(); // текущий день числом

let monthNameArr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
let monthName = document.querySelector('.ui-datepicker-material-month'); // для текущего месяца словом сверху
monthName.textContent = monthNameArr[gm(currentDate)]; // текущий месяц словом
/* ещё один вариант преобразования имени месяца, без массива нужных имён, но только на рус.яз.
let monthNum = currentDate.getMonth();
let monthNam = currentDate.toLocaleString('default', { month: 'long' });
if(monthNum === 2 || monthNum === 7) {
  monthNam += 'а';
} else {
  monthNam = monthNam.substr(0, monthNam.length - 1) + 'я';
}
*/
let monthNameToo = document.querySelector('.ui-datepicker-month'); // для текущего месяца словом по центру
monthNameToo.textContent = currentDate.toLocaleString('default', { month: 'long' }); // месяц словом на рус.яз (а может не только на нём)

let yearNum = document.querySelector('.ui-datepicker-material-year'); // для текущего года числом сверху
yearNum.textContent = currentYear;
let yearNumToo = document.querySelector('.ui-datepicker-year'); // для текущего года числом по центру
yearNumToo.textContent = currentYear;
  
let tableBody = document.querySelector('tbody'); // тело таблицы дней месяца c числами

let header = document.querySelector('.ui-datepicker-material-day');
let view = true; // для показа/скрытия букв смен дня
header.onclick = e => {
    view = !view;
    date = new Date(fy(), gm() - 1, 15);
    table(2);
}
/* очистка букв смен, при отключении, и классов к ним без перерисовки таблицы, но пустое слово class всё равно остаётся
header.onclick = e => {
    if (view) {
      tableBody.querySelectorAll('.symbolDay').forEach(el => el.remove());
      tableBody.querySelectorAll('.night').forEach(el => el.classList.remove('night'));
      tableBody.querySelectorAll('.rel').forEach(el => el.classList.remove('rel'));
    } else {
      date = new Date(fy(), gm() - 1, 15);
      table(2);
    }
    view = !view;
}*/

  let day = 'day' in localStorage ? +localStorage.getItem('day') : 1; // смена по умолчанию Г
  //let fd = new Date(2024,6,7) // первая рабочая дневная смена А
  //let fd = new Date(2024,6,3) // первая рабочая дневная смена Б
  //let fd = new Date(2024,6,5) // первая рабочая дневная смена В
  //let fd = new Date(2024,6,1) // первая рабочая дневная смена Г
  let fd = new Date(2024,6,day);
  document.getElementById(day).classList.add('active');

function table(m = 0) {
  tableBody.innerHTML = '';
  const createEl = (td, s) => {
    td.classList.add('rel'); // класс с позишн релэйтив
    let symbolDay = document.createElement('span'); // для символа дня (дневная, ночная, для выходного символа нет)
    symbolDay.textContent = s; // первая или вторая дневная рабочая смена
    symbolDay.classList.add('symbolDay');

    td.append(symbolDay);
  }

  let countDaysPrevMonth = new Date(fy(), gm(), 1).getDay() % 7 - 1;

  let countDaysNextMonth = 7 - new Date(fy(), gm() + 1, 0).getDay();

  let dayOfWeak = new Date(fy(), gm(), 1).getDay(); // день недели первого числа текущего месяца
  
  let lastDayOfWeak = new Date(fy(), gm() + 1, 0).getDay(); // день недели последнего числа месяца
  
  if (dayOfWeak !== 1) {
    date = new Date(fy(), gm(), -dayOfWeak + (dayOfWeak === 0 ? -5 : 2)) // первый понедельник первой недели месяца, т.е. если месяц начался не с понедельника, то с понедельника первой недели будут идти дни предыдущего месяца
  } else if (dayOfWeak === 1) {
    m = 1
  }

  let stepFor = Math.ceil(
    ((countDaysPrevMonth === -1 ? 6 : countDaysPrevMonth) +
    new Date(fy(), gm() + m, 0).getDate() +
    (countDaysNextMonth === 7 ? 0 : countDaysNextMonth)) / 7
  );

  for(let i = 1; i <= stepFor; i++) { // цикл создания недель
    let tr = document.createElement('tr');
    for(let j = 0; j <= 6; j++) { // цикл заполнение недели днями
      let td = document.createElement('td'); // создаём элемент таблицы для дня недели
      td.textContent = date.getDate(); // просто число дня недели
      if (gm() !== gm(currentDate) || fy() !== fy(currentDate)) {// если день прошлого/следующего месяца, то добавить класс ui-datepicker-other-month
        td.classList.add('ui-datepicker-other-month');
      }
      if ((gm() === gm(currentDate) && date.getDate() === currentDate.getDate()) && fy() === fy(currentDate)) { // если месяц равен текущему месяцу и день равен текущему дню, то
        td.classList.add('ui-datepicker-today'); // добавление класса для выделения текущего дня
      }

      if(view) {
        let diffDay = Math.floor((date - fd) / 24 / 60 / 60 / 1000) // разница дней
        let shiftInDay = diffDay % 8;
        
        if (shiftInDay === 0 || shiftInDay === 1) {
          createEl(td, 'д'); // первая или вторая дневная рабочая смена
        } else if (shiftInDay === 4 || shiftInDay === 5) {
          td.classList.add('night');   // подчёркивание цифры дня, ночной смены
          // если первая ночная в воскресенье, то добавить полоску на "вечер"
          if (shiftInDay === 4 && date.getDay() == 0) {
            td.classList.add('e');
          }
          createEl(td, 'н'); // первая или вторая ночная рабочая смена
        } else if (shiftInDay === 3 && date.getDay() == 0) {
          td.classList.add('rel', 'e'); // если первая ночная в понедельник, то добавить полоску на "вечер" предшествующего воскресенья
        }
      }

      date = new Date(date.setDate(date.getDate() + 1)); // увеличение даты на один день
      tr.append(td); // добавление дня недели, как ячейки очередной строки
    }
    tableBody.append(tr); // добавление сформированной недели в тело таблицы, в конец
  }
}

table();

const changeData = () => {
  tableBody.innerHTML = '';
  yearNumToo.textContent = fy();
  currentYear = fy();
  monthNameToo.textContent = date.toLocaleString('default', { month: 'long' });
  table(2);
}

document.querySelector('.arrow-left').addEventListener('click', () => {
  date = new Date(fy(), gm() - 2, 1); // уменьшение месяца на 1 от текущего отображаемого (при загрузке страницы), т.е. переход на предыдущий месяц, -2 - т.к. при создании таблицы дата переходит на следующий месяц
  changeData();
})

document.querySelector('.arrow-right').addEventListener('click', changeData);

// выбор/установка буквы смены
let letterWorkShift = document.querySelector('.workShift'); // 
letterWorkShift.addEventListener('click', e => {
  if (!e.target.classList.contains('active')) {
    letterWorkShift.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    localStorage.setItem('day', e.target.id);
    day = +localStorage.getItem('day');
    fd = new Date(2024,6,day);
    date = new Date(fy(), gm() - 1, 15);
    table(-2);
  }
});
