"use strict"

var mySubscriptions = new subscriptions_handler();

// Колесо мышки //

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

function list_forms(){

	var salf = this;
	
	var list = {};
	
	this.add_form = function(form_ref){
		
		salf.remove_form(form_ref);
		
		list[form_ref.id] = form_ref;
		
	}
	
	this.remove_form = function(form_ref){
		
		if (_.isUndefined(list[form_ref.id])) return

		mySubscriptions.notification
			(
			list[form_ref.id],
			'Удалить-подписки-объекта'
			);

		delete list[form_ref.id]; 		
		
	}
	
	this.is_open = function(id){
		
		return !_.isUndefined(list[id]);

	}
	
	this.log = function(){
		
		console.log(list);
		
	}
	
	mySubscriptions.subscribe(salf, 'Закрыта-форма');
	
	this.notification_processing = function(source, event, options){
		
		if (event == 'Закрыта-форма'){
		
			salf.remove_form(source);
		}
		
	}		
	
 }

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
		
		$(selector + " .btn-close").click(function(){salf.close()});
		
	}
	
	function creat_content(){
		
		if (elements.length == 0 ) return;
		
		$(selector).append('<div class="ui-dialog-content" id="' + id_content + '"><div class="content"></div></div>');
		
		for(var element of elements){
			
			element.add_option('form', salf);
			
			element.display(selector_content + ' .content');
			
		}
		
		
	}	
	
	function creat_footer(){
		
		if (salf.option('buttons') == undefined) return;
		
		$(selector).append('<div class="ui-dialog-footer" id="' + id_footer + '"></div>');
		
		$(selector+' .ui-dialog-footer').append('<div class="pull-right"></div> ');
		
		var group_btn = $(selector + ' .ui-dialog-footer .pull-right');
		
		for(var button of salf.option('buttons')){
		
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

	function save_option_form(){ // сохранить настройки

		var jq = $(selector);

		if (jq.length == 0) return;
		
		var option_form = {
			top: parseInt(jq.css( 'top' )),
			left: parseInt(jq.css( 'left' )),
			height: jq.height(),
			width: jq.width()
		};
		
		var json = $.toJSON(option_form);
		
		localStorage.setItem('option_form_' + id_form, json);
		
		// $.cookie('option_form_' + id_form, "--");
		
	}
	
	function restore_option_form(){ // Восстановить настройки

		var jq = $(selector);
		
		var json = localStorage.getItem('option_form_' + id_form);
		
		// var json = $.cookie('option_form_' + id_form);
		
		if (json != undefined) {
			
			var option_form = $.secureEvalJSON(json);
			
			if (option_form.top != undefined) {
				
				var win_height = $(window).height();
				
				if (win_height <= option_form.height){
					
					jq.css( 'top' , 0);
					
				}else if (win_height < option_form.top + option_form.height){
					
					jq.css( 'top' , win_height - option_form.height);
					
				}else{	
					
					jq.css( 'top' , option_form.top);
					
				}
			
			};
			
			if (option_form.left != undefined) {
				
				var win_width = $(window).width();
				
				if (win_width <= option_form.height){
					
					jq.css( 'left' , 0);
					
				}else if (win_width < option_form.left + option_form.width){
					
					jq.css( 'left' , win_width - option_form.width);
					
				}else{	
					
					jq.css( 'left' , option_form.left);
					
				}
			
			}
			
		}
		
	}	
	
	function destroy(){
		
		if ($(selector).length > 0){
		
			save_option_form();
		
			$(selector).remove();
			
			mySubscriptions.notification(salf, 'Закрыта-форма');
			
		}
	
	}
	
	//--
	
	this.id = id_form;
	
	this.open = function(){
		
		creat_form();
		
		creat_header();
		
		creat_content();
		
		creat_footer();		
		
		drag_element(id_form + "-header", id_form);
		
		restore_option_form();
		
		mySubscriptions.notification(salf, 'Открыта-форма');
		
	}
	
	this.close = function(){
	
		destroy();
		
	}	
	
	this.change = function(){
		
	}	
	
	this.option = function(key, value){
		
		if (salf[key] != undefined && typeof salf[key] == 'function'){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				option[key] = value;
				
			}
			
			return option[key];
			
		}
		
	}
	
	this.add_content = function(element){
		
		elements.push(element);
		
	}

	this.update_data_content = function(){ // Перечистать данные контанта
		
		for(var element of elements){
			
			if (!_.isFunction(element.update_data)) continue
			
			element.update_data();
		
		}
		
	}
	
	//-----------------
	
	salf.close();

	myForms.add_form(this);
	
}

// Элементы //

