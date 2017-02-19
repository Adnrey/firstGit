"use strict"

function cancelEvent(e) {
	
	e = e ? e : window.event;
	
	if (e.stopPropagation) { e.stopPropagation() }

	if (e.preventDefault) { e.preventDefault() }

	e.cancelBubble = true;

	e.cancel = true;

	e.returnValue = false;

	return false;
	
 }

function hookEvent(hElem, eventName, callback) {
  
	if (typeof(hElem) == 'string'){hElem = document.getElementById(hElem);} // Если передан ID, то получить DOM-элемент
  
	if (!hElem) { return false; } // Если такого элемента нет, то возврат с ошибкой
 
	if (hElem.addEventListener) {
	  
		if (eventName == 'mousewheel') { hElem.addEventListener('DOMMouseScroll', callback, false) } // Событие вращения колесика для Mozilla
    
		hElem.addEventListener(eventName, callback, false); // Колесико для Opera, WebKit-based, а также любые другие события для всех браузеров кроме Internet Explorer
	
	} else if (hElem.attachEvent) {
    
		hElem.attachEvent('on' + eventName, callback); // Все события для Internet Explorer
	
	} else {

		return false;

	}
 
	return true;

 }

function unhookEvent(hElem, eventName, callback) {
 
	if (typeof(hElem) == 'string') {hElem = document.getElementById(hElem)} // Если передан ID, то получить DOM-элемент
  
	if (!hElem) { return false; } // Если такого элемента нет, то возврат с ошибкой
 
	if (hElem.removeEventListener) {

		if (eventName == 'mousewheel') { hElem.removeEventListener('DOMMouseScroll', callback, false) } // Событие вращения колесика для Mozilla

		hElem.removeEventListener(eventName, callback, false); // Колесико для Opera, WebKit-based, а также любые другие события для всех браузеров кроме Internet Explorer
	
	} else if (hElem.detachEvent) {
    
		hElem.detachEvent('on' + eventName, callback); // Все события для Internet Explorer
	
	} else {

		return false;

		
	}
  
	return true;
  
 }

function setHookMouseWheel(obj, callback, act) {
	
	act ? hookEvent(obj.id, 'mousewheel', callback) : unhookEvent(obj.id, 'mousewheel', callback);
	
 }

function mauseWheelEvent(e){
	
	e = e ? e : window.event;

	var wheelElem = e.target ? e.target : e.srcElement;
	
	var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40; //'wheelData' значение поворота колеса
	
	if (Math.abs(wheelData) > 100) { wheelData=Math.round(wheelData/100) } // В движке WebKit возвращается значение в 100 раз больше

	this.elem = wheelElem;
	
	this.value = wheelData;
	
 }

// Формы //

