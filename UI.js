import {
    getAnswerInfo
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

formInput.addEventListener('keyup', ({target}) => {
    displayTypingWordsInfo();
    forceLowerCaseInput();
    changeInputColorWhenAnswered(target.value);
});


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

// usada para comparação ignorando caracteres especiais do português;
function compareSpecialChars(str1, str2) {
    let specialChars = /[ãâáàâéêíóõôúç]/i;

    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    // console.log('comparing...', str1, str2);

    if (specialChars.test(str1)) {
        str1 = str1.replace('ã', 'a');
        str1 = str1.replace('á', 'a');
        str1 = str1.replace('à', 'a');
        str1 = str1.replace('â', 'a');

        str1 = str1.replace('é', 'e');
        str1 = str1.replace('ê', 'e');
        str1 = str1.replace('í', 'i');
        str1 = str1.replace('õ', 'o');
        str1 = str1.replace('ó', 'o');
        str1 = str1.replace('ô', 'o');
        str1 = str1.replace('ú', 'u');

        str1 = str1.replace('ç', 'c');

    }
    if (specialChars.test(str2)) {
        str2 = str2.replace('ã', 'a');
        str2 = str2.replace('á', 'a');
        str2 = str2.replace('à', 'a');
        str2 = str2.replace('â', 'a');

        str2 = str2.replace('é', 'e');
        str2 = str2.replace('ê', 'e');
        str2 = str2.replace('í', 'i');
        str2 = str2.replace('õ', 'o');
        str2 = str2.replace('ó', 'o');
        str2 = str2.replace('ô', 'o');
        str2 = str2.replace('ú', 'u');

        str2 = str2.replace('ç', 'c');
    }

    return str1 === str2;
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

console.log('UI CARREGADADA')

// usada para remover o loader e a div modal
export default function disableWaiting() {
    waitingDataDiv.style.display = 'none';
    console.log('Disabling div')
}