function input_field(type, name){
	
	var salf = this;
	
	var option = {};	
	
	this.id = 'input_field_' + name;
	
	this._selector = '#' + salf.id;
	
	//..

	function get_value_type(value){
		
		if (type == 'number') {
			
			return + value;
			
		}else if(type == 'text') {
			
			return "" + value;
		
		}else{
			
			return value;
			
		}
		
	}	
	
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
    
		var name_prop = 'value';
		
		if(type == 'checkbox') name_prop = 'checked';
	
		if (value != undefined) {
		
			$(this._selector).find('input').prop(name_prop, value);
		
			salf.option('value_before_change', value);
		
		}
		
		var v = get_value_type($(this._selector).find('input').prop(name_prop));
		
		return v;
    
	}
  
 	this.option = function(key, value){
		
		if (salf[key] != undefined && typeof salf[key] == 'function'){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				option[key] = value;
				
			}
			
			return option[key];
			
		}
		
	} 
  
	this.add_option = function(key, value){
		
		salf.option(key, value);
		
		return salf;
	}
  
	this.update_data = function(){
		
		this.value(salf.option('data_object')[salf.option('data_name')]);
		
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
		
		var form = salf.option('form');
		
		if (!_.isUndefined(form)){
			
			form.change();
		
		}
	
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
	
	function inputfocus(){ salf._inputfocus() }
  
	function inputchange(){ salf._inputchange() }

	function inputkeydown(){ salf._inputkeydown() }
  
	function inputfocusout(){ salf._inputfocusout() }
  
	//-------------------------
  
  	this.display = function(parent_selector){

		var html_text = ' <div class="row" id="' + salf.id + '"> ';

		if (salf.option('caption_position') == 'top'){
			
			var caption_col = 12;
			var field_col = 12;
			
		}else{
			
			var caption_col = 3;
			var field_col = 9;			
			
		}		
		
		// caption --

		html_text += '<div class="col-sm-' + caption_col + '">';
		html_text += '	<p class="form-control-static">' + salf.option('caption') + ':</p>';
		html_text += '</div>';
		
		// field --
		
		html_text += '<div class="col-sm-' + field_col + '">';
		html_text += '	<input type="text" class="form-control" name="' + name + '" placeholder="Введите значение">';
		html_text += '</div>';
		
		$( parent_selector ).append(html_text);
		
		//--
	 
		$(this._selector).find('input').focus(function(){inputfocus()});
	  
		$(this._selector).find('input').keydown(function(){inputkeydown()});

		$(this._selector).find('input').focusout(function(){inputfocusout()});
	  
		$(this._selector).find('input').change(function(){inputchange()});
		
		$(this._selector).find('input').prop('value', salf.option('data_object')[salf.option('data_name')]);
		
	}	
   
 }

function input_number_field(name){

	var salf = this;

	var type = 'number';
  
	input_field.apply(this, [type, name]);

	var _selector = salf._selector;
	
	function inputfocus(){ salf._inputfocus() }
  
	function inputchange(){ salf._inputchange() }

	function inputkeydown(){ salf._inputkeydown() }
  
	function inputfocusout(){ salf._inputfocusout() }

	//-------------------------
  
  	this.display = function(parent_selector){

		var html_text = ' <div class="row" id="' + salf.id + '"> ';

		if (salf.option('caption_position') == 'top'){
			
			var caption_col = 12;
			var field_col = 12;
			
		}else{
			
			var caption_col = 3;
			var field_col = 9;			
			
		}		
		
		// caption --
		
		html_text += '<div class="col-sm-' + caption_col + '">';
		html_text += '	<p class="form-control-static">' + salf.option('caption') + ':</p>';
		html_text += '</div>'
		
		// field --
		
		html_text += '<div class="col-sm-' + field_col + '">';
		
		html_text += '<div class="input-group">';
		
		if (salf.option('btn_subtract_step') == true) {
			
			html_text +=			
			'<span class="input-group-btn">' +
			'	<button class="btn btn-default" type="button">-</button>'+
			'</span>';
			
		}

		html_text += '<input type="number" class="form-control ';
		
		if (salf.option('text_center') == true){
			
			html_text += ' text-center ';
			
		}
		
		html_text += '" name="' + name + '" placeholder="Введите значение">';
			
		if (salf.option('btn_add_step') == true) {
		
			html_text +=
			'<span class="input-group-btn">' +
			' <button class="btn btn-default" type="button">+</button>'+
			'</span>';
			
		}
		
		html_text += '</div></div>';
		
		$( parent_selector ).append(html_text);
		
		//--
	 
		$(this._selector).find('input').focus(function(){inputfocus()});
	  
		$(this._selector).find('input').keydown(function(){inputkeydown()});

		$(this._selector).find('input').focusout(function(){inputfocusout()});
	  
		$(this._selector).find('input').change(function(){inputchange()});
		
		$(this._selector).find('input').prop('value', salf.option('data_object')[salf.option('data_name')]);
		
	}	

}
 
