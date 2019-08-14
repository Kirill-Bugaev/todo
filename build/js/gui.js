// === Stackoverflow ===
// https://stackoverflow.com/questions/2664045/how-to-get-an-html-elements-style-values-in-javascript
function getStyle(el, styleProp) {
  var value, defaultView = (el.ownerDocument || document).defaultView;
  // W3C standard way:
  if (defaultView && defaultView.getComputedStyle) {
    // sanitize property name to css notation
    // (hypen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
  } else if (el.currentStyle) { // IE
    // sanitize property name to camelCase
    styleProp = styleProp.replace(/-(\w)/g, function(str, letter) {
      return letter.toUpperCase();
    });
    value = el.currentStyle[styleProp];
    // convert other units to pixels on IE
    if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
      return (function(value) {
        var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
        el.runtimeStyle.left = el.currentStyle.left;
        el.style.left = value || 0;
        value = el.style.pixelLeft + "px";
        el.style.left = oldLeft;
        el.runtimeStyle.left = oldRsLeft;
        return value;
      })(value);
    }
    return value;
  }
}
// ============

// const useClient = 1
const taskColors = ["default", "red", "green", "yellow", "blue", "purple", "aqua"];
const btnHeightAdd = 4;
const btnWidthAdd = 0;
var _taskIndex = 0;

// -- helpers --

function extractTaskIdPrefix(id) {
	return id.match(/^task(\d*)/g);
}