function dialog_form(id_form){
	
	var salf = this;
	
	var id_header  = id_form + "-header";
	var id_content = id_form + "-content";
	var id_footer  = id_form + "-footer";
	
	var selector         = "#" + id_form;
	var selector_header  = "#" + id_header;
	var selector_content = "#" + id_content;
	var selector_footer  = "#" + id_footer;
	
	var option = {};
	
	var elements = [];
	
	destroy();
	
	//--
	
	var caption = "";
	
	function creat_form(){

		$('article').append(' <div class="ui-dialog" id="' + id_form + '"></div> ');

	}
	
	function creat_header(){
		
		$(selector).append(
			'<div class="ui-dialog-header" id="' + id_header + '">'+
			'	<div class="ui-dialog-header-title">'+ salf.option('caption') +'</div>' +
			'	<div class="btn-group pull-right">' +
			'		<button type="button" class="btn btn-default btn-close"></button>' +
			'	</div>' +
			'</div>'
		);
		
		$(selector + " .btn-close").click(function(){destroy()});
		
	}
	
	function creat_content(){
		
		$(selector).append('<div class="ui-dialog-content" id="' + id_content + '"><div class="content"></div></div>');
		
		for(var element of elements){
			
			element.creat_field(selector_content + ' .content');
			
		}
		
		
	}	
	
	function creat_footer(){
		
		if (salf.option.buttons == undefined) return;
		
		$(selector).append('<div class="ui-dialog-footer" id="' + id_footer + '"></div>');
		
		$(selector+' .ui-dialog-footer').append('<div class="pull-right"></div> ');
		
		var group_btn = $(selector + ' .ui-dialog-footer .pull-right');
		
		for(var button of salf.option.buttons){
		
			group_btn.append(
			
				'<button type="button" class="btn btn-default" '+
				'name = "'+button.name+'"> '+
				button.text + '</button> '
			
			);
			
			if (button.click != undefined && typeof salf[button.click] == 'function'){

				group_btn
					.find('button[name=' + button.name+']')
						.on('click', button.data, salf[button.click]);	
					
			}			
			
			
		}

	}

	function destroy(){
		
		$(selector).remove();		
		
	}
	
	//--
	
	this.option = function(key, value){
		
		if (salf[key] != undefined && typeof salf[key] == 'function'){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				salf.option[key] = value;
				
			}
			
			return salf.option[key];
			
		}
		
	}
	
	this.open = function(){
		
		creat_form();
		
		creat_header();
		
		creat_content();
		
		creat_footer();		
		
		drag_element(id_form + "-header", id_form);
		
	}
	
	this.close = function(){
		
		console.log("Сработала функция close");
		
		destroy();
		
	}	

	this.add_content = function(element){
		
		elements.push(element);
		
	}
	
}

function formPropertyMap(){

	var salf = this;

	var idForm = 'formPropertyMap';

	var selector = "#" + idForm; 

	var ref = undefined;

	$('article').append(' <div id="' + idForm + '" title="Свойства помещения"></div> ');  

	//-----
	
	$(selector).css('overflow', 'hidden');

	$(selector).append(' <input id="prop_map_elemint_name">');

	$(selector).append(' <input id="prop_map_size_x">');

	$(selector).append(' <input id="prop_map_size_y">');

	$(selector).append(' <input id="prop_map_size_z">');

	var na = new iaaInputStringField('prop_map_elemint_name', 'Название:');

	var ex = new iaaInputNumberField('prop_map_size_x', 'Ширина:');

	var ey = new iaaInputNumberField('prop_map_size_y', 'Высота:');

	var ez = new iaaInputNumberField('prop_map_size_z', 'Глубина:');
  
	ex.min(100); ex.max(1000); ex.step(100);
	ey.min(100); ey.max(1000); ey.step(100);
	ez.min(100); ez.max(1000); ez.step(100);

	$(selector).dialog({autoOpen: false});
	$(selector).dialog("option", "width", 310);
	$(selector).dialog("option", "height", 320);
	$(selector).dialog("option", "modal", true)
	$(selector).dialog("option", "draggable", false ); // Перетаскивание
	$(selector).dialog("option", "resizable", false);  // Растягивание

	var buttons = [];

	buttons.push({text: 'Сохранить', click: function(){salf.save()}});
	buttons.push({text: 'Отмена',    click: function(){salf.destroy()}});

	$(selector).dialog("option", "buttons", buttons);

	this.destroy = function(){

		$(selector).dialog( "destroy" );

		$(selector).detach();

	}

	this.open = function(element){

		if (element != undefined) {

			ref = element;

			na.value(ref.name);

			ex.value(ref.sizes[0]);
			ey.value(ref.sizes[1]);
			ez.value(ref.sizes[2]);

		}

		$(selector).dialog("open");

	}

	this.save = function(){

		if (ref != undefined) {

			ref.name = na.value();

			ref.sizes[0] = +ex.value();
			ref.sizes[1] = +ey.value();
			ref.sizes[2] = +ez.value();
			
			myCanvas.recalculate();
			
			myCanvas.repaint();

		}

		$(selector).dialog( "close" );

	}
	
	$(selector).dialog({
		
		close:
			function(event, ui) {
		 		$(selector).dialog( "destroy" );
				$(selector).detach();
			}
			
	});	

 }