function input_checkbox_field(name){
  
	var salf = this;
  
	var type = 'checkbox';
  
	input_field.apply(this, [type, name]);

	var _selector = salf._selector;
  
	function inputchange(){ salf._inputchange() }
  
	//-------------------------
  
  	this.display = function(parent_selector){

		var html_text = ' <div class="row" id="' + salf.id + '"> ';
	
		html_text += '<div class="col-sm-12">';
	
		if (salf.option('check_right') == true){
			
			html_text += '<div class="checkbox checkbox-right">';
			
			html_text += '<label>Видимость элемента<input type="checkbox" value="" checked=""></label>';
			
		}else{
			
			html_text += '<div class="checkbox">';		
			
			html_text += '<label><input type="checkbox" value="" checked="">Видимость элемента</label>';
			
		}		
		
		html_text += '';

		html_text += '</div></div>';
		
		$( parent_selector ).append(html_text);
		
		//--
  
		$(this._selector).find('input').change(function(){inputchange()});
		
		$(this._selector).find('input').prop('checked', salf.option('data_object')[salf.option('data_name')]);
		
	}	
   
 }
 
function wood_values(name){
	
	var salf = this;
	
	this.id = 'wood_' + name;
	
	this._selector = '#' + salf.id;
	
	var option = {};	
	
	var columns = [];
	
	//-------------------------
 	
	this.option = function(key, value){
		
		if (salf[key] != undefined && typeof salf[key] == 'function'){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				option[key] = value;
				
			}
			
			return option[key];
			
		}
		
	} 
	
	this.add_option = function(key, value){
		
		salf.option(key, value);
		
		return salf;
	}	
	
	// columns ---------
	
	this.add_column = function(column){
		
		columns.push(column);
		
	}
	
	// -----------------
	
  	this.display = function(parent_selector){
	
		var html_text = ' <div class="row" id="' + salf.id + '"> ';

		html_text += ' <div class="wood-values"> ';

		var data_wood = salf.option('data_wood');
		
		if (_.isArray(data_wood) && data_wood.length > 0){
			
			console.log("isArray", true);
			
			for(var row of data_wood){
				
				if (row.active){
					
					html_text += '<div class="row active">';
					
				}else{

					html_text += '<div class="row">';
				
				}

				for(var col of columns){
					
					html_text += '<div class="' + col.option('width') + ' ' + col.option('cut-text') + '">';
					
					if (col.option('type') == 'text'){
						
						html_text += 
							'<span class="form-control-static'+
							' ' + col.option('ref') +
							' ' + col.option('smoll-text') +							
							'">' +
							row[col.option('name')] +
							'</span>';

					
					}else if(col.option('type') == 'checkbox'){
					
						html_text += 
							'<div class="checkbox">' + 
							'	<input type="checkbox" value="' + row[col.option('name')] + '" checked="">' +
							'</div>';
					
					}
					
					html_text += '</div>';
					
				}
				
				html_text += '</div>';
				
			}
			
		}
		
		
		html_text += '</div></div>';
		
		$( parent_selector ).append(html_text);
	
	}
	
} 
 
function wood_column(name, type){
	
	var salf = this;
	
	var option = {};
	
	this.option = function(key, value){
		
		if (!_.isUndefined(salf[key]) && _.isFunction(salf[key])){
			
			return salf[key](value);
			
		}else{
			
			if (value != undefined){
				
				option[key] = value;
				
			}
			
			return option[key];
			
		}
		
	} 	
	
	this.add_option = function(key, value){
		
		salf.option(key, value);
		
		return salf;
	}		

	salf.option('name', name);
	
	salf.option('type', type);
	
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
 
function subscriptions_handler(){ // обработчик подписок
	
	var salf = this;

	var name_function = 'notification_processing';
	
	var subscriber = {}; // подписка ({событие : [ссылка, ссылкаб ссылка]})
	
	this.subscribe = function(ref, event){ // подписаться
		
		if (_.isUndefined(subscriber[event])) subscriber[event] = [];
		
		subscriber[event].push(ref);
		
		return salf;
		
	}	
	
	this.unsubscribe = function(ref, event){ // отписаться от события
		
		if (_.isUndefined(subscriber[event])) return
		
		_.pull(subscriber[event], ref); // Удалить значение из массива
		
		if ( subscriber[event].length == 0 ) _.unset(subscriber, event);			
	}	
	
	this.unsubscribe_all = function(ref){ // отписаться
		
		for(var event of _.keys(subscriber)){
			
			salf.unsubscribe(ref, event);
			
		}
	
	}		
	
	this.notification = function(source, event, options){  // уведомление о событии (событие, источник, параметры)
		
		if (_.isUndefined(subscriber[event])) return
		
		for(var ref of subscriber[event]){
			
			if (source == ref) continue;

			if (!_.isFunction(ref[name_function])) continue;
		
			ref[name_function](source, event, options);
			
		}
		
	}
	
	this[name_function] = function(source, event, options){
	
		if (event == 'Удалить-подписки-объекта'){
		
			salf.unsubscribe_all(source);

		}
		
	}
	
	this.log = function(){
		
		console.log(subscriber);
		
	};
	
	//...
	
	salf.subscribe(salf, 'Удалить-подписки-объекта');
	
}

