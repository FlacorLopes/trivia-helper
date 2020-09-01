import disableWaiting from './UI.js';

let id = location.pathname.split('/')[2];
let data = undefined;

function getJSON(){
	$.getJSON(`https://rachacuca.com.br/trivia/data/${id}/`, (json) => {
		data = json.data;
		disableWaiting();
	});
}
getJSON();

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