function formAddElemrnt(){
	
	var salf = this;

	var idForm = 'formAddElemrnt';

	var selector = "#" + idForm; 

	var ref = undefined;

	$('article').append(' <div id="' + idForm + '" title="Добавление элемента"></div> ');  

	//-----
	
	$(selector).css('overflow', 'hidden');

	$(selector).append(' <input id="add_elemint_name">');

	$(selector).append(' <input id="add_size_x">');

	$(selector).append(' <input id="add_size_y">');

	$(selector).append(' <input id="add_size_z">');

	var na = new iaaInputStringField('add_elemint_name', 'Название:');

	var ex = new iaaInputNumberField('add_size_x', 'Ширина:');

	var ey = new iaaInputNumberField('add_size_y', 'Высота:');

	var ez = new iaaInputNumberField('add_size_z', 'Глубина:');
  
	ex.min(1); ex.max(600); ex.step(10);
	ey.min(1); ey.max(600); ey.step(10);
	ez.min(1); ez.max(600); ez.step(10);

	$(selector).dialog({autoOpen: false});
	$(selector).dialog("option", "width", 310);
	$(selector).dialog("option", "height", 320);
	$(selector).dialog("option", "modal", true)
	$(selector).dialog("option", "draggable", false ); // Перетаскивание
	$(selector).dialog("option", "resizable", false);  //Растягивание

	var buttons = [];

	buttons.push({text: 'Создать', click: function(){salf.save()}});
	buttons.push({text: 'Отмена',    click: function(){salf.destroy()}});

	$(selector).dialog("option", "buttons", buttons);

	this.destroy = function(){

		$(selector).dialog( "destroy" );

		$(selector).detach();

	}

	this.open = function(actionPoint, inw, inh, ind){

		ref = actionPoint;
		
		na.value("Элемент");

		if (myCanvas.currentDraft == actionPoint.parent) {
		
			var [w, h, d] = [100, 100, 100];
		
		}else{
			
			var [w, h, d] = actionPoint.parent.sizes;
			
		}
		
		if (inw != undefined) w = inw;
		if (inh != undefined) h = inh;
		if (ind != undefined) d = ind;
		
		ex.value(w); ey.value(h); ez.value(d);

		$(selector).dialog("open");
		
	}

	this.save = function(){

		if (ref != undefined) {
		
			if (myCanvas.currentDraft == ref.parent){
				
				var [x, y, z] = ref.face.сentreValue;
				
			} else {
				
				var [px, py, pz] = ref.parent.position;
				
				var [cx, cy, cz] = ref.face.сentreValue;				

				var [x, y, z] = [px + cx, py + cy, pz + cz];
				
			}
			
			var [w, h, d] = [+ex.value(), +ey.value(), +ez.value()]
			
			var visibleSeeFace = ref.face.parent.faceVisible;
			
			var litter = ref.face.letter;
			
			if (visibleSeeFace){
				
				if (litter == 'R'){y -= h/2;z -= d/2;

				}else if (litter == 'L'){x -= w;y -= h/2;z -= d/2;

				}else if (litter == 'T'){x -= w/2; z -= d/2;

				}else if (litter == 'B'){x -= w/2;y -= h;z -= d/2;
				
				}else if (litter == 'H'){x -= w/2;y -= h/2;z -= d;
				
				}else if (litter == 'Y'){x -= w/2;y -= h/2;}
				
			}else{	

				if (litter == 'R'){x -= w;y -= h/2;z -= d/2;

				}else if (litter == 'L'){y -= h/2;z -= d/2;

				}else if (litter == 'T'){x -= w/2; y -= h; z -= d/2;

				}else if (litter == 'B'){x -= w/2; z -= d/2;

				}else if (litter == 'H'){x -= w/2;y -= h/2;

				}else if (litter == 'Y'){x -= w/2;y -= h/2;z -= d;}

			}

			var newElement
				= myCanvas.currentDraft.addElement
					(
					new elementProperty(na.value(), x, y, z, w, h, d,0,0,0)

				);			

			myCanvas.setCurrentElement(newElement);

			myCanvas.recalculate();

			myCanvas.repaint();

		}

		$(selector).dialog( "close" );

	}
	
	$(selector).dialog({
		
		close:
			function(event, ui) {
		 		$(selector).dialog( "destroy" );
				$(selector).detach();
			}
			
	});	
	
 }

