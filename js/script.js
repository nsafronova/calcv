'use strict';

const title = document.getElementsByTagName('h1')[0];
const plusButton = document.querySelector('.screen-btn');
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');

const inputRange = document.querySelector('.rollback input');
const inputRangeValue = document.querySelector('.rollback .range-value');

const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];

let screens = document.querySelectorAll('.screen');

const appData = {
  title: '',
  screens: [],
  screenPrice: 0,
  adaptive: true,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  servicesPercent: {},
  servicesNumber: {},
  rollback: 0,
  count: 0,
  init: function () {
    this.checkValue();
    startBtn.addEventListener('click', this.start.bind(appData));
    plusButton.addEventListener('click', this.addScreenBlock.bind(appData));
    inputRange.addEventListener('input', this.getRollback.bind(appData));
    inputRange.addEventListener('input', this.showResult.bind(appData));
    resetBtn.addEventListener('click', this.reset.bind(appData));
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  checkValue: function () {
    screens = document.querySelectorAll('.screen'); //получаем список элементов
    startBtn.disabled = false; //Разблокируем кнопку


    screens.forEach((item) => {
      const select = item.querySelector('select');
      const input = item.querySelector('input');
      select.addEventListener('input', this.checkValue); //Вешаем слушатель на каждое поле
      input.addEventListener('input', this.checkValue);

      if (select.value == '' || input.value == '') { //Проверяем поля.
        startBtn.disabled = true; //Если хотя бы одна пара не прошла - блокируем кнопку
      }
    });
  },

  start: function () {
    this.addScreens();
    this.addServices();
    this.addPrices();
    this.logger();
    this.showResult();
    this.blockInputValue();

  },
  showResult: function () {
    total.value = this.screenPrice;
    totalCount.value = this.count;
    totalCountOther.value = this.servicePricesPercent + this.servicePricesNumber;
    fullTotalCount.value = this.fullPrice;
    totalCountRollback.value = this.servicePercentPrice;

  },
  addScreens: function () {
    screens = document.querySelectorAll('.screen');
    screens.forEach((screen, index) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const selectName = select.options[select.selectedIndex].textContent;

      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value
      });
      this.count += +input.value;
    });
    console.log(this.screens);
  },

  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);
    screens[screens.length - 1].after(cloneScreen);
    this.checkValue();
  },

  addServices: function () {
    otherItemsPercent.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  getRollback: function (event) {

    this.rollback = inputRange.value;
    inputRangeValue.textContent = event.target.value + '%';
    this.addPrices();

  },

  addPrices: function () {

    this.screenPrice = this.screens.reduce((sum, item) => {
      return sum + item.price;
    }, 0);

    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100);
    }

    this.fullPrice = this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;
    this.servicePercentPrice = this.fullPrice - (this.fullPrice * (this.rollback / 100));
  },

  blockInputValue: function () {

    screens.forEach((item) => {
      const select = item.querySelector('select');
      const input = item.querySelector('input');
      select.disabled = true;
      input.disabled = true;
      plusButton.disabled = true;
      startBtn.style.display = 'none';
      resetBtn.style.display = 'flex';

    });

  },

  unlockInputValue: function () {
    screens.forEach((item) => {
      const select = item.querySelector('select');
      const input = item.querySelector('input');
      select.disabled = false;
      input.disabled = false;
      plusButton.disabled = false;
      startBtn.style.display = 'flex';
      resetBtn.style.display = 'none';

      select.value = '';
      input.value = '';

    });
  },

  deleteScreens: function () {
    this.screens = [];

    for (let i = 0; i < screens.length - 1; i++) {
      document.querySelector('.screen').remove();
    }
    console.log(screens);
  },

  deleteServices: function () {

    otherItemsPercent.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        this.servicesPercent[label.textContent] = 0;
        check.checked = false;
      }
    });

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        this.servicesNumber[label.textContent] = 0;
        check.checked = false;
      }
    });
  },

  deleteRollback: function () {
    this.rollback = 0;
    inputRangeValue.textContent = 0 + '%';
  },

  reset: function () {
    this.deleteScreens();
    this.deleteServices();
    this.deleteRollback();
    this.screenPrice = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.rollback = 0;
    this.count = 0;
    this.showResult();
    this.unlockInputValue();

    this.addScreens();
    this.addServices();
    this.addPrices();
    this.showResult();
  },

  logger: function () {
    console.log(this.fullPrice);
    console.log(this.servicePercentPrice);
    console.log(this.screens);
  },
};

appData.init();


//мусорный блок
// let key = 'city';
// let city = 'Amsterdam';

// let person = {
//   key: city,
//   name: 'Alex',
//   age: 33,
//   job: {
//     position: 'middle-developer',
//     salary: '1.000.000',
//     workplace: 'Netherlands'
//   },
//   say: (str) => {
//     console.log(str);
//   }
// };

// person.say('Hello world');

// console.log(person);

// let array = ['Apple', 'Orange', 'Banana'];

// array.push('Kiwi'); //добавляет в самый конец
// array.unshift('Papaya', 'Mango'); //добавляет в самое начало
//просто меняют исходный массив


// array.pop(); //удаляет с конца
// array.shift(); //удаляет с начала
//просто меняют исходный массив и возвращают элемент, который забирают

// array.sort() //по алфавиту 
// array.reverse() //разворачивает массив

// array.join(\n) // превращает массив в строку, в сколбках можно указать, чем элементы будут разделены
//только возвращают

// for ()

// const obj = {
//   name: 'Alex',
//   age: 33,
//   isStudent: false,
// }

// for (let key in obj) {
//   console.log('Ключ: ' + key + ' ' + 'Значение:' + obj[key])
// }