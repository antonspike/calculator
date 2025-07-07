let a = ''; // первое число
let b = ''; // второе число
let result = '';
let operation = ''; // действие
let finish = false; // флаг на завершенное вычисление
let history = [];
let historyItem = '';
const historyList = document.querySelector('.log-list');

function displayHistory() {
    historyList.innerHTML = ''; 
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Загрузка истории после объявления функций и переменных
if (localStorage.getItem('calculatorHistory')) {
    history = JSON.parse(localStorage.getItem('calculatorHistory'));
    displayHistory(); // Вызов displayHistory после загрузки истории
}


const digit = ['0','1','2','3','4','5','6','7','8','9','.']; // цифры и точка
const action = ['-','+','×','÷','^']; // операции

const out = document.querySelector('.calc-screen p');

function Clear () { // функция очистки
    a = '';
    b = '';
    operation = '';
    finish = false;
    out.textContent = '0';
}

document.querySelector('.c').onclick = Clear;

document.querySelector('.buttons').onclick = (even) => {
    if (!even.target.classList.contains('btn')) return; // нажата не кнопка
    if (even.target.classList.contains('C')) return; // нажата кнопка Clear

    const key = even.target.textContent;

    if (digit.includes(key)) { // если часть числа
        if (b === '' && operation === '') { // если второе число и операция пустые, то записываем первое число
            a += key;
            a = trimString(removeLeadingZeros(a));
            out.textContent = a;
        }
        else if (a !== '' && b !== '' && finish) { // если было произведено вычисление и нажата цифра или точка, тогда начинаем записывать второе число
            b = key;
            finish = false;
            out.textContent = b;
        }
        else { // иначе записываем второе число
            b += key;
            b = trimString(removeLeadingZeros(b));
            out.textContent = b;
        }
        return;
    }
    if (action.includes(key) && a !== '') { // если операция
        operation = key;
        out.textContent = operation;
        return;
    }
    if (key === '=') { // если равно
        if (b === '') b = a;
        switch (operation) {
            case "+":
                result = (+a) + (+b); // результат вычисления записываем в первое число, чтобы потом была возможность продолжить вычисления с получившимся ответом
                finish = true; // вычисление завершено
                break;
            case "-":
                result = a - b;
                finish = true; // вычисление завершено
                break;
            case "×":
                result = a * b;
                finish = true; // вычисление завершено
                break;
            case "÷":
                if (b === '0') { // обработка деления на ноль
                    out.textContent = 'ERROR';
                    a = '';
                    b = '';
                    operation = '';
                    return;
                }
                result = a / b;
                finish = true; // вычисление завершено
                break;
            case "^":
                result = Math.pow(a , b);
                finish = true; // вычисление завершено
                break;
        }
        if (finish) {
            result = removeTrailingZeros(trimString(result.toString()));
            historyItem = `${a} ${operation} ${b} = ${result}`;
            addToHistory(historyItem);

            a = result;
            out.textContent = a;
        }
        return;
    }
    if (key === '%') { // вычисление процента
        if (b === '') b = a;
        switch (operation) {
            case "+":
                result = (+a) + (+(a * b / 100));
                finish = true; // вычисление завершено
                break;
            case "-":
                result = a - a * b /100;
                finish = true; // вычисление завершено
                break;
            case "×":
                result = a * b / 100;
                finish = true; // вычисление завершено
                break;
            case "÷":
                if (b === '0') {
                    out.textContent = 'ERROR';
                    a = '';
                    b = '';
                    operation = '';
                    return;
                }
                result = a / (b / 100);
                finish = true; // вычисление завершено
                break;
        }
        if (finish) {
            result = removeTrailingZeros(trimString(result.toString()));
            historyItem = `${a} ${operation} ${b}% = ${result}`;
            addToHistory(historyItem);

            a = result;
            out.textContent = a;
        }
        return;
    }
    if (key === '√') { // квадратный корень
        if (b !== '') {  // если сейчас на экране втрое число, то корень из него
            a = Math.sqrt(b);
            a = removeTrailingZeros(trimString(a.toString()));
            historyItem = `√${b} = ${a}`;
            addToHistory(historyItem);
            b = '';
        }
        else if (a !== '') {
            result = Math.sqrt(a);
            result = removeTrailingZeros(trimString(result.toString()));
            historyItem = `√${a} = ${result}`;
            addToHistory(historyItem);
            a = result;
        }
        else return;
        finish = true;
        out.textContent = a;
        return;
    }
}

function removeTrailingZeros(str) {  // функция удаления нулей в конце дробной части
    if (str.includes('.')) {
        let parts = str.split('.');
        let integerPart = parts[0];
        let fractionalPart = parts[1];

        while (fractionalPart.endsWith('0')) {
            fractionalPart = fractionalPart.slice(0, -1);
        }

        if (fractionalPart === '') {
            return integerPart;
        } else {
            return integerPart + '.' + fractionalPart;
        }
    }
    return str;
}

function trimString(str) { // максимальный размер числа 9 символов
    if (str.length > 9)
        return str.slice(0, 9);
    return str;
}

function removeLeadingZeros(str) { // функция удаления лишних нулей в начале числа
    if (str === '0') return str; // Если только ноль, возвращаем его
    if (str.startsWith('0.') ) return str; // если ноль и сразу точка - не удаляем ноль
    return str.replace(/^0+(\d+(\.\d+)?|\.\d+)$/, '$1');
}

function addToHistory(item) {
    history.push(item);
    if (history.length > 100) {
        history.shift(); // Удаляем самый старый элемент
    }
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    displayHistory();
}