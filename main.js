import display from './UI.js';

let id = location.pathname.split('/')[2];
let data = undefined;

async function getJSON(){
	$.getJSON(`https://rachacuca.com.br/trivia/data/${id}/`, (d) => console.log('Dados baixados: ', d));
}

window.onload = () => {
	
};
