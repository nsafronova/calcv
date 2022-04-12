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
    startBtn.addEventListener('click', appData.start)
    plusButton.addEventListener('click', appData.addScreenBlock);
    inputRange.addEventListener('input', appData.getRollback);
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  start: () => {
    appData.addScreens();
    appData.addServices();
    appData.addPrices();
    // appData.logger();
    appData.showResult();
    console.log(appData);
  },
  showResult: () => {
    total.value = appData.screenPrice;
    totalCount.value = appData.count;
    totalCountOther.value = appData.servicePricesPercent + appData.servicePricesNumber;
    fullTotalCount.value = appData.fullPrice;
    totalCountRollback.value = appData.servicePercentPrice;

  },
  addScreens: () => {
    screens = document.querySelectorAll('.screen');
    screens.forEach(function (screen, index) {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const selectName = select.options[select.selectedIndex].textContent;

      appData.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value
      });
      appData.count += +input.value;
    })
    console.log(appData.screens);
  },

  addScreenBlock: () => {
    const cloneScreen = screens[0].cloneNode(true);
    screens[screens.length - 1].after(cloneScreen);
    console.log(cloneScreen);
  },

  addServices: () => {
    otherItemsPercent.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      }
    })

    otherItemsNumber.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    })
  },

  getRollback: (event) => {
    appData.rollback = inputRange.value;
    inputRangeValue.textContent = event.target.value + '%'
  },

  addPrices: () => {
    appData.screenPrice = appData.screens.reduce(function (sum, item) {
      return sum + item.price
    }, 0);

    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
    }

    appData.fullPrice = appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber;
    appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
  },

  logger: () => {
    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
    console.log(appData.services);
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