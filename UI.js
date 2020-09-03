import {
    getAnswerInfo,
    compareSpecialChars,
    checkWordIsAnAnser,
    getAnswerId,
    isPlayableTrivia
    
} from './main.js';

// ===== elementos globais da UI ==================== 

// elementos usados no loader exibido antes de baixar as respostas
const waitingDataDiv = document.createElement('div');
const loader = document.createElement('div');

// exibe dados sobre as respostas ao passar mouse sobre elas
const answerInfoSpan = document.createElement('span');

// span utilizada para exibir dados digitados no input de resposta 
const typingInfoSpan = document.createElement('span');

// input de respostas
const formInput = document.getElementById('resposta');

// configura e exibe o loader
function setUpLoader() {
    formInput.disabled = true;
    loader.setAttribute('class', 'loader');
    waitingDataDiv.setAttribute('id', 'waiting-data-div');
    waitingDataDiv.appendChild(loader);
    document.body.appendChild(waitingDataDiv);

    
}

// usada para remover o loader e a div modal
export default function disableWaiting() {
    waitingDataDiv.style.display = 'none';
    formInput.disabled = false;
}

// configura e exibe as spans de informações 
function setUpInfoSpans() {
    answerInfoSpan.innerText = '';
    answerInfoSpan.setAttribute('id', 'answer-info-span');
    document.body.appendChild(answerInfoSpan);

    typingInfoSpan.setAttribute('id', 'typing-info-span');
    typingInfoSpan.style.display = 'none';

    // localiza a div que contem o input e adiciona a span antes dele
    const typingInfoDiv = document.getElementById('respostas').firstElementChild;
    typingInfoDiv.insertBefore(typingInfoSpan, typingInfoDiv.childNodes[0]);
}

setUpLoader();
setUpInfoSpans();

// == Variáveis globais de digitação ============================

// armazena o ultimo valor digitado no input (o jogo limpa abruptamente o input ao acertar)
let lastTypedValue = '';

// inicial dos elementos de mesma letra selecionados
let markedLetter = '';

// alterna a exibição da span 
function displayAnswersInfoSpan(answerOwnerElement) {
    if (answerInfoSpan.style.display !== 'block') {
        answerInfoSpan.style.display = 'block';

        // obtém o ID da resposta de acordo ao id da célula na página
        const ID = answerOwnerElement.firstElementChild.getAttribute('id').replace('resposta-', '');

        try {
            const info = getAnswerInfo(ID);
            if (info.wordCount == 1)
                answerInfoSpan.innerText = info.words[0].length + ' letras';
            else {
                answerInfoSpan.innerText = `resposta composta\n${info.wordCount} palavras\n`;
                let wordsLengthStr = '';
                info.words.forEach((word) => wordsLengthStr += word.length + ' ');
                wordsLengthStr += 'letras';
                answerInfoSpan.innerText += wordsLengthStr;
            }
        } catch (err) {
            answerInfoSpan.innerText = 'erro ao calcular valor da resposta\n' + err.message;

        }


    } else setTimeout(hideAnswersInfoSpan, 500);

};

function hideAnswersInfoSpan() {
    answerInfoSpan.style.display = 'none';
}

// obtém uma referência à lista de celulas de respostas ocultas
function getAnswersElementsList() {
    let tdList = document.getElementsByTagName('td');
    let answersElements = [];

    if (tdList.length != 0) {
        for (let td of tdList) {
            if (td.childElementCount != 0 && td.firstElementChild.toString().toLowerCase().includes('span'))
                answersElements.push(td);
        }
    }

    return answersElements;
}

function addMouseEvents() {
    // eventos mouse sobre as respostas
    getAnswersElementsList().forEach((el) => {
        el.parentElement.addEventListener('mouseover', () => {
            displayAnswersInfoSpan(el);
        });
        el.parentElement.addEventListener('mouseout', () => hideAnswersInfoSpan(el));
    });
}

addMouseEvents();

