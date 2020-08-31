
//document.addEventListener('DOMContentLoaded', function(){
	let id = location.pathname.split('/')[2];
	let data = undefined;
	$.getJSON(`https://rachacuca.com.br/trivia/data/${id}/`,
	    function(d) {
	    	data = d;
	        let port = chrome.runtime.connect('ehgjgfhbdbhmbakigcnnchnpchgbinhn', {
	            'name': 'web page'
	        });

	        console.log(data)
	        port.postMessage(data);
	        
	    });
//});