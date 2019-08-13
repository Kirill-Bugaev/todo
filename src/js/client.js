
// client routine

function parseXML(xmlDoc) {
	if (!xmlDoc) {
		alert("Server error: bad XML");
		return [];
	}
	let error = xmlDoc.getElementsByTagName("error")[0];
	if (error) {
		alert("Server error: " + error.childNodes[0].nodeValue);
		return [];
	}

	let tasks = xmlDoc.getElementsByTagName("task");
	let parsed = [];
	for (let i = 0; i < tasks.length; i++) {
		let task = new Object;
		task.id = tasks[i].getAttribute("id");
		task.date = tasks[i].getAttribute("date");
		task.color = tasks[i].getAttribute("color");
		task.text = tasks[i].childNodes[0].nodeValue;
		task.done = tasks[i].getAttribute("done");
		parsed.push(task);
	}
	return parsed;
}

function getTasksResponseHandler(response, callback) {
	if (response.readyState == 4)
		if (response.status == 200)
			if (response.responseText) {
//				alert(response.responseText);
				callback(parseXML(response.responseXML));
			} else
				alert("Communication error: No data received");
		else
			alert("Communication error: " + response.statusText);
}

// client API

function clientGetTasks(callback) {
	let request = new XMLHttpRequest();
	request.open("POST", "./php/get-tasks.php", true);
	request.onreadystatechange = function () { getTasksResponseHandler(this, callback); };
	request.send(null);
	return [];
}
