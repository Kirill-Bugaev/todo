
// -- client routine --

function responseHandler(response, handler, callback) {
	if (response.readyState == 4)
		if (response.status == 200)
			if (response.responseText) {
//				alert(response.responseText);
				callback(handler(response.responseXML));
			} else
				alert("Communication error: No data received");
		else
			alert("Communication error: " + response.statusText);
}

function asyncRequest(phpUri, handler, callback) {
	let request = new XMLHttpRequest();
	request.open("POST", phpUri, true);
	request.onreadystatechange = function () { responseHandler(this, handler, callback); };
	return request;
}

function xmlErrorHandler(xmlDoc) {
	if (!xmlDoc) {
		alert("Server error: bad XML");
		return 1;
	}
	let error = xmlDoc.getElementsByTagName("error")[0];
	if (error) {
		alert("Server error: " + error.childNodes[0].nodeValue);
		return 1;
	}
	return 0;
}

function getTasksResponseHandler(xmlDoc) {
	if (xmlErrorHandler(xmlDoc))
		return [];
	let tasks = xmlDoc.getElementsByTagName("task");
	let parsed = [];
	for (let i = 0; i < tasks.length; i++) {
		let task = new Object;
		task.dbId = tasks[i].getAttribute("id");
		task.date = tasks[i].getAttribute("date");
		task.color = tasks[i].getAttribute("color");
		task.text = tasks[i].childNodes[0].nodeValue;
		task.done = tasks[i].getAttribute("done");
		parsed.push(task);
	}
	return parsed;
}

function addTasksResponseHandler(task, xmlDoc) {
	if (xmlErrorHandler(xmlDoc))
		return null;
	let taskEl = xmlDoc.getElementsByTagName("task");
	if (taskEl.length == 0) {
		alert("Server error: Bad response");
		task.dbId = 0;
		task.date = 0;
	} else {
		task.dbId = taskEl[0].getAttribute("id");
		task.date = taskEl[0].getAttribute("date");
	}
	return task;
}

// -- client API --

function clientGetTasks(callback) {
	let request = asyncRequest("./php/get-tasks.php", getTasksResponseHandler, callback);
	request.send(null);
}

function clientAddTask(task, callback) {
	let params = "text=" + encodeURIComponent(task.text);
	params += "&color=" + task.color + "&done=" + task.done;
	let handler = function(xmlDoc) { return addTasksResponseHandler(task, xmlDoc); };
	let request = asyncRequest("./php/add-task.php", handler, callback);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", params.length);
	request.setRequestHeader("Connection", "close");
	request.send(params);
}