function formDeleteElement(){
	
	var salf = this;

	var idForm = 'formDeleteElement';

	var selector = "#" + idForm; 

	var ref = undefined;

	$('article').append(' <div id="' + idForm + '" title="Удаление элемента"></div> ');  

	//-----
	
	$(selector).css('overflow', 'hidden');
	
	$(selector).dialog({autoOpen: false});
	$(selector).dialog("option", "width", 310);
	$(selector).dialog("option", "height", 320);
	$(selector).dialog("option", "modal", true)
	$(selector).dialog("option", "draggable", false ); // Перетаскивание
	$(selector).dialog("option", "resizable", false);  // Растягивание	

	var buttons = [];

	buttons.push({text: 'Удалить', click: function(){salf.deleteElement()}});
	buttons.push({text: 'Отмена',    click: function(){salf.destroy()}});

	$(selector).dialog("option", "buttons", buttons);

	this.destroy = function(){

		$(selector).dialog( "destroy" );

		$(selector).detach();

	}

	this.open = function(element){

		ref = element;

		$(selector).dialog("open");

	}

	this.deleteElement = function(){

		if (ref != undefined) {

			ref.delete();
		
			myCanvas.recalculate();
			
			myCanvas.repaint();

		}

		$(selector).dialog( "close" );

	}
	
	$(selector).dialog({
		
		close:
			function(event, ui) {
		 		$(selector).dialog( "destroy" );
				$(selector).detach();
			}
			
	});	
	
 }

