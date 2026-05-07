let parent = $("#area")[0];
let rect = parent.getBoundingClientRect();
const TM_CHANGE_COORD = 1000;
window.addEventListener('resize', resize);
let arrSq = [];

let countGen = $("#countGen")[0];
countGen.addEventListener('input', validValue);

/**
 * Проверяет на корректность вводимые данные
 * @returns {void}
 */
function validValue() {
    if (/[^0-9]/.test(countGen.value)) {
        countGen.value = "";
        alert('Введите положительное числовое значение');
    }

    if (countGen.value > 50) {
        countGen.value = "";
        alert("Значение должно быть <= 50");
    }
}

/**
 * Изменяет координаты вершин области, в которой находятся квадраты, в
 * зависимости от изменений размера окна
 * @returns {void}
 */
function resize() {
    rect = parent.getBoundingClientRect();
}

/**
 * Высчитывает случайные координты квадратика и изменяет их в определённый
 * промежуток времени
 * @param {HTMLDivElement} sq - элемент в виде квадратика
 * @returns {void}
 */
function gen(sq) {
    let minX = rect.left;
    let maxX = rect.right - sq.offsetWidth;
    let minY = rect.top;
    let maxY = rect.bottom - sq.offsetHeight;

    let x = Math.floor(Math.random() * (maxX - minX));
    let y = Math.floor(Math.random() * (maxY - minY));

    if (maxY <= (y + sq.offsetHeight)) {
        y = y - sq.offsetHeight;
    }
    if (maxX <= (x + sq.offsetWidth)) {
        x = x - sq.offsetWidth;
    }

    sq.style.left = `${x}px`;
    sq.style.top = `${y}px`;

    setTimeout(gen, TM_CHANGE_COORD, sq);
}

/**
 * Проверяет столкновения элементов между собой в реальном времени, увеличивает 
 * счётчик на 1, если элемент уничтожил другого, удаляет из массива удалённые 
 * элементы
 * @param {Array} objects - массив с квадратиками
 * @returns {void}
 */
function checkCrash(objects) {
    for (let i = objects.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            if (!(parseFloat($(objects[i].elem).css('left'))
                    >= parseFloat($(objects[j].elem).css('left')) +
                    objects[j].elem.offsetWidth ||
                    parseFloat($(objects[i].elem).css('left')) +
                    objects[i].elem.offsetWidth <=
                    parseFloat($(objects[j].elem).css('left')) ||
                    parseFloat($(objects[i].elem).css('top')) +
                    objects[i].elem.offsetHeight <=
                    parseFloat($(objects[j].elem).css('top')) ||
                    parseFloat($(objects[i].elem).css('top')) >=
                    parseFloat($(objects[j].elem).css('top')) +
                    objects[j].elem.offsetHeight)) {
                if (Math.random() > 0.5) {
                    objects[j].counterOfDestroy++;
                    objects[j].UpdateDestroy();
                    objects[i].elem.remove();
                    objects.splice(i, 1);
                } else {
                    objects[i].counterOfDestroy++;
                    objects[i].UpdateDestroy();
                    objects[j].elem.remove();
                    objects.splice(j, 1);
                }
                break;
            }
        }
    }
    requestAnimationFrame(() => checkCrash(arrSq));
}

/**
 * Генерирует и рисует квадратики в заданной области, добавляет их в массив,
 * запускает функции по проверке на столкновение и по генерации координат
 * для квадратиков
 * @returns {void}
 */
function start() {
    let countSq = $('input[name="inputField"]');
    const INF_COUNT = countSq[0].value ? countSq[0].value : 0;
    for (let i = 0; i < INF_COUNT; i++) {
        let sq = new Square(i);
        sq.changeColor();
        parent.append(sq.elem);
        sq.UpdateDestroy();
        arrSq.push(sq);
        gen(sq.elem);
    }
    checkCrash(arrSq);
}

/**
 * Класс перемещающегося квадрата
 * класса square
 * @type Square 
 */
class Square {
    counterOfDestroy = 0;
    elem = null;
    num = null;

    /**
     * Создёт объект класса Square, инициализирует поля этого класса 
     * оздаёт объект класса HTMLDivElement, добавляет ему свойства css
     * класса square
     * @param {number} i - порядковый номер объекта класса Square при создании
     * @returns {Square}
     */
    constructor(i) {
        this.elem = document.createElement('div');
        this.elem.className = 'square';
        this.num = i;
    }

    /**
     * Изменяет цвет квадрата в зависимости от его порядкового номера при
     * создании
     * @returns {void}
     */
    changeColor() {
        if (this.num % 2 === 0) {
            this.elem.style.background = 'yellow';
        } else {
            this.elem.style.background = 'red';
        }
    }

    /**
     * Обновляет счётчик уничтоженных объектов
     * @returns {void}
     */
    UpdateDestroy() {
        this.elem.textContent = this.counterOfDestroy;
    }
}
