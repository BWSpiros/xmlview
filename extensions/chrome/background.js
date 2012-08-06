var xsl = null;
function loadXsl(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			xsl = xhr.responseText;
		}
	};
	xhr.send();
}

function sendRequest(request, response) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, request, function(r) {
			if (response)
				response(r);
		});
	});
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch (request.action) {
		case 'xv.get-dnd-feedback':
			sendResponse({image: xv_dnd_feedback.draw(request.text)});
			break;
		case 'xv.copy':
			var ta = document.getElementById('ta');
			ta.value = request.text;
			ta.select();
			sendResponse({success: document.execCommand("copy", false, null)});
			break;
		case 'xv.get-xsl':
			if (xsl === null)
				loadXsl(request.filePath);
				
			sendResponse({fileText: xsl});
			break;
		case 'xv.get-settings':
			sendResponse({data: xv_settings.dump()});
			break;
		case 'xv.store-settings':
			xv_settings.setValue(request.name, request.value);
			break;
	}
});

loadXsl('process.xsl');