function formPropertyElement(){
	
	var salf = this;

	var idForm = 'formPropertyElement';

	var selector = "#" + idForm; 

	this.ref = undefined;

	$('article').append(' <div id="' + idForm + '" title="Свойства элемента"></div> ');  

	//-----

	$(selector).css('overflow', 'hidden');

	$(selector).append(' <input id="elemint_name"> ');

	$(selector).append(' <input id="prop_poz_x"> ');
	$(selector).append(' <input id="prop_poz_y"> ');
	$(selector).append(' <input id="prop_poz_z"> ');

	$(selector).append(' <input id="prop_size_x"> ');
	$(selector).append(' <input id="prop_size_y"> ');
	$(selector).append(' <input id="prop_size_z"> ');
	
	//$(selector).append(' <input id="prop_rotation_x"> ');
	//$(selector).append(' <input id="prop_rotation_y"> ');
	//$(selector).append(' <input id="prop_rotation_z"> ');

	//.................
	
	var na = new iaaInputStringField('elemint_name', 'Название:');

	na._inputchange = function(){myCanvas.propertyOnChange(salf.getref(), 'name', na.value())}
	
	var px = new iaaInputNumberField('prop_poz_x', 'Лево:');
	var py = new iaaInputNumberField('prop_poz_y', 'Вверх:');
	var pz = new iaaInputNumberField('prop_poz_z', 'Вперёд:');
	
	px._inputchange = function(){myCanvas.propertyPositionOnChange(salf.getref(), 'x', + px.value())}
	py._inputchange = function(){myCanvas.propertyPositionOnChange(salf.getref(), 'y', + py.value())}
	pz._inputchange = function(){myCanvas.propertyPositionOnChange(salf.getref(), 'z', + pz.value())}
	
	var sx = new iaaInputNumberField('prop_size_x', 'Ширина:');
	var sy = new iaaInputNumberField('prop_size_y', 'Высота:');
	var sz = new iaaInputNumberField('prop_size_z', 'Глубина:');
	
	sx._inputchange = function(){myCanvas.propertySizeOnChange(salf.getref(), 'x', + sx.value())}
	sy._inputchange = function(){myCanvas.propertySizeOnChange(salf.getref(), 'y', + sy.value())}
	sz._inputchange = function(){myCanvas.propertySizeOnChange(salf.getref(), 'z', + sz.value())}
	
	//var rx = new iaaInputNumberField('prop_rotation_x', 'Верх-Низ:');
	//var ry = new iaaInputNumberField('prop_rotation_y', 'Вперед-Назад:');
	//var rz = new iaaInputNumberField('prop_rotation_z', 'Лево-Право:');
  
	//px.min(0); px.max(600);
	px.step(10);
	//py.min(0); py.max(600);
	py.step(10);
	//pz.min(0); pz.max(600);
	pz.step(10);

	sx.min(0); sx.max(600); sx.step(10);
	sy.min(0); sy.max(600); sy.step(10);
	sz.min(0); sz.max(600); sz.step(10);

	//rx.min(0); rx.max(360); rx.step(45);
	//ry.min(0); ry.max(360); ry.step(45);
	//rz.min(0); rz.max(360); rz.step(45);

	//.................
	
	//.................
	
	$(selector).dialog({autoOpen: false});
	$(selector).dialog("option", "width", 310);
	//$(selector).dialog("option", "position", 'left');
	$(selector).dialog("option", "modal", false)
	$(selector).dialog("option", "draggable", true); // Перетаскивание
	$(selector).dialog("option", "resizable", false);  //Растягивание

	this.destroy = function(){

		$(selector).dialog( "destroy" );

		$(selector).detach();

	}

	this.open = function(actionElement){

		salf.ref = actionElement;
	
		na.value(salf.ref.name);
		
		px.value(+salf.ref.position[0]);
		py.value(+salf.ref.position[1]);
		pz.value(+salf.ref.position[2]);

		sx.value(+salf.ref.sizes[0]);
		sy.value(+salf.ref.sizes[1]);
		sz.value(+salf.ref.sizes[2]);
		
		//rx.value(+salf.ref.turn[0]);
		//ry.value(+salf.ref.turn[1]);
		//rz.value(+salf.ref.turn[2]);
		
		$(selector).dialog("open");
		
	}

	this.getref = function(){
	
		return salf.ref;
	
	}
	
	$(selector).dialog({
		
		close:
			function(event, ui) {
		 		
				$(selector).dialog( "destroy" );
				$(selector).detach();
				
			}
		
		// salf.destroy();

	});	
	
 }

// Кнопки //

function iaaTopIconToolBar(name, parentSelector){

	var salf = this;

	this._name = name;

	this._selector = "#" + name;  

	this._groupsButton = [];

	$(parentSelector).append
		(
		'<div class="pagination" role="toolbar" id="' + name + '"></div> '
		);

	this.addGroupButton = function(name){

		var group = new iaaTopIconToolBarGoupButton(name, salf);

		salf._groupsButton.push(group);

		return group;

	}

 }

function iaaTopIconToolBarGoupButton(name, parent){
  
	var salf = this;

	this._name = parent._name + 'Group' + (parent._groupsButton.length);
  
	this._selector = "#" + this._name;
  
	this._buttons = {};

	$(parent._selector).append(' <div class=" btn-group " role="group" id="' + this._name +'"></div> ');
  
	// $(this._selector).addClass(' btn-group ');
  
	this.addButton = function(name, type, check){
    
		var button = new iaaTopIconToolBarButton(name, type, salf);
    
		salf._buttons[button._name] = button;
    
		if (check != undefined) { button.check(check) }	

		return button;
    
	}

	this.checkButton = function(){
   
		var checkButtonName = $(this._selector).find('input:checked').attr('id'); 
		
		return salf._buttons[checkButtonName];
    
	}
  
 }

function iaaTopIconToolBarButton(name, type, parent){
  
	var salf = this;
  
	this._name = name;
  
	this._selector = "#" + name;  
  
	// $(parent._selector).append(' <input id="' + name + '" name="'+parent._name+'" type="' + type + '" class="iaa-botton iaa-hidden"> ');
  
	// var input = $(parent._selector).find(this._selector);
  
	// $(parent._selector).append(' <label for="' + name + '" class="iaa-label-botton"></label> ');
   
    $(parent._selector).append( ' <input type="' + type + '" class="iaa-toolbar-input hidden" name="' + parent._name + '" id="' + name + '"> ' );

	var input = $(parent._selector).find(this._selector);
	
    $(parent._selector).append(' <label class="iaa-toolbar-input-label" for="' + name + '"></label> ');
   
	input.click(function(e){salf.click(e)});
	
	this.click = function(e){
		
	}  
  
	this.check = function(value){
	  
		if (value != undefined) {
		
			input.prop('checked', value)
			
		}
    	
		return parent.checkButton() == name;
    
	}  

	this.svg_mousemove = function(sx, sy){
	
		
	
	}
	
 }

// Элементы //

function input_field(type, name){
	
	var salf = this;
	
	this.id = 'input_field_' + name;
	
	this._selector = '#' + salf.id;
	
	//..
	
	function get_value_type_default(){
		
		if (type == 'number') {
			
			return 0;
			
		}else if(type == 'text') {
			
			return "";
		
		}else if(type == 'checkbox') {
			
			return false;
			
		}
		
	}

	//..
  
	this.value = function(value){
    
		if (value != undefined) {
		
			$(this._selector).find('input').prop('value', value);
		
			salf.option('value_before_change', value);
		
		}
    
		return $(this._selector).find('input').prop('value');
    
	}
  
 	this.option = function(key, value){
		
		if (salf[key] != undefined && typeof salf[key] == 'function'){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				salf.option[key] = value;
				
			}
			
			return salf.option[key];
			
		}
		
	} 
  
	this.add_option = function(key, value){
		
		salf.option(key, value);
		
		return salf;
	}
  
	//..	
  
	this._inputfocus = function(){

		salf.option('value_before_change', salf.value()); 
    
	}
  
	this._inputkeydown = function(){
    
		var field = $(this._selector).find('input');
       
		if (event.keyCode == 13) { //Enter
      
			field.blur();
		
			field.parent().focus();

		}else if(event.keyCode == 27){ //Esc
      
			salf.value(salf.option('value_before_change'));
      
			field.blur();
        
			field.parent().parent().click();
	
			cancelEvent();
      
		}
	
	}
  
	this._inputfocusout = function(){
   
		salf.option('value_before_change', salf.value());  
    
	}
  
	this._inputchange = function(){
		
		var data_object = salf.option('data_object');
		
		data_object[salf.option('data_name')] = salf.value();
	
	}

	//..
	
	this.option('caption', name);	
	
	this.option('value_before_change', get_value_type_default());
}

function input_string_field(name){
  
	var salf = this;
  
	var type = 'text';
  
	input_field.apply(this, [type, name]);

	var _selector = salf._selector;
	
	function inputfocus(){
   
		salf._inputfocus();
    
	}
  
	function inputkeydown(){
    
		salf._inputkeydown();
    
	}
  
	function inputfocusout(){
	
		salf._inputfocusout();
	
	}
  
	function inputchange(){
		
		salf._inputchange();
		
	}
  
	//-------------------------
  
  	this.creat_field = function(parent_selector){

		$( parent_selector ).append(' <div class="row" id="' + salf.id + '"> ');

		if (salf.option('caption_position') == 'top'){
			
			var caption_col = 12;
			var field_col = 12;
			
		}else{
			
			var caption_col = 3;
			var field_col = 9;			
			
		}		
		
		// caption --
		
		$(_selector).append(
			
			'<div class="col-sm-' + caption_col + '">' +
			'	<p class="form-control-static">' + salf.option('caption') + ':</p>' +
			'</div>'
			
		);		
		
		// field --
		
		$(_selector).append(
		
			'<div class="col-sm-' + field_col + '">' +
			'	<input type="text" class="form-control" name="' + name + '" placeholder="Введите значение">' +
			'</div>'
		
		);
		
		//--
	 
		$(this._selector).find('input').focus(function(){inputfocus()});
	  
		$(this._selector).find('input').keydown(function(){inputkeydown()});

		$(this._selector).find('input').focusout(function(){inputfocusout()});
	  
		$(this._selector).find('input').change(function(){inputchange()});
		
		$(this._selector).find('input').prop('value', salf.option('data_object')[salf.option('data_name')]);
		
	}	
   
 }

