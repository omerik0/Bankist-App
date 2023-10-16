'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Omer maimon',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: `2208`,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-10-14T00:00:00.929Z',
    '2023-10-15T00:00:00.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Nohar gibli',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: `0908`,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const setTimeLogOut = function () {
  let time = 5 * 60;
  const tick = function () {
    labelTimer.textContent = `${String(Math.trunc(time / 60)).padStart(
      2,
      0
    )}:${String(time % 60).padStart(2, 0)}`;
    if (time <= 0) {
      clearInterval(a);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `log in to get start`;
    }
    time--;
  };

  tick();
  const startTimer = setInterval(tick, 1000);
  return startTimer;
};

const unicCur = function (locale, num, cur) {
  const options = {
    style: 'currency',
    currency: `${cur}`,
  };
  return new Intl.NumberFormat(locale, options).format(num);
};
const unicTime = function (acc, date = now) {
  const timePass = calcDays(now, date);
  if (timePass < 1) {
    return `Today`;
  }
  if (timePass === 1) {
    return `Yesterday`;
  }
  if (timePass <= 7) {
    return `${timePass} days ago`;
  }
  return new Intl.DateTimeFormat(acc.locale, setDate).format(date);
};

const displayMovements = function (acc, sort) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = unicTime(currentUser, date);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${unicCur(
      acc.locale,
      mov,
      acc.currency
    )}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0).toFixed(2);

  labelBalance.textContent = `${unicCur(
    acc.locale,
    acc.balance,
    acc.currency
  )}`;
};

const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);
  labelSumIn.textContent = unicCur(acc.locale, incomes, acc.currency);
  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  ).toFixed(2);
  labelSumOut.textContent = unicCur(acc.locale, out, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int)
    .toFixed(2);
  labelSumInterest.textContent = unicCur(acc.locale, interest, acc.currency);
};

const createUserNames = accounts.forEach(acc => {
  acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
});

const updateUI = function (acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};
const calcDays = function (day1, day2) {
  const dayPassed = Math.floor(
    Math.abs((new Date(day2) - new Date(day1)) / (1000 * 60 * 60 * 24))
  );

  return dayPassed;
};
let now = new Date();
const setDate = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const todayDate = function (acc) {
  const today = new Intl.DateTimeFormat(acc.locale, setDate).format(now);
  labelDate.textContent = today;
};

let currentUser;
let startTimer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentUser.pin === inputLoginPin.value) {
    containerApp.style.opacity = '1';
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `welcome back ${
      currentUser.owner.split(' ')[0]
    }`;
    updateUI(currentUser);
    unicTime(currentUser);
    todayDate(currentUser);
    // if (startTimer) {
    //   clearInterval(startTimer);
    // }
    // startTimer = setTimeLogOut();
    clearInterval(startTimer);
    startTimer = setTimeLogOut();
  }
});

let reciverAcc;
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value;
  if (
    amount > 0 &&
    reciverAcc &&
    currentUser.balance >= amount &&
    currentUser.username !== reciverAcc.username
  ) {
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());

    reciverAcc.movements.push(amount);
    reciverAcc.movementsDates.push(new Date().toISOString());

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    updateUI(currentUser);
    clearInterval(startTimer);
    startTimer = setTimeLogOut();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;
  if (currentUser.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentUser.movements.push(amount);
      updateUI(currentUser);
    }, 2000);
    currentUser.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    clearInterval(startTimer);
    startTimer = setTimeLogOut();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    inputClosePin.value === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started...';
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;

  displayMovements(currentUser, sorted);

  console.log(sorted);
});

// const a = setInterval(function () {
//   const now = new Date();
//   const clockFormat = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };
//   const clock = new Intl.DateTimeFormat('he-IL', clockFormat).format(now);
//   console.log(clock);
// }, 1000);
// clearInterval(a);
