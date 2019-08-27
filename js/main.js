const text = `Равным образом дальнейшее развитие различных форм деятельности в значительной степени обуславливает создание дальнейших направлений развитая системы массового участия? Не следует, однако, забывать о том, что начало повседневной работы по формированию позиции требует от нас системного анализа позиций, занимаемых участниками в отношении поставленных задач? Дорогие друзья, повышение уровня гражданского сознания способствует подготовке и реализации системы обучения кадров, соответствующей насущным потребностям.
Значимость этих проблем настолько очевидна, что постоянное информационно-техническое обеспечение нашей деятельности требует определения и уточнения экономической целесообразности принимаемых решений. С другой стороны новая модель организационной деятельности создаёт предпосылки качественно новых шагов для всесторонне сбалансированных нововведений. Задача организации, в особенности же повышение уровня гражданского сознания требует от нас системного анализа соответствующих условий активизации? Не следует, однако, забывать о том, что курс на социально-ориентированный национальный проект напрямую зависит от направлений прогрессивного развития?
Разнообразный и богатый опыт постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации соответствующих условий активизации!
Задача организации, в особенности же начало повседневной работы по формированию позиции обеспечивает актуальность ключевых компонентов планируемого обновления. С другой стороны курс на социально-ориентированный национальный проект представляет собой интересный эксперимент проверки ключевых компонентов планируемого обновления. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности в значительной степени обуславливает создание...`;

const inputElement = document.querySelector('#input');
const textExampleElement = document.querySelector('#textExample');

const lines = getLines(text);

let letterId = 1;

let startMoment = null;
let started = false;

let letterCounter = 0;
let letterCounter_error = 0;

init();

const isKeyPressed = event => event.key === ['Shift', '.', ',', 'Alt', 'AltGraph', 'ё', 'Ё', '\\', '\/'].includes(event.key);


function init() {
    update();

    inputElement.focus();

    inputElement.addEventListener('keydown', function (event) {
        const currentLineNumber = getCurrentLineNumber();
        const element = document.querySelector('[data-key="' + event.key + '"]');
        const currentLetter = getCurrentLetter();

        if (event.key !== 'Shift') {
            letterCounter += 1;
        }

        if (isKeyPressed(event)) {
            key = event.code;
        } else {
            key = event.key;
        }

        if (key.length < 2) {
            key = key.toLowerCase();
        }

        if (!started) {
            started = true;
            startMoment = Date.now();
        }

        if (event.key.startsWith('F') && event.key.length > 1) {
            return;
        }

        if (event.key === 'Backspace') {
            return event.preventDefault;
        }

        if (element) {
            element.classList.add('hint');
        }

        const isKey = event.key === currentLetter.original;
        const isEnter = event.key === 'Enter' && currentLetter.original === '\n';
        if (isKey || isEnter) {
            letterId += 1;
            update();
        } else {
            event.preventDefault();

            if (event.key !== 'Shift') {
                letterCounter_error = letterCounter_error + 1;

                for (const line of lines) {
                    for (const letter of line) {
                        if (letter.original === currentLetter.original) {
                            letter.success = false;
                        }
                    }
                }
                update();
            }
        }


        if (currentLineNumber !== getCurrentLineNumber()) {
            inputElement.value = '';
            event.preventDefault();

            started = false;
            const time = Date.now() - startMoment;

            document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter / time); // (time / 1000 / 60)
            document.querySelector('#error-procent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%';

            letterCounter = 0;
            letterCounter_error = 0;
        }
    });

    inputElement.addEventListener('keyup', function (event) {
        const element = document.querySelector('[data-key="' + event.key + '"]');

        if (isKeyPressed(event)) {
            key = event.code;
        } else {
            key = event.key;
        }

        if (key.length < 2) {
            key = key.toLowerCase();
        }

        if (element) {
            element.classList.remove('hint');
        }
    });
}


// getLines start принимает длинную строку, возвращает массив строк со служебной информацией
function getLines(text) {
    const lines = [];

    let line = [];
    let idCounter = 0;

    for (const originalLetter of text) {
        idCounter = idCounter + 1;

        let letter = originalLetter;

        if (letter === ' ') {
            letter = '°';
        }
        if (letter === '\n') {
            letter = '¶\\n\''
        }
        line.push({
            id: idCounter,
            label: letter,
            original: originalLetter,
            success: true
        });

        if (line.length >= 70 || letter === '¶\n') {
            lines.push(line);
            line = [];
        }
    }

    if (line.length > 0) {
        lines.push(line);
    }

    return lines;
}

// getLines end


// lineToHtml start генерируем див элемент с текстом для печати: принимает строку с объектами с информацией и возвращает html структуру
function lineToHtml(line) {
    const divElement = document.createElement('div');
    divElement.classList.add('line');

    for (const letter of line) {
        const spanElement = document.createElement('span');

        spanElement.textContent = letter.label;
        divElement.append(spanElement);

        if (letterId > letter.id) {
            spanElement.classList.add('done');
        } else if (!letter.success) {
            spanElement.classList.add('hint');
        }
    }

    return divElement;
}

// lineToHtml end


// getCurrentLineNumber Получение текущей линии, актуальная строка
function getCurrentLineNumber() {
    for (let i = 0; i < lines.length; i++) {
        for (const letter of lines[i]) {
            if (letter.id === letterId) {
                return i;
            }
        }
    }
}

// getCurrentLineNumber end


// update фунцкия удалит стандартный текст для ввода и добавит новый из переменной text, обновление 3-х отображаемых актуальных строк
function update() {
    const currentLineNumber = getCurrentLineNumber();

    textExampleElement.innerHTML = '';

    for (let i = 0; i < lines.length; i++) {
        const html = lineToHtml(lines[i]);
        textExampleElement.appendChild(html);

        if (i < currentLineNumber || i > currentLineNumber + 2) {
            html.classList.add('hidden');
        }
    }
}

// update end


// возвращает объект символа ожидаемый программой
function getCurrentLetter() {
    for (const line of lines) {
        for (const letter of line) {
            if (letterId === letter.id) {
                return letter
            }
        }
    }
}