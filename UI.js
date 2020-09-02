import {
    getAnswerInfo,
    compareSpecialChars,
    checkWordIsAnAnser
} from './main.js';

// adiciona um loader e uma div antes do carregamento das respostas
const loader = document.createElement('div');
loader.setAttribute('class', 'loader');

const waitingDataDiv = document.createElement('div');
waitingDataDiv.setAttribute('id', 'waiting-data-div');
waitingDataDiv.appendChild(loader);

document.body.appendChild(waitingDataDiv);


// span utilizada para mostrar dados da resposta oculta (tamanho etc)
// ao passar mouse sobre elas

const answerInfoSpan = document.createElement('span');
answerInfoSpan.innerText = 'TESTE';
answerInfoSpan.setAttribute('id', 'answer-info-span');

document.body.appendChild(answerInfoSpan);


let answerInfoOnScreen = false;

// alterna a exibição da span 
function displayAnswersInfoSpan(answerOwnerElement) {
    if (!answerInfoOnScreen) {
        answerInfoSpan.style.display = 'block';
        answerInfoOnScreen = true;

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
    answerInfoOnScreen = false;
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

// eventos mouse sobre as respostas
getAnswersElementsList().forEach((el) => {
    el.parentElement.addEventListener('mouseover', () => {
        displayAnswersInfoSpan(el);
    });
    el.parentElement.addEventListener('mouseout', () => hideAnswersInfoSpan(el));
});



// span utilizada para exibir dados digitados no input de resposta
//(tamanho das palavras digitadas etc)
const typingInfoSpan = document.createElement('span');
typingInfoSpan.setAttribute('id', 'typing-info-span');
typingInfoSpan.style.display = 'none';

// localiza a div que contem o input e adiciona a span antes dele
const typingInfoDiv = document.getElementById('respostas').firstElementChild;
typingInfoDiv.insertBefore(typingInfoSpan, typingInfoDiv.childNodes[0]);

// input de respostas
const formInput = document.getElementById('resposta');

// chamada no keyup do forminput para exibir dados da palavra digitada
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

let lastTyped = '';
formInput.addEventListener('keyup', ({target}) => {
    displayTypingWordsInfo();
    forceLowerCaseInput();
    changeInputColorWhenAnswered(target.value);
    lastTyped = target.value.trim() == '' ? lastTyped : target.value.trim();
    controlElementsMarking(target.value)

    console.log(checkWordIsAnAnser(lastTyped));
});

setInterval(() => console.log(lastTyped), 1000);
//formInput.addEventListener('keydown', () => lastTyped = '');


function forceLowerCaseInput() {
    formInput.value = formInput.value.toLowerCase();
}

// verifica se a resposta sendo digitada já está respondida
function checkWordIsAnswered(word) {
    const answers = getAnsweredList();
    let answered = false;
    if (answers)
        answers.forEach((answer) => {
            if(compareSpecialChars(answer, word))
                answered = true;
        });
    return answered;
}

// usada no keyup do forminput pra alterar sua cor quando já respondida
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

function getElementsStartingWith(letter){
    const elements = getAnswersElementsList().filter((element) => {
        return element.firstChild.innerText.startsWith(letter);
    });

    return elements;
}

function markElementsStartingWith(letter){
    const elements = getElementsStartingWith(letter);
    elements.forEach((element) => element.style.backgroundColor = '#fb1');
}

function unmarkElementsStartingWith(letter){
    const elements = getElementsStartingWith(letter);
    elements.forEach((element) => element.style.backgroundColor = 'initial');
    console.log('desmarcando com a letra ' + letter)
}

// controla o realce do grupo de repostas com a letra
// digitada
let markedLetter = '';
function controlElementsMarking(inputValue){

    if(checkWordIsAnAnser(lastTyped) || inputValue.length == 0)
    {
        unmarkElementsStartingWith(markedLetter);
        markedLetter = '';
        return

        /* 
            se o valor digitado for uma resposta válida
            ou o campo estiver em branco, devido ao apagamento
            automártico do racha cuca, desmarca a seleção
        */
    }
    if(inputValue.length != 0 && markedLetter != inputValue[0])
    {   
        unmarkElementsStartingWith(markedLetter);
        markElementsStartingWith(inputValue[0]);
        markedLetter = inputValue[0];

        /* 
            marca a seleção se o input estiver preenchido e
            e for uma palavra com letra diferente de uma já selecionada
        */
    }
    
}


console.log('UI CARREGADADA', getElementsStartingWith('c'));

// usada para remover o loader e a div modal
export default function disableWaiting() {
    waitingDataDiv.style.display = 'none';
    console.log('Disabling div')
}