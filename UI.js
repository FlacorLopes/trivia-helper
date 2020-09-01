import {getAnswerInfo} from './main.js';

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

        const ID = answerOwnerElement.firstElementChild.getAttribute('id').replace('resposta-', '');

        try {
        	const info = getAnswerInfo(ID);
        	if(info.wordCount == 1)
        		answerInfoSpan.innerText = info.words[0].length + ' letras';
        	else {
        		answerInfoSpan.innerText = `resposta composta\n${info.wordCount} palavras\n`;
        	}
        }
        catch(err){
        	answerInfoSpan.innerText = 'Houve um erro ao calcular valor da resposta<br />' + err.message;

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
    el.parentElement.addEventListener('mouseenter', () => {
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

    // limpa o texto presente na span
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

formInput.addEventListener('keyup', displayTypingWordsInfo);

console.log('UI CARREGADADA')

export default function disableWaiting(){
	waitingDataDiv.style.display = 'none';
	console.log('Disabling div')
}