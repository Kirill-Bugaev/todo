
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

function setRequestHeader(request, contLength) {
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", contLength);
	request.setRequestHeader("Connection", "close");
}

function xmlErrorCheck(xmlDoc) {
	if (!xmlDoc) {
		alert("Server error: bad XML");
		return 0;
	}
	let error = xmlDoc.getElementsByTagName("error")[0];
	if (error) {
		let errMsg = "Server error: ";
		if (error.childNodes.length > 0)
			errMsg += error.childNodes[0].nodeValue;
		else
			errMsg += "unknown";
		alert(errMsg);
		return 0;
	}
	return 1;
}

// -- response handlers --

function getTasksResponseHandler(xmlDoc) {
	if (!xmlErrorCheck(xmlDoc))
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

function addTasksResponseHandler(xmlDoc) {
	if (!xmlErrorCheck(xmlDoc))
		return null;
	let task = new Object;
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

function removeTaskResponseHandler(xmlDoc) {
	if (!xmlErrorCheck(xmlDoc))
		return null;
	return 1;
}

function editTaskResponseHandler(xmlDoc) {
	if (!xmlErrorCheck(xmlDoc))
		return null;
	return 1;
}

// -- client API --

function clientGetTasks(callback) {
	let request = asyncRequest("./php/get-tasks.php", getTasksResponseHandler, callback);
	request.send(null);
}

function clientAddTask(task, callback) {
	let request = asyncRequest("./php/add-task.php", addTasksResponseHandler, callback);
	let params = "text=" + encodeURIComponent(task.text);
	params += "&color=" + task.color + "&done=" + task.done;
	setRequestHeader(request, params.length);
	request.send(params);
}

function clientRemoveTask(dbId, callback) {
	let request = asyncRequest("./php/remove-task.php", removeTaskResponseHandler, callback);
	let params = "id=" + dbId;
	setRequestHeader(request, params.length);
	request.send(params);
}

function clientEditTask(task, callback) {
	let request = asyncRequest("./php/edit-task.php", editTaskResponseHandler, callback);
	let params = "id=" + task.dbId;
	if (task.color != null)
		params += "&color=" + task.color;
	if (task.done != null)
		params += "&done=" + task.done;
	if (task.text != null)
		params += "&text=" + encodeURIComponent(task.text);
	setRequestHeader(request, params.length);
	request.send(params);
}
