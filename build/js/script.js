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
    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
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

// https://stackoverflow.com/questions/11720141/set-onclick-event-using-script
function addListener(element, eventName, handler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false);
  }
  else if (element.attachEvent) {
    element.attachEvent('on' + eventName, handler);
  }
  else {
    element['on' + eventName] = handler;
  }
}
// ============

function toggleNew(button) {
	let newname;
	let dispvalue;
	if (button.innerHTML.toLowerCase() == 'new') {
		newname = 'hide';
		dispvalue = 'inline';
		formheight = '100%';
	} else {
		newname = 'new';
		dispvalue = 'none';
		formheight = getStyle(document.body, "--min-form-height");
	}
	button.innerHTML = newname;
	// buttons
	children = button.parentNode.childNodes;
	for (i = 0; i < children.length; i++)
		if (children[i] != button)
			children[i].style.display = dispvalue;
	// textarea
	if (dispvalue == 'inline') {
		button.parentNode.nextSibling.style.display = 'block';
	}
	else
		button.parentNode.nextSibling.style.display = 'none';
	// form
	button.parentNode.parentNode.style.height = formheight;
}

function setSelectColor(sel) {
	let color = getStyle(sel.options[sel.selectedIndex], 'color');
	sel.style.color = color;
	sel.style.backgroundColor = color;
	sel.parentNode.nextSibling.style.color = color;
}

function toggleDone() {
	let newname;
	let textdec;
	if (this.innerHTML.toLowerCase() == 'done') {
		newname = 'undone';
		textdec = 'line-through';
	} else {
		newname = 'done';
		textdec = 'none';
	}
	this.innerHTML = newname;
	this.parentNode.parentNode.nextSibling.style.textDecoration = textdec;
}

function toggleEdit(obj) {
	let newname;
	let dispvalue;
	let formheight;
	if (obj.innerHTML.toLowerCase() == 'edit') {
		newname = 'cancel';
		dispvalue = 'inline';
		formheight = '100%';
	} else {
		newname = 'edit';
		dispvalue = 'none';
		formheight = getStyle(document.body, "--min-form-height");
	}
	obj.innerHTML = newname;
	// buttons
	let children = obj.parentNode.childNodes;
	for (i = 0; i < children.length; i++)
		if (children[i] != obj && children[i].name != 'done')
			children[i].style.display = dispvalue;
	// textdiv and textarea
	let td = obj.parentNode.parentNode.nextSibling;
	let ta = obj.parentNode.nextSibling;
	if (dispvalue == 'inline') {
		td.style.display = 'none';
		ta.style.display = 'block';
		ta.innerHTML = td.innerHTML;
	}
	else {
		td.style.display = 'block';
		ta.style.display = 'none';
	}
	// form
	obj.parentNode.parentNode.style.height = formheight;
}

function clickEdit() {
	if (this.innerHTML.toLowerCase() == 'cancel') {
		let td = this.parentNode.parentNode.nextSibling;
		let color = getStyle(td, 'color');
		this.parentNode.previousSibling.style.color = color;
		let select = this.previousSibling.previousSibling;
		for (i = 0; i < select.options.length ; i++)
			if (getStyle(select.options[i], 'color') == color) {
				select.selectedIndex = i;
				setSelectColor(select);
				break;
			}
	}
	toggleEdit(this);
}

function changeColor() {
	setSelectColor(this);
	let color = getStyle(this.options[this.selectedIndex], 'color');
	this.parentNode.previousSibling.style.color = color;
}

function applyChanges() {
	let td = this.parentNode.parentNode.nextSibling;
	let ta = this.parentNode.nextSibling;
	td.innerHTML = ta.value;
	toggleEdit(this.nextSibling.nextSibling.nextSibling);
	let select = this.nextSibling;
	let color = getStyle(select.options[select.selectedIndex], 'color');
	td.style.color = color;
}

function showTask(date, text, color, done) {
	// hr
	let br1 = document.createElement("br");
	let br2 = document.createElement("br");
	let hr = document.createElement("hr");
	document.body.appendChild(br1);
	document.body.appendChild(hr);
	document.body.appendChild(br2);


	let palette = document.getElementById("palette");
	let colorval = getStyle(palette.options[color], "color");

	// form
	let form = document.createElement("form");
	form.name = "task";
	form.action = "./php/action.php";
	form.method = "post";
		// date
		let datecont = document.createElement("span");
		datecont.classList.add("date-container");
		datecont.style.color = colorval;
		datecont.innerHTML = date;
		// buttons-container
		let butcont = document.createElement("div");
		butcont.classList.add("buttons-container");
			// submit
			let submit = document.createElement("button");
//			submit.type = "submit";
			submit.type = "button";
			submit.classList.add("button");
			submit.onclick = applyChanges;
			submit.innerHTML = "ok";
			// select
			let select = document.createElement("select");
				// options
				const colors = ["default", "red", "green", "yellow", "blue", "purple", "aqua"]
				for (i = 0; i < colors.length; i++) {
					let opt = document.createElement("option");
					opt.value = colors[i];
					opt.innerHTML = "blue?";
					select.appendChild(opt);
				}
			select.onchange = changeColor;
			select.selectedIndex = color;
			select.style.backgroundColor = select.style.color = colorval;
			// done
			let donebut = document.createElement("button");
			donebut.type = "button";
			donebut.name = "done";
			if (done == 0)
				donebut.innerHTML = "done";
			else
				donebut.innerHTML = "undone";
			donebut.classList.add("button");
			donebut.classList.add("permbutton");
			donebut.onclick = toggleDone;
			// edit
			let edit = document.createElement("button");
			edit.type = "button";
			edit.innerHTML = "edit";
			edit.classList.add("button");
			edit.classList.add("permbutton");
			edit.onclick = clickEdit;
		butcont.appendChild(submit);
		butcont.appendChild(select);
		butcont.appendChild(donebut);
		butcont.appendChild(edit);
		// textarea
		let ta = document.createElement("textarea");
		ta.name = "task";
		ta.style.color = colorval;
		ta.required = "required";
	form.appendChild(datecont);
	form.appendChild(butcont);
	form.appendChild(ta);
	document.body.appendChild(form);
	// text
	let textcont = document.createElement("div");
	textcont.classList.add("task-text");
	textcont.style.color = colorval;
	if (done == 1)
		textcont.style.textDecoration = "line-through";
	textcont.innerHTML = text;
	document.body.appendChild(textcont);
}