function removeElementById(id) {
	var element = document.getElementById(id);
	return element.parentNode.removeChild(element);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addLeadingZero(num) {
	let str = num.toString();
	return str.length == 2 ? str : "0" + str;
}

function timeToStr(mtime) {
	let date = new Date(mtime);
	let day = addLeadingZero(date.getDate());
	let month = addLeadingZero(date.getMonth() + 1);
	let hours = addLeadingZero(date.getHours());
	let minutes = addLeadingZero(date.getMinutes());
	let str = day + "-" + month + "-" + date.getFullYear() + " " + hours + ":" + minutes;
	return str;
}

// -- styles routine --

function equalizeBtnSize() {
	let btnEqualizer = document.getElementById("btn-equalizer");
	let eqBtnHeight = getStyle(btnEqualizer, "height");
	let eqBtnWidth = getStyle(btnEqualizer, "width");
	let btnHeight = (Math.round(parseFloat(eqBtnHeight, 10)) + btnHeightAdd) + "px";
	let btnWidth = (Math.round(parseFloat(eqBtnWidth, 10)) + btnWidthAdd) + "px";
	let btnVarsCssDeclar = "--btn-height:" + btnHeight + ";--btn-width:" + btnWidth + ";";
	let cssDeclarBlock = ":root{" + btnVarsCssDeclar + "}";
	let style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = cssDeclarBlock;
	document.getElementsByTagName("head")[0].appendChild(style);
	btnEqualizer.parentNode.removeChild(btnEqualizer);
}

function loadStyles() {
	let select = document.getElementById("theme-select");
	if (document.cookie == "")
		select.selectedIndex = 0;
	else
		select.selectedIndex = document.cookie;
	let link = document.createElement("link");
	link.id = "theme-style";
	link.href = "./css/" + select.value + ".css";
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
	equalizeBtnSize();
}

function changeStyle(theme) {
	document.getElementById("theme-style").href = "./css/" + theme + ".css";
	document.cookie = document.getElementById("theme-select").selectedIndex;
}

// -- newtask events --

function newTaskAddBtnOnClick(btn) {
	let textarea = document.getElementById("newtask-textarea");
	// check task not empty
	if (textarea.value.replace(/\s/g, "") == "") {
		return;
	}
	let select = document.getElementById("newtask-color-select");
	let text = textarea.value.trim();
	let color = select.selectedIndex;
	let done = 0;
	addTask(text, color, done);
}

function newTaskNewBtnOnClick(btn) {
	document.getElementById("newtask-form").style.height = "100%";
	document.getElementById("newtask-add-btn").style.display = "inline-block";
	document.getElementById("newtask-color-select").style.display = "inline-block";
	document.getElementById("newtask-hide-btn").style.display = "inline-block";
	let textarea = document.getElementById("newtask-textarea");
	textarea.style.display = "inline-block";
	textarea.focus();

	// calc form height
	let btnContHeight = parseInt(getStyle(btn.parentNode, "height"));
	let textareaHeigth = textarea.clientHeight;
	let formHeight = btnContHeight + textareaHeigth + "px";
	document.getElementById("newtask-form").style.height = formHeight;

	btn.style.display = "none";
}

function newTaskHideBtnOnClick(btn) {
	document.getElementById("newtask-form").style.height = getStyle(btn, "height");
	document.getElementById("newtask-add-btn").style.display = "none";
	document.getElementById("newtask-color-select").style.display = "none";
	document.getElementById("newtask-new-btn").style.display = "inline-block";
	document.getElementById("newtask-textarea").style.display = "none";
	btn.style.display = "none";
}

function newTaskColorSelectOnChange(select) {
	let colorName = select.options[select.selectedIndex].value;
	let colorVar = "var(--theme-color-" + colorName + ")";
	select.style.color = colorVar;
	select.style.backgroundColor = colorVar;
}

// -- task events--

function taskRemoveBtnOnClick(btn) {
	removeElementById(extractTaskIdPrefix(btn.id) + "-cont");
}

function taskDateContOnDoubleClick(span) {
	let textCont = document.getElementById(extractTaskIdPrefix(span.id) + "-text-cont");
	taskTextContOnDoubleClick(textCont);
}

function taskColorSelectOnChange(select) {
	let colorName = select.options[select.selectedIndex].value;
	let colorVar = "var(--theme-color-" + colorName + ")";
	select.style.color = colorVar;
	select.style.backgroundColor = colorVar;
	let textCont = document.getElementById(extractTaskIdPrefix(select.id) + "-text-cont");
	textCont.style.color = colorVar;
}

function taskUndoneBtnOnClick(btn) {
	let idPrefix = extractTaskIdPrefix(btn.id);
	let textCont = document.getElementById(idPrefix + "-text-cont");
	textCont.style.textDecoration = "none";
	document.getElementById(idPrefix + "-done-btn").style.display = "inline-block";
	btn.style.display = "none";
}

function taskDoneBtnOnClick(btn) {
	let idPrefix = extractTaskIdPrefix(btn.id);
	let textCont = document.getElementById(idPrefix + "-text-cont");
	textCont.style.textDecoration = "line-through";
	document.getElementById(idPrefix + "-undone-btn").style.display = "inline-block";
	btn.style.display = "none";
}

function taskTextareaOnFocusOut(textarea) {
	let idPrefix = extractTaskIdPrefix(textarea.id);
	if (textarea.value.replace(/\s/g, "") == "") {
		let removeBtn = document.getElementById(idPrefix + "-remove-btn");
		taskRemoveBtnOnClick(removeBtn);
		return;
	}
	let textCont = document.getElementById(idPrefix + "-text-cont");
	textCont.innerHTML = textarea.value;
	textarea.style.display = "none";
	
	// set form height
	let form = document.getElementById(idPrefix + "-form");
	let btnCont = document.getElementById(idPrefix + "-btn-cont");
	form.style.height = getStyle(btnCont, "height");

	textCont.style.display = "block";
}

function taskTextContOnDoubleClick(textCont) {
	textCont.style.display = "none";
	let idPrefix = extractTaskIdPrefix(textCont.id);
	let form = document.getElementById(idPrefix + "-form");
	form.style.height = "100%";
	let textarea = document.getElementById(idPrefix + "-textarea");
	textarea.style.display = "inline-block";

	// calc form height
	let btnCont = document.getElementById(idPrefix + "-btn-cont");
	let btnContHeight = parseInt(getStyle(btnCont, "height"));
	let textareaHeigth = textarea.clientHeight;
	let formHeight = btnContHeight + textareaHeigth + "px";
	form.style.height = formHeight;

	textarea.focus();
	let undoneBtn = document.getElementById(idPrefix + "-undone-btn");
	taskUndoneBtnOnClick(undoneBtn);
}

// -- dynamic elements --

function createTaskDbIdCont(idPrefix, dbId) {
	let span = document.createElement("span");
	span.id = idPrefix + "-db-id";
	span.style.display = "none";
	span.innerHTML = dbId;
	return span;
}

function createTaskDateCont(idPrefix, date) {
	let span = document.createElement("span");
	span.id = idPrefix + "-date";
	span.classList.add("task-date-cont");
	span.addEventListener("dblclick", function() {taskDateContOnDoubleClick(this);});
	span.innerHTML = timeToStr(date);
	return span;
}

function createTaskRemoveBtn(idPrefix) {
	let btn = document.createElement("button");
	btn.id = idPrefix + "-remove-btn";
	btn.classList.add("task-btn");
	btn.type = "button";
	btn.addEventListener("click", function() {taskRemoveBtnOnClick(this);});
	btn.style.display = "inline-block";
	btn.innerHTML = "remove";
	return btn;
}

function createTaskColorOption(idPrefix, colorName) {
	let option = document.createElement("option");
	option.id = idPrefix + "-color-option-" + colorName;
	option.classList.add("task-color-opt");
	option.value = colorName;
	option.innerHTML = "blue?";
	return option;
}

function createTaskColorSelect(idPrefix, color) {
	let select = document.createElement("select");
	select.id = idPrefix + "-color-select";
	select.classList.add("task-color-select");
	select.addEventListener("change", function() {taskColorSelectOnChange(this);});
	for (let i = 0; i < taskColors.length; i++) {
		let colorOption = createTaskColorOption(idPrefix, taskColors[i]);
		select.appendChild(colorOption);
	}
	select.selectedIndex = color;
	let colorVar = "var(--theme-color-" + taskColors[color] + ")";
	select.style.backgroundColor = select.style.color = colorVar;
	select.style.display = "inline-block";
	return select;
}

function createTaskUndoneBtn(idPrefix, done) {
	let btn = document.createElement("button");
	btn.id = idPrefix + "-undone-btn";
	btn.classList.add("task-btn");
	btn.type = "button";
	btn.addEventListener("click", function() {taskUndoneBtnOnClick(this);});
	if (done != 0)
		btn.style.display = 'inline-block';
	btn.innerHTML = "undone";
	return btn;
}

function createTaskDoneBtn(idPrefix, done) {
	let btn = document.createElement("button");
	btn.id = idPrefix + "-done-btn";
	btn.classList.add("task-btn");
	btn.type = "button";
	btn.addEventListener("click", function() {taskDoneBtnOnClick(this);});
	if (done == 0)
		btn.style.display = 'inline-block';
	btn.innerHTML = "done";
	return btn;
}

function createTaskBtnCont(idPrefix, color, done) {
	let div = document.createElement("div");
	div.id = idPrefix + "-btn-cont";
	div.classList.add("task-btn-cont");
	let removeBtn = createTaskRemoveBtn(idPrefix);
	let colorSelect = createTaskColorSelect(idPrefix, color);
	let undoneBtn = createTaskUndoneBtn(idPrefix, done);
	let doneBtn = createTaskDoneBtn(idPrefix, done);
	div.appendChild(removeBtn);
	div.appendChild(colorSelect);
	div.appendChild(undoneBtn);
	div.appendChild(doneBtn);
	return div;
}

function createTaskTextarea(idPrefix, text) {
	let textarea = document.createElement("textarea");
	textarea.id = idPrefix + "-textarea";
	textarea.classList.add("task-textarea");
	textarea.addEventListener("focusout", function() {taskTextareaOnFocusOut(this);});
	textarea.setAttribute("maxlength", 65535);
	textarea.innerHTML = text;
	return textarea;
}

function createTaskForm(idPrefix, date, text, color, done) {
	let form = document.createElement("form");
	form.id = idPrefix + "-form";
	form.classList.add("task-form");
	let dateCont = createTaskDateCont(idPrefix, date);
	let btnCont = createTaskBtnCont(idPrefix, color, done);
	let taskTextarea = createTaskTextarea(idPrefix, text);
	form.appendChild(dateCont);
	form.appendChild(btnCont);
	form.appendChild(taskTextarea);
	return form;
}

function createTaskTextCont(idPrefix, text, color, done) {
	let div = document.createElement("div");
	div.id = idPrefix + "-text-cont";
	div.classList.add("task-text-cont");
	let colorVar = "var(--theme-color-" + taskColors[color] + ")";
	div.style.color = colorVar;
	if (done != 0)
		div.style.textDecoration = "line-through";
	div.innerHTML = text;
	div.addEventListener("dblclick", function() {taskTextContOnDoubleClick(this);});
	return div;
}

function createTaskCont(idPrefix, dbId, date, text, color, done) {
	let div =  document.createElement("div");
	div.id = idPrefix + "-cont";
	div.classList.add("task-cont");
	let brBefore = document.createElement("br");
	let hr = document.createElement("hr");
	let brAfter = document.createElement("br");
	let taskDbIdCont = createTaskDbIdCont(idPrefix, dbId);
	let taskForm = createTaskForm(idPrefix, date, text, color, done);
	let taskTextCont = createTaskTextCont(idPrefix, text, color, done);
	div.appendChild(brBefore);
	div.appendChild(hr);
	div.appendChild(brAfter);
	div.appendChild(taskDbIdCont);
	div.appendChild(taskForm);
	div.appendChild(taskTextCont);
	return div;
}

function showTask(dbId, date, text, color, done) {
	let idPrefix = "task" + (_taskIndex++);
	let taskCont = createTaskCont(idPrefix, dbId, date, text, color, done);
	let newTaskCont = document.getElementById("newtask-cont");
	insertAfter(taskCont, newTaskCont);
}

// -- client interaction --

function showLoadedTasks(tasks) {
	for (let i = 0; i < tasks.length; i++)
		showTask(tasks[i].dbId, tasks[i].date, tasks[i].text, tasks[i].color, tasks[i].done);
}

function loadTasks() {
	if (!useClient)
		return;
	clientGetTasks(showLoadedTasks);
}

function resetNewTaskForm() {
	let textarea = document.getElementById("newtask-textarea");
	let select = document.getElementById("newtask-color-select");
	let hideBtn = document.getElementById("newtask-hide-btn");
	textarea.value = "";
	select.selectedIndex = 0;
	newTaskColorSelectOnChange(select);
	newTaskHideBtnOnClick(hideBtn);
}

function showAddedTask(task) {
	if (!task)
		return;
	showTask(task.dbId, task.date, task.text, task.color, task.done);
	resetNewTaskForm();
}

function addTask(text, color, done) {
	if (!useClient) {
		let dbId = 0;
		let date = new Date().getTime();
		showTask(dbId, date, text, color, done);
		resetNewTaskForm();
		return;
	}
	let task = new Object;
	task.text = text;
	task.color = color;
	task.done = done;
	clientAddTask(task, showAddedTask);
}