//--

function iaaInputField(name, caption){
   
	this._selector = "#" + name;
  
	var salf = this;
  
	var valueBeforeChange = ""; 
  
	$(this._selector).wrap(' <span></span> ');  
  
	$(this._selector).parent().addClass('iaa-input-field');

	$(this._selector).before(' <span>'+caption+'</span> ');
  
	$(this._selector).parent().find('span').addClass('iaa-input-caption');
  
	//..
  
	this.value = function(value){
    
		if (value != undefined) {
		
			$(this._selector).prop('value', value);
		
			valueBeforeChange = value;
		
		}
    
		return $(this._selector).prop('value');
    
	}
  
	this.destroy = function(){
    
		$(salf._selector).parent().replaceWith(' <input id="'+name+'"> ');    
       
	}
  
	//..
  
	this._inputfocus = function(){

		valueBeforeChange = salf.value(); 
    
	}
  
	this._inputkeydown = function(){
    
		var field = $(this._selector).parent().find('input');
       
		if (event.keyCode == 13) { //Enter
      
			field.blur();
		
			field.parent().focus();

		}else if(event.keyCode == 27){ //Esc
      
			salf.value(valueBeforeChange);
      
			field.blur();
        
			field.parent().parent().click();
	
			cancelEvent();
      
		}
	
	}
  
	this._inputfocusout = function(){
   
		valueBeforeChange = salf.value(); 
    
	}
  
	this._inputchange = function(){
		

		
	}
  
 }

function iaaInputStringField(name, caption){
  
	var salf = this;
  
	iaaInputField.apply(this, arguments);
  
	$(this._selector).replaceWith(' <input id="'+name+'" type = "text"> ');

	$(this._selector).parent().find('input').addClass('iaa-input');
  
	$(this._selector).parent().find('input').focus(function(){inputfocus()});
  
	$(this._selector).parent().find('input').keydown(function(){inputkeydown()});

	$(this._selector).parent().find('input').focusout(function(){inputfocusout()});
  
  	$(this._selector).parent().find('input').change(function(){inputchange()});
    
	$(this._selector).prop('value', '');
  
	//..
  
	function inputfocus(){
   
		salf._inputfocus();
    
	}
  
	function inputkeydown(){
    
		salf._inputkeydown();
    
	}
  
	function inputfocusout(){
	
		salf._inputfocusout();
	
	}
  
	function inputchange(){
		
		salf._inputchange();
		
	}
  
 }

