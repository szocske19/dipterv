/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxForm
 * 
 * A simple class for creating HTML forms.
 * 
 * Constructor: mxForm
 * 
 * Creates a HTML table using the specified classname.
 */
function mxForm(className)
{
	this.table = document.createElement('table');
	this.table.className = className;
	this.body = document.createElement('tbody');
	
	this.table.appendChild(this.body);
};

/**
 * Variable: table
 * 
 * Holds the DOM node that represents the table.
 */
mxForm.prototype.table = null;

/**
 * Variable: body
 * 
 * Holds the DOM node that represents the tbody (table body). New rows
 * can be added to this object using DOM API.
 */
mxForm.prototype.body = false;

/**
 * Function: getTable
 * 
 * Returns the table that contains this form.
 */
mxForm.prototype.getTable = function()
{
	return this.table;
};

/**
 * Function: addButtons
 * 
 * Helper method to add an OK and Cancel button using the respective
 * functions.
 */
mxForm.prototype.addButtons = function(okFunct, cancelFunct)
{
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	tr.appendChild(td);
	td = document.createElement('td');

	// Adds the ok button
	var button = document.createElement('button');
	mxUtils.write(button, mxResources.get('ok') || 'OK');
	td.appendChild(button);

	mxEvent.addListener(button, 'click', function()
	{
		okFunct();
	});
	
	// Adds the cancel button
	button = document.createElement('button');
	mxUtils.write(button, mxResources.get('cancel') || 'Cancel');
	td.appendChild(button);
	
	mxEvent.addListener(button, 'click', function()
	{
		cancelFunct();
	});
	
	tr.appendChild(td);
	this.body.appendChild(tr);
};

/**
 * Function: addText
 * 
 * Adds an input for the given name, type and value and returns it.
 */
mxForm.prototype.addText = function(name, value, type)
{
	var input = document.createElement('input');
	
	input.setAttribute('type', type || 'text');
	input.value = value;
	
	return this.addField(name, input);
};

/**
 * Function: addCheckbox
 * 
 * Adds a checkbox for the given name and value and returns the textfield.
 */
mxForm.prototype.addCheckbox = function(name, value)
{
	var input = document.createElement('input');
	
	input.setAttribute('type', 'checkbox');
	this.addField(name, input);

	// IE can only change the checked value if the input is inside the DOM
	if (value)
	{
		input.checked = true;
	}

	return input;
};

/**
 * Function: addTextarea
 * 
 * Adds a textarea for the given name and value and returns the textarea.
 */
mxForm.prototype.addTextarea = function(name, value, rows)
{
	var input = document.createElement('textarea');
	
	if (mxClient.IS_NS)
	{
		rows--;
	}
	
	input.setAttribute('rows', rows || 2);
	input.value = value;
	
	return this.addField(name, input);
};

/**
 * Function: addCombo
 * 
 * Adds a combo for the given name and returns the combo.
 */
mxForm.prototype.addCombo = function(name, isMultiSelect, size)
{
	var select = document.createElement('select');
	
	if (size != null)
	{
		select.setAttribute('size', size);
	}
	
	if (isMultiSelect)
	{
		select.setAttribute('multiple', 'true');
	}
	
	return this.addField(name, select);
};

/**
 * Function: addOption
 * 
 * Adds an option for the given label to the specified combo.
 */
mxForm.prototype.addOption = function(combo, label, value, isSelected)
{
	var option = document.createElement('option');
	
	mxUtils.writeln(option, label);
	option.setAttribute('value', value);
	
	if (isSelected)
	{
		option.setAttribute('selected', isSelected);
	}
	
	combo.appendChild(option);
};

/**
 * Function: addField
 * 
 * Adds a new row with the name and the input field in two columns and
 * returns the given input.
 */
mxForm.prototype.addField = function(name, input)
{
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	mxUtils.write(td, name);
	tr.appendChild(td);
	
	td = document.createElement('td');
	td.appendChild(input);
	tr.appendChild(td);
	this.body.appendChild(tr);
	
	return input;
};

mxForm.prototype.addMultiCombo = function(name, array, selectedArray){

	var div = document.createElement("div");
	var table = document.createElement("table");

	if(selectedArray != null) {
		for (var i = 0; i < selectedArray.length; i++) {
			if (array.indexOf(selectedArray[i]) === -1)  {
				array.push(selectedArray[i]);
			}
		}
	}

	if(selectedArray != null) {
		for (var i = 0; i < selectedArray.length; i++) {
			insRow(table, array, name, selectedArray[i], true);
		}
	}
	
	var button = document.createElement("button");
	button.innerHTML = "Add";
	button.onclick = function() {
		insRow(table, array, name, null, true);
	}	

	div.appendChild(table);
	div.appendChild(button)

	return this.addField(name, div);
}

function deleteRow(table, button) {
	var row = button.parentNode.parentNode;			
	table.deleteRow(row.rowIndex);
}

mxForm.prototype.addSingleCombo = function(name, array, selectedElement){

	var div = document.createElement("div");
	var table = document.createElement("table");

	div.appendChild(table);

	if(selectedElement != null) {
		if (array.indexOf(selectedElement) === -1)  {
			array.push(selectedElement);
		}		
	}

	insRow(table, array, name, selectedElement, false);

	return this.addField(name, div);

}

mxForm.prototype.importFileForm = function(name, className){
	var input = document.createElement("input");
	input.id = className;
	input.type = "file";

	return this.addField(name, input);
}

function insRow(table, array, name, selected, removeBTNrequired) {
	var filas = table.rows.length;
	var row = table.insertRow(filas);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	
	createSelect(cell1, array, name, selected);
	
	if(removeBTNrequired) {
		var button = document.createElement('button');
		button.innerHTML = "Remove";
		button.onclick = function() {deleteRow(table ,button);}
		cell2.appendChild(button);
	}
	
	// table.firstElementChild.firstElementChild.lastElementChild.firstElementChild.disabled = false;
}

function createSelect(parentElement, array, name, selected){
	
	//Create and append select list
	var selectList = document.createElement("select");
	parentElement.appendChild(selectList);	
	selectList.className = name;

	//Create and append the default option
	var option = document.createElement("option");
	option.text = "Select item!";
	option.label = "invalid";
	option.selected = true;
	option.hidden = true;
	option.disabled = true;
	selectList.appendChild(option);

	//Create and append the options
	for (var i = 0; i < array.length; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", array[i]);
		if(selected === array[i]){
			option.selected = true;
		}
		option.text = array[i];
		selectList.appendChild(option);
	}
	
}

function clearSelected(selcet){
    var elements = selcet.options;

    for(var i = 0; i < elements.length; i++){
      elements[i].selected = false;
    }
  }