// chamada no keyup do formInput para exibir dados da palavra digitada
function displayTypingWordsInfo() {
    // deixa visível a span
    typingInfoSpan.style.display = 'block';

    // obtém  as palavras digitadas sozinhas ou separadas por espaço
    let typed = formInput.value.trim();
    let spaceSplittedTyped = typed.split(' ');

    // limpa o texto presente na span pra receber o novo
    typingInfoSpan.innerText = '';

    if (typed.length == 0)
        return;

    /*	caso valor digitado contenha mais de uma palavra,
		exibe o total de palavras e o tamanho de cada uma, separada por espaço
     */
    if (spaceSplittedTyped.length > 1) {

        typingInfoSpan.innerText += spaceSplittedTyped.length + ' palavras - ';
        for (let i = 0; i < spaceSplittedTyped.length; i++) {
            let currentWordLen = spaceSplittedTyped[i].length;
            if (currentWordLen > 0)
                typingInfoSpan.innerText += ' ' + currentWordLen + ' ';
        }
        typingInfoSpan.innerText += ' letras';
    } else typingInfoSpan.innerText = typed.length + ' letras';
}

function addTypingEvents() {
    formInput.addEventListener('keyup', ({
        target
    }) => {
        displayTypingWordsInfo();
        forceLowerCaseInput();
        changeInputColorWhenAnswered(target.value);
        lastTypedValue = target.value.trim() == '' ? lastTypedValue : target.value.trim();
        controlElementsMarking(target.value)
        scrollToElementOnAnswer(lastTypedValue);
    });
}

addTypingEvents();

function forceLowerCaseInput() {
    formInput.value = formInput.value.toLowerCase();
}

// verifica se a resposta sendo digitada já está respondida
function checkWordIsAnswered(word) {
    const answers = getAnsweredList();
    let answered = false;
    if (answers)
        answers.forEach((answer) => {
            if (compareSpecialChars(answer, word))
                answered = true;
        });
    return answered;
}

// usada no keyup do formInput pra alterar sua cor quando já respondida
function changeInputColorWhenAnswered(word) {
    if (checkWordIsAnswered(word))
        setInputColor('red');
    else setInputColor('initial');

}

function setInputColor(color) {
    formInput.style.borderColor = color;
    formInput.style.color = color;
}


// retorna um array com as respostas atuais obtidas dos elementos
// marcados com a classe 'resposta'
function getAnsweredList() {
    let list = [];
    let elements = [...document.getElementsByClassName('resposta')];

    if (elements.length > 0)
        elements.forEach((el) => list.push(el.innerText));
    else return null;

    return list;
}

function getElementsStartingWith(letter) {
    const elements = getAnswersElementsList().filter((element) => {
        return element.firstChild.innerText.startsWith(letter);
    });

    return elements;
}

function markElementsStartingWith(letter) {
    const elements = getElementsStartingWith(letter);
    elements.forEach((element) => element.classList.add('marked'));
}

function unmarkElementsStartingWith(letter) {
    const elements = getElementsStartingWith(letter);
    elements.forEach((element) => element.classList.remove('marked'));
}



function controlElementsMarking(inputValue) {

    if (checkWordIsAnAnser(lastTypedValue) || inputValue.length == 0) {
        unmarkElementsStartingWith(markedLetter);
        markedLetter = '';
        return

        /* 
            se o valor digitado for uma resposta válida
            ou o campo estiver em branco, devido ao apagamento
            automártico do racha cuca, desmarca a seleção
        */
    }
    if (inputValue.length != 0 && markedLetter != inputValue[0]) {
        unmarkElementsStartingWith(markedLetter);
        markElementsStartingWith(inputValue[0]);
        markedLetter = inputValue[0];

        /* 
            marca a seleção se o input estiver preenchido e
            e for uma palavra com letra diferente de uma já selecionada
        */
    }

}

// chamada no keyup pra scrollar até a resposta inserida
// todo: melhorar o scroll, nem sempre pega o elemento bem
function scrollToElementOnAnswer(answer) {
    let id = getAnswerId(answer);

    if (id) {
        let td = document.getElementById('resposta-' + id).parentElement;
        td.scrollIntoView({
            block: 'center'
        });
        console.log('scrolled to', td);
    }
}

console.log('UI CARREGADADA', getElementsStartingWith('c'));