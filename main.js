import disableWaiting from './UI.js';

let id = location.pathname.split('/')[2];
let data = undefined;

function getJSON(){
	$.getJSON(`https://rachacuca.com.br/trivia/data/${id}/`, (json) => {
		data = json.data;
		disableWaiting();
		console.log(data);
	});
}
getJSON();

export function getAnswerFromBase(base){
	// em caso de resposta que incluam uma opcional (ex: abacate; avocado)
	// considera somente a primeira (abacate)
	let splitted = base.split(';')[0].replace(';', '');

}

// retorna dados acerca de uma resposta baixada com base no seu ID
export function getAnswerInfo(answerID){
	if(!data)
		throw new Error('Dados não baixados');

	let answer = data[Number(answerID)].resposta;
	let wordCount = 1;
	let words = [];
	if(!answer)
		throw new Error(`ID ${answerID} Inexistente`);

	// em caso de resposta que incluam uma opcional (ex: abacate; avocado)
	// considera somente a primeira (abacate)
	answer = answer.split(';')[0].replace(';', '');

	if(answer.split(' ').length > 1)
	{
		words = answer.split(' ');
		wordCount = words.length;
	}
	else if(answer.split('-').length > 1)
	{
		words = answer.split('-');
		wordCount = words.length;
	}
	else words.push(answer);

	return {
		wordCount,
		words
	}	
}

export function checkWordIsAnAnser(word){
	if(!data)
		throw new Error('Dados não baixados');

	let isAnswer = false;
	for(let idObj in data){
		if(compareSpecialChars(data[idObj].resposta, word))
			isAnswer = true;
	}

	return isAnswer;
}

// usada para comparação ignorando caracteres especiais do português;
export function compareSpecialChars(str1, str2) {
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