function iaaInputNumberField(name, caption){
  
	var salf = this;
  
	iaaInputField.apply(this, arguments);
  
	$(this._selector).replaceWith('<input id="'+name+'" type = "number">');
  
	$(this._selector).parent().find('input').prop('iaaInputNumberField', salf);
  
	$(this._selector).parent().find('input').addClass('iaa-input');

	$(this._selector).parent().find('input').focus(function(){inputfocus()});

	$(this._selector).parent().find('input').keydown(function(){inputkeydown()});

	$(this._selector).parent().find('input').focusout(function(){inputfocusout()});
  
   	$(this._selector).parent().find('input').change(function(){inputchange()});
 
 
 	$(this._selector).parent().find('input').mouseover(function(){setHookMouseWheel(this, myCanvas.inputWheelMouse, 1)})

	$(this._selector).parent().find('input').mouseout(function(){setHookMouseWheel(this, myCanvas.inputWheelMouse)})   

 
 
	$(this._selector).before(' <button class="iaa-remove-button">-</button> ');
  
	$(this._selector).after(' <button class="iaa-add-button">+</button> ');

	$(this._selector).parent().find('.iaa-remove-button').click(function(){salf.addStep(-1)});

	$(this._selector).parent().find('.iaa-add-button').click(function(){salf.addStep(1)});
  
	$(this._selector).parent().find('button').addClass('iaa-button');
  
	$(this._selector).parent().find('button').addClass('iaa-input-button');
  
	$(this._selector).prop('value', 0);
  
	//......
  
	this.min = function(value){
    
		if (value != undefined) {$(this._selector).prop('min', value);}
   
		return $(this._selector).prop('min');
    
	}
  
	this.max = function(value){
    
		if (value != undefined) {$(this._selector).prop('max', value);}
    
		return $(this._selector).prop('max');
    
	}
   
	this.step = function(value){
    
		if (value != undefined) {$(this._selector).prop('step', value);}
    
		return $(this._selector).prop('step');
    
	}  
  
    this.addStep = function(sing){
		
		var value = +salf.value();      

		var step = +salf.step();

		value += step * sing;

		value = getValidValue(value);

		if (value != salf.value()){
			
			salf.value(value);
			
			salf._inputchange();

		}
    
	}
  
	//......
 
	function inputfocus(){
   
		salf._inputfocus();
    
	}
  
	function inputkeydown(){
    
		if (event.keyCode == 13) { //Enter
      
			var value = +salf.value(); 
      
			value = getValidValue(value);

			salf.value(value);
      
		}
    
		salf._inputkeydown();
    
	}
  
	function inputfocusout(){
   
		var value = +salf.value(); 
      
		value = getValidValue(value);

		salf.value(value);    
    
		salf._inputfocusout();
    
	}  
  
	function inputchange(){
		
		salf._inputchange();
		
	}  
  
	function getValidValue(value){
    
		if (salf.min() != 0) {value = Math.max(+salf.min(), value)};
	
		if (salf.max() != 0) {value = Math.min(+salf.max(), value)};
        
		return value;
    
	}
   
 }

// Прочее //

function drag_element(id_element, id_element_drag){

	var salf = this;

	var stage = document.getElementById(id_element);

	var selector = "#" + id_element_drag;

	var mauseHandled = false;

	var left = 0;

	var top = 0;

	var startX = 0;

	var startY = 0;

	function start_drop(e){

		mauseHandled = true;

		startX = e.clientX;

		startY = e.clientY; 

		top = get_top();  

		left = get_left();

	}

	function stop_drop(){

		mauseHandled = false;

	}

	function mousemove(e){

		if (!mauseHandled) return

		// delta X -----------------

		var deltaX = e.clientX - startX;

		if (deltaX != 0){

			var win_width = $(window).width();

			var width = $(selector).width();

			var val = left + deltaX;

			val = Math.max(0,val); 
			val = Math.min(win_width - width - 2,val);

			if (get_left() != val){

				$(selector).css("left", val+"px");

			}

		}

		// delta Y -----------------

		var deltaY = e.clientY - startY;

		if (deltaY != 0){

			var win_height = $(window).height();
			var height = $(selector).height();

			var val = top + deltaY;

			val = Math.max(0,val); 
			val = Math.min(win_height - height - 2,val);

			if (get_top() != val){

				$(selector).css("top", val+"px");

			}

		}

	}

	function get_top(){

		return parseInt($(selector).css( "top" ));

	}

	function get_left(){

		return parseInt($(selector).css( "left" ));

	}

	stage.onmousedown = function(e){start_drop(e)}

	document.onmouseup = function(e){stop_drop()} 		

	document.onmousemove = function(e){mousemove(e)} 	

 }