"use strict"

var myGraphix = new iaaGraphixs(); 

var myCanvas = new iaaCanvas();

var myForms = new list_forms();

// Холст //

function iaaCanvas(){
	
	var salf = this;
	
	{ // Инициализация свойств
	
		var idForm = 'svgout';

		var selector = "#" + idForm; 

		var snap = undefined;
		
		//.....	
		
		this._gx = undefined;  // Сюда сохраняется дельта x при перемещении курсора
		this._gy = undefined;  // Сюда сохраняется дельта y при перемещении курсора 

		this._pressRightMouseButton = false; // Нажата правая кнопка мыши
		this._pressLeftMouseButton = false;  // Нажата левая кнопка мыши 
		this._pressMouseWheel = false;		 // Нажато колёсико мыши
		
		//.....
		
		this.type = 'Холст';	// тип
		
		this.width = 0;			// ширина
		
		this.height = 0;		// высота
		
		this.m = 421;			// половина ширины
		
		this.n = 380;			// половина высоты
		
		this.k = 0;				// поидее половина глубины, но всегда 0
		
		this.turn = [0,0,0];	// поворот [13,46,0]

		this.scale = 0.70; 		// масштаб
		
		this.bg_alfa = 0.8;		// Прозрачность элементов
		
		this.surfaces = new iaaSurFaces();		// список поверхностей
		
		this.currentElement = undefined;		// текущий элемент
		
		this.currentDraft = undefined;			// текущий проект

		this.actionPoints = [];					// точки действия	
		
		this.actionPointsStep = 10;				// шаг точки действия		
		
		mySubscriptions.subscribe(salf, 'Изменение-свойств-элемента-карты');
		mySubscriptions.subscribe(salf, 'Открыть-форму-свойства-элемента');
		mySubscriptions.subscribe(salf, 'Закрыть-форму-свойства-элемента');
		mySubscriptions.subscribe(salf, 'Открыть-форму-структура-проекта');
		mySubscriptions.subscribe(salf, 'Закрыть-форму-структура-проекта');
		mySubscriptions.subscribe(salf, 'Открыть-форму-добавления-элемента');
		mySubscriptions.subscribe(salf, 'Открыть-форму-удаления-элемента');
		mySubscriptions.subscribe(salf, 'Изменён-текущий-элемент-карты');
		
		
		var _attributes = {};					// атрибуты
		
	}
	
	$(document).ready(function (){onDocumentLoad()});
	
	$(window).resize(function(){onWindowsResize()});

	function onDocumentLoad(){
		
		createTopToolbar()		
		
		//..
		
		$('article').prepend(' <svg id="'+idForm+'"></svg> ');  
		
		//..
		
		$(selector).mouseover(function(){setHookMouseWheel(this, mapWheelMouse, 1)});
		$(selector).mouseout(function(){setHookMouseWheel(this, mapWheelMouse)});
		
		$(selector).mousemove(function(e){snapMouseMove(e)});
		$(selector).mouseup(function(e){snapMouseUp(e)});
		$(selector).mousedown(function(e){snapMouseDoun(e)});
		$(selector).mouseleave(function(e){snapMouseLeave(e)});
		
		$(selector).click(function(e){snapOnClick(e)});
		
		//..
		
		loadHammer(idForm);
		
		//..

		snap = Snap(selector);
		
		snap.attr({fill: "#fff", "stroke-width": "1px"});
		
		onWindowsResize();
		
		{// ++ Времяночка..
			
			myCanvas.m = 327.5;
			myCanvas.n = 380;
			myCanvas.scale = 0.5;
			// myCanvas.scale = 0.30000000000000004;
			// myCanvas.turn = [-90.375, 197.625,0];
			// myCanvas.turn = [4.875, -14.625,0];
			myCanvas.turn = [51.375, -39, 0];
			
			var draft = new iaaDraft('Новый проект', 600, 300, 400);
			
			// draft.position = [myCanvas.m - draft.sizes[0]/2, myCanvas.n + draft.sizes[1]/2, draft.sizes[2] * 1.3]; // позиция
			
			draft.position = [myCanvas.m - draft.sizes[0]/2, myCanvas.n + draft.sizes[1]/2, draft.sizes[2] * 1.3]
			
			draft.position = [12, 552, 520];
			
			draft.visible = false;
			
			salf.currentDraft = draft;
			
			// var newElement = myCanvas.currentDraft.addElement(
				// new elementProperty('3', 300, 125, 150, 100, 50, 100,0,0,0) //зелёный
			// );			

			// newElement.bg_color = '#00ff00';
			
			var newElement = myCanvas.currentDraft.addElement(
				new elementProperty('red', 200, 125, 200, 100, 50, 100,0,0,0) // красный
			);			

			newElement.bg_color = '#ff0000';
			
			var newElement = myCanvas.currentDraft.addElement(
				new elementProperty('blu', 250, 175, 175, 100, 50, 100,0,0,0) // синий
			);			

			newElement.bg_color = '#0000ff';
			
			// var newElement = myCanvas.currentDraft.addElement(
				// new elementProperty('4', 150, 125, 100, 100, 50, 100,0,0,0) //розовый
			// );			

			// newElement.bg_color = '#ff00ff';
			
			
			salf.setCurrentElement(salf.currentDraft);		
			
		} //--Времяночка..
		
	}
	
	function onWindowsResize(){
		
		salf.width = +$(selector).width();
		
		salf.height = +$(selector).height();
		
		snap.attr({width: salf.width, height: salf.height});

		salf.m = salf.width / 2; salf.n = salf.height / 2; salf.k = 0;
		
	}
	
	//..
	
	this.snap = function(){			// swg объект
		
		return snap;
		
	}
	
	this.recalculate = function(){	// пересчитать координаты

		if (salf.currentDraft == undefined) return;
	
		salf.surfaces.destroy();
	
		salf.currentDraft.recalculate();
		
		salf.addActionPoints();

	}
	
	this.repaint = function(){		// перерисовать элементы
		
		if (salf.currentDraft == undefined) return;
	
		salf.surfaces.display();
	
	}

	this.refresh = function(){		// пересчитать, перерисовать
		
		salf.recalculate();
		
		salf.repaint();
		
		mySubscriptions.notification(salf,'Обновление-отображения-элементов-карты');
		
	}

	//--
	
	this.addActionPoints = function(){	// Добавить точки действия
		
		return
		
		salf.clearActionPoint();
		
		if (salf.currentElement == undefined) return;

		if (salf.currentElement.visible == false) return;
		
		if ($("#ButtonActionPoint").prop("checked") == false) return
	
		salf.currentElement.faces.forEach(function(face){
			
			if (face.visible == salf.currentElement.faceVisible){
			
				var newActionPoint = new iaaActionPoint(salf.currentElement, face);
				
				myCanvas.actionPoints.push(newActionPoint);

				newActionPoint.recalculate();
				
			}
			
		});		
		
	}

	this.clearActionPoint = function(){	// Удалить точки действия
		
		salf.actionPoints.forEach(function(actionPoint){

			// actionPoint.snapElementsDestroy();

		});

		salf.actionPoints = [];
		
	}	

	//--
	
	this.setCurrentElement = function(ref){	// Установить текущий элемент
		
		if (salf.currentElement == ref) return;
		
		salf.currentElement = ref;

		myCanvas.refresh();
		
		mySubscriptions.notification
			(
			undefined,
			'Изменён-текущий-элемент-карты'
			);
		
	}

	this.notification_processing = function(source, event, options){ // Подписка на события
		
		if (event == 'Изменение-свойств-элемента-карты'){
			
			salf.refresh();
			
		} else if (event == 'Изменён-текущий-элемент-карты'){
			
			refresh_property_form();
			
			refresh_structure_form();
			
		} else if (event == 'Открыть-форму-свойства-элемента'){
			
			open_property_form();
			
		} else if (event == 'Закрыть-форму-свойства-элемента'){
			
			close_property_form();
			
		} else if (event == 'Открыть-форму-структура-проекта'){
			
			open_structure_form();
			
		} else if (event == 'Закрыть-форму-структура-проекта'){
			
			close_structure_form();
			
		} else if (event == 'Открыть-форму-добавления-элемента'){
			
			open_add_element_form(source);
			
		} else if (event == 'Открыть-форму-удаления-элемента'){
			
			open_delete_element_form();
			
		}
	
	}
	
	this.get_action_points_step = function(){
		
		return salf.actionPointsStep;
		
	}
	
	//-- 
	
	function scaleAddValue(value){			// Увеличить, уменьшить масштаб
		
		var [ScaleMin, ScaleMax, ScaleStep] = [0.1, 1.5, 0.1];	
		
		var newScale = salf.scale;
		
		if (value > 0){

			newScale = salf.scale - ScaleStep;
			
		}else{

			newScale = salf.scale + ScaleStep;

		}

		if (newScale >= ScaleMin && newScale <= ScaleMax){
		
			salf.scale = newScale;
			
			if (salf.scale == 0) salf.scale = 0.1;
		
			myCanvas.refresh();
			
		}
		
	}
	
	// form .....................
	
	function open_property_form(){
		
		var form = new dialog_form("property_form");
		
		form.option('caption', "Свойства элемента");
		
		if (!_.isUndefined(myCanvas.currentElement)){
			
			form.add_content(
				new input_string_field('prop_name')
					.add_option('caption', 'Название элемента')
					.add_option('caption_position', 'top')
					.add_option('data_object', myCanvas.currentElement)
					.add_option('data_name', 'name')
			);
			
			form.add_content(
				new input_number_field('prop_width')
					.add_option('caption', 'Ширина')
					.add_option('data_object', myCanvas.currentElement.sizes)
					.add_option('data_name', 0)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);
			
			form.add_content(
				new input_number_field('prop_height')
					.add_option('caption', 'Высота')
					.add_option('data_object', myCanvas.currentElement.sizes)
					.add_option('data_name', 1)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);
			
			form.add_content(
				new input_number_field('prop_depth')
					.add_option('caption', 'Глубина')
					.add_option('data_object', myCanvas.currentElement.sizes)
					.add_option('data_name', 2)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);
			
			// if (myCanvas.currentElement != myCanvas.currentDraft){
				
				form.add_content(
					new input_color_field('prop_bg_color')
						.add_option('caption', 'Фон')
						.add_option('data_object', myCanvas.currentElement)
						.add_option('data_name', 'bg_color')
				);					
				
				form.add_content(
					new input_number_field('prop_left')
						.add_option('caption', 'Лево')
						.add_option('data_object', myCanvas.currentElement.position)
						.add_option('data_name', 0)
						.add_option('text_center', true)
						.add_option('btn_subtract_step', true)
						.add_option('btn_add_step', true)
						.add_option('step_value', myCanvas.get_action_points_step)
				);

				form.add_content(
					new input_number_field('prop_up')
						.add_option('caption', 'Вверх')
						.add_option('data_object', myCanvas.currentElement.position)
						.add_option('data_name', 1)
						.add_option('text_center', true)
						.add_option('btn_subtract_step', true)
						.add_option('btn_add_step', true)
						.add_option('step_value', myCanvas.get_action_points_step)
				);

				form.add_content(
					new input_number_field('prop_front')
						.add_option('caption', 'Вперед')
						.add_option('data_object', myCanvas.currentElement.position)
						.add_option('data_name', 2)
						.add_option('text_center', true)
						.add_option('btn_subtract_step', true)
						.add_option('btn_add_step', true)
						.add_option('step_value', myCanvas.get_action_points_step)
				);
				
				// form.add_content(
					// new input_number_field('prop_torn_x')
						// .add_option('caption', 'Поворот x')
						// .add_option('data_object', myCanvas.currentElement.turn)
						// .add_option('data_name', 0)
						// .add_option('text_center', true)
						// .add_option('btn_subtract_step', true)
						// .add_option('btn_add_step', true)
						// .add_option('step_value', myCanvas.get_action_points_step)
				// );			

				// form.add_content(
					// new input_number_field('prop_torn_y')
						// .add_option('caption', 'Поворот y')
						// .add_option('data_object', myCanvas.currentElement.turn)
						// .add_option('data_name', 1)
						// .add_option('text_center', true)
						// .add_option('btn_subtract_step', true)
						// .add_option('btn_add_step', true)
						// .add_option('step_value', myCanvas.get_action_points_step)
				// );		
				
				// form.add_content(
					// new input_number_field('prop_torn_z')
						// .add_option('caption', 'Поворот z')
						// .add_option('data_object', myCanvas.currentElement.turn)
						// .add_option('data_name', 2)
						// .add_option('text_center', true)
						// .add_option('btn_subtract_step', true)
						// .add_option('btn_add_step', true)
						// .add_option('step_value', myCanvas.get_action_points_step)
				// );						
				
			// }
			
			form.add_content(
				new input_checkbox_field('prop_visible')
					.add_option('caption', 'Видимость элемента')
					.add_option('data_object', myCanvas.currentElement)
					.add_option('data_name', 'visible')
					.add_option('check_right', true)
			);			

			form.change = function(){
				
				mySubscriptions.notification(form,'Изменение-свойств-элемента-карты');
				
			};
			
			// подписка на события
			
			mySubscriptions.subscribe(form,'Обновление-отображения-элементов-карты');		
			
			form.notification_processing = function(source, event, options){
				
				if(event == 'Обновление-отображения-элементов-карты'){
					
					form.update_data_content();
					
				}
				
			}
		
			
		}
		
		// -----------------------
		
		form.open();
		
	}
	
	function refresh_property_form(){
		
		if (myForms.is_open("property_form")){
			
			open_property_form();
			
		}
	
	}
	
	function close_property_form(){
		
		new dialog_form("property_form").close();
		
	}	
	
	//....
	
	function open_structure_form(){
		
		var form = new dialog_form("structure_form");
		
		form.option('caption', "Элементы");

		{ // Дерево
			
			var wood = new wood_values('structure');
			
			wood.init_data = function(){
				
				var data_wood = new function(){
					
					var data = [];
					
					function fill(element){
						
						data.push({
							element: element,
							element_name: element.name,
							sizes: _.join(element.sizes, '*'),
							visible:  element.visible,
							active: element == myCanvas.currentElement
						});		
						
						if (_.isArray(element.elements) && element.elements.length > 0){
						
							for(var el of element.elements){
								
								fill(el);
								
							}
							
						}
						
					}

					fill(myCanvas.currentDraft);
					
					return data;
					
				};	
				
				wood.add_option('data_wood', data_wood);
			
			}
			
			wood.init_data();
			
			wood.add_column(
				new wood_column('element_name', 'text')
					.add_option("width", 'col-sm-7')
					.add_option("hierarchy", true)
					.add_option("cut-text", true)
					.add_option("ref", true)
			);
			
			wood.add_column(
				new wood_column('sizes', 'text')
					.add_option("width", 'col-sm-4')
					.add_option("cut-text", true)
					.add_option("smoll-text", true)
			);			
			
			wood.add_column(
				new wood_column('visible', 'checkbox')
					.add_option("width", 'col-sm-1')
			);		
			
			form.add_content( wood );	
			
			wood.on_activate_row = function(row, col){
				
				if (col.option('ref') === true){
					
					myCanvas.setCurrentElement(row.element);
				
				}
				
			}
			
			wood.on_change_value = function(row, col, value, value_before){

				if(col.option('name') == 'visible'){
					
					row.element.visible = row.visible;
					
					mySubscriptions.notification(form,'Изменение-свойств-элемента-карты');
					
				}

			}
			
		}
		
		form.add_content(
			new input_number_field('prop_step')
				.add_option('caption', 'Шаг')
				.add_option('data_object', myCanvas)
				.add_option('data_name', 'actionPointsStep')
				.add_option('text_center', true)
		);				
	
		// подписка на события
		
		mySubscriptions.subscribe(form,'Обновление-отображения-элементов-карты');		
		
		form.notification_processing = function(source, event, options){
			
			if(event == 'Обновление-отображения-элементов-карты'){
				
				form.update_data_content();
				
			}
			
		}
	
		form.open();	
		
	}
	
	function refresh_structure_form(){
		
		if (myForms.is_open("structure_form")){
			
			open_structure_form();
			
		}		
		
	}	
	
	function close_structure_form(){
		
		new dialog_form("structure_form").close();	
		
	}	
	
	//....
	
	function open_add_element_form(action_point_ref){
	
		var data_element = {};

		if (myCanvas.currentDraft == action_point_ref.parent) {
		
			data_element.name = 'Элемент';
			
			data_element.sizes = [100, 50, 100];
			
			data_element.bg_color = '#ffffff'; 
		
		}else{
			
			data_element.name = action_point_ref.parent.name;

			data_element.sizes = _.concat(action_point_ref.parent.sizes);
			
			data_element.bg_color = action_point_ref.parent.bg_color;
			
		}

		var form = new dialog_form("add_element_form");
		
		form.option('caption', "Добавление элемента");
		
		{ // Реквизиты
		
			form.add_content(
				new input_string_field('add_elem_prop_name')
					.add_option('caption', 'Название')
					.add_option('data_object', data_element)
					.add_option('data_name', 'name')
			);		
			
			form.add_content(
				new input_number_field('add_elem_prop_width')
					.add_option('caption', 'Ширина')
					.add_option('data_object', data_element.sizes)
					.add_option('data_name', 0)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);		
			
			form.add_content(
				new input_number_field('add_elem_prop_height')
					.add_option('caption', 'Высота')
					.add_option('data_object', data_element.sizes)
					.add_option('data_name', 1)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);		

			form.add_content(
				new input_number_field('add_elem_prop_depth')
					.add_option('caption', 'Глубина')
					.add_option('data_object', data_element.sizes)
					.add_option('data_name', 2)
					.add_option('text_center', true)
					.add_option('btn_subtract_step', true)
					.add_option('btn_add_step', true)
					.add_option('step_value', myCanvas.get_action_points_step)
			);				
		
			form.add_content(
				new input_color_field('add_elem_prop_bg_color')
					.add_option('caption', 'Фон')
					.add_option('data_object', data_element)
					.add_option('data_name', 'bg_color')
			);			
		
		}
		
		{ // Кнопки
			
			var buttons = [];

			// buttons.push({name: 'Отмена',    text: 'Отмена',    click: 'close',   data:{}});
			buttons.push({name: 'Сохранить', text: 'Создать', click: 'save',    data:{}});

			form.option("buttons", buttons);
			
			form.save = function(e){
				
				if (myCanvas.currentDraft == action_point_ref.parent){
					
					var [x, y, z] = action_point_ref.face.сentreValue;
					
				} else {
					
					var [px, py, pz] = action_point_ref.parent.position;
					
					var [cx, cy, cz] = action_point_ref.face.сentreValue;				

					var [x, y, z] = [px + cx, py + cy, pz + cz];
					
				}
				
				var w = data_element.sizes[0];
				
				var h = data_element.sizes[1];

				var d = data_element.sizes[2];
				
				var visibleSeeFace = action_point_ref.face.parent.faceVisible;
				
				var litter = action_point_ref.face.letter;
				
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
						new elementProperty(data_element.name, x, y, z, w, h, d,0,0,0)

					);			

				newElement.bg_color = data_element.bg_color;
					
				myCanvas.setCurrentElement(newElement);

				form.close();
				
			}
			
		}
		
		form.open();
	
	}
	
	function open_delete_element_form(){
		
		var form = new dialog_form("delete_element_form");
		
		var ref_current_element = myCanvas.currentElement;
		
		form.option('caption', "Удаление элемента");
		
		{ // Кнопки
			
			var buttons = [];
			
			buttons.push({name: 'Сохранить', text: 'Удалить', click: 'save',    data:{}});

			form.option("buttons", buttons);
			
			form.save = function(e){
				
				form.close();
				
				if (_.isUndefined(ref_current_element)) return;
				
				if (ref_current_element == myCanvas.currentDraft) return;
				
				ref_current_element.delete();
				
			}
			
		}
		
		form.open();
		
	}
	
	//.Tool.bar.........
	
	function createTopToolbar(){
		
		$('article').append( ' <div class=" iaa-top-toolbar iaa-toolbar text-center "></div> ' );
		
		var tolBar1 = new iaaTopIconToolBar('TopIconToolBar', '.iaa-top-toolbar'); 

		var group1 = tolBar1.addGroupButton('group1');

		var button1 = group1.addButton('ButtonPropertyElement', 'checkbox'); 

		var group2 = tolBar1.addGroupButton('MapCommandButton');

		var button2 = group2.addButton('ButtonSelectElement', 'radio'); 
		var button3 = group2.addButton('ButtonHand',			 'radio', true); 
		var button4 = group2.addButton('ButtonTurn',			 'radio'); 	

		//-------------
		
		var group3 = tolBar1.addGroupButton('group3');

		var button5 = group3.addButton('ButtonActionPoint', 'checkbox', true);

		var group4 = tolBar1.addGroupButton('ElementCommandButton');

		var button6 = group4.addButton('ButtonAddElement',		'radio', true);
		var button7 = group4.addButton('ButtonChangePosition',	'radio');
		var button8 = group4.addButton('ButtonChangeSize',		'radio');

		var group5 = tolBar1.addGroupButton('ActionPointTrendButton');

		var button9 = group5.addButton('ButtonTrendOutside', 'radio', true);	// Внутрь
		var button10 = group5.addButton('ButtonTrendInside', 'radio');	// Наружу

		var group6 = tolBar1.addGroupButton('group6');
		
		var button11 = group6.addButton('ButtonDeleteElement', 'button'); 		
		
		
		
		var group7 = tolBar1.addGroupButton('group7');
		
		var button12 = group6.addButton('ButtonStructure', 'checkbox'); 
		
		//------
		
		button1.click = function(e){
			
			if ($( button1._selector ).prop('checked')){
				
				mySubscriptions.notification(button1, 'Открыть-форму-свойства-элемента');
				
			}else{
				
				mySubscriptions.notification(button1, 'Закрыть-форму-свойства-элемента');
				
			}
			
		}
		
		mySubscriptions.subscribe(button1, 'Открыта-форма');
		
		mySubscriptions.subscribe(button1, 'Закрыта-форма');
		
		button1.notification_processing = function(source, event, options){
			
			if(event == 'Открыта-форма'){
				
				if(source.id == 'property_form'){
					
					$( button1._selector ).prop('checked', true);
					
				}
			
			}else if (event == 'Закрыта-форма'){
			
				if(source.id == 'property_form'){
					
					$( button1._selector ).prop('checked', false);
					
				}			
			
			}
			
		}		
		
		//------
		
		button2.click = function(e){leftToolBarSelectElement_onclick(e)}

		button3.click = function(e){leftToolBarHand_onclick(e)}

		button3.svg_mousemove = function(sx, sy){leftToolBarHand_svg_mousemove(sx, sy)}
		
		button4.click = function(e){leftToolBarTurn_onclick(e)}

		button4.svg_mousemove = function(sx, sy){leftToolBarTurn_svg_mousemove(sx, sy)}

		button5.click = function(e){rightToolBarActionPoint_onclick(e)}

		//------
		
		button11.click = function(e){
			
			if (myCanvas.currentElement == undefined || myCanvas.currentElement == myCanvas.currentDraft) {
			
				// rest
			
			}else{
			
				mySubscriptions.notification
					(
					undefined,
					'Открыть-форму-удаления-элемента'
					);

			}

			cancelEvent(e);		
			
		}
		
		//------
		
		button12.click = function(e){
			
			if ($( button12._selector ).prop('checked')){
				
				mySubscriptions.notification(button12, 'Открыть-форму-структура-проекта');
				
			}else{
				
				mySubscriptions.notification(button12, 'Закрыть-форму-структура-проекта');
				
			}
			
		}
		
		mySubscriptions.subscribe(button12, 'Открыта-форма');
		
		mySubscriptions.subscribe(button12, 'Закрыта-форма');
		
		button12.notification_processing = function(source, event, options){
			
			if(event == 'Открыта-форма'){
				
				if(source.id == 'structure_form'){
					
					$( button12._selector ).prop('checked', true);
					
				}
			
			}else if (event == 'Закрыта-форма'){
			
				if(source.id == 'structure_form'){
					
					$( button12._selector ).prop('checked', false);
					
				}			
			
			}
			
		}			
		
		//------
		
		salf.MapCommandButton = group2;
		salf.ElementCommandButton = group4;
		salf.ActionPointTrendButton = group5;
		
		//--------------------------------------
		
	}	
	
	function leftToolBarSelectElement_onclick(e){
		
		$("#svgout").css("cursor", "default")
		
	}

	function leftToolBarHand_onclick(e){
		
		$("#svgout").css("cursor", "url('images/hand.cur'), auto")
		
		//svg.activeButton = but;

	}

	function leftToolBarHand_svg_mousemove(sx, sy){
		
		if (salf._pressLeftMouseButton == true || salf._pressRightMouseButton == true){

			var m = salf.scale;

			var value = salf.currentDraft.position
			
			var [x, y, z] = value;

			value[0] = x + sx * m;
			value[1] = y + sy * m;

			myCanvas.refresh();

		}

	}

	function leftToolBarTurn_onclick(e){
		
		$("#svgout").css("cursor", "url('images/update.png'), auto")
		
		//svg.activeButton = but;
		
	}

	function leftToolBarTurn_svg_mousemove(sx, sy){
		
		if (salf._pressLeftMouseButton == true || salf._pressMouseWheel == true){
		
			salf.turn[0] = salf.turn[0] + (sy/4);
			salf.turn[1] = salf.turn[1] - (sx/4);
			
			myCanvas.refresh();
			
		}

	}

	function rightToolBarActionPoint_onclick(e){

		myCanvas.refresh();
		
	}
	
	//..........

	this.propertyOnChange = function(ref, name, value){
		
		ref[name] = value;
		
	}

	this.propertySizeOnChange = function(ref, name, value){
		
		if (name == 'x') ref.sizes[0] = value; 
		if (name == 'y') ref.sizes[1] = value; 
		if (name == 'z') ref.sizes[2] = value; 
		
		myCanvas.refresh();
		
	}

	this.propertyPositionOnChange = function(ref, name, value){
		
		if (name == 'x') ref.position[0] = value; 
		if (name == 'y') ref.position[1] = value; 
		if (name == 'z') ref.position[2] = value; 
		
		myCanvas.refresh();
		
	}

	//..........
	
	function refresh_gx_gy(deltaX, deltaY){
		
		var [sx, sy] = [0,0]
		
		if (salf._gx != undefined) {
			
			[sx, sy] = [deltaX - salf._gx, deltaY - salf._gy]
			
			// var step = 15;
			
			var step = 10;

			if ( (sx >= -step && sx <= step ) && (sy >= -step && sy <= step ) ) return undefined;

		}
		
		[salf._gx, salf._gy] = [deltaX, deltaY]
		
		return [sx, sy];
		
	}
	
	function clean_gx_gy(){
		
		var [sx, sy] = [0,0]
		
		salf._gx = undefined

		salf._gy = undefined
		
	}	
	
	function mapWheelMouse(e) {

		var i = new mauseWheelEvent(e)

		scaleAddValue(i.value);
		
		return cancelEvent(e);

	}

	function snapMouseDoun(e){
		
		if (e.which == 1) {
			
			salf._pressLeftMouseButton = true;
		
		} else if (e.which == 2){
			
			salf._pressMouseWheel = true;

			cancelEvent(e)
			
		} else if (e.which == 3){
			
			salf._pressRightMouseButton = true;

			cancelEvent(e)
			
		};
	
	}

	function snapMouseMove(e){
	
		if (e.which == 0){
			
			salf._pressRightMouseButton = false;

			salf._pressLeftMouseButton = false;

			salf._pressMouseWheel = false;
			
		} else if(salf._pressLeftMouseButton == true) {
			
			return; // тут будет работать хамер
			
		} else if(salf._pressMouseWheel == true){
			
			var values = refresh_gx_gy(e.clientX, e.clientY);
			
			if (values == undefined) return;
			
			var [sx, sy] = values;	
			
			leftToolBarTurn_svg_mousemove(sx * 1.5, sy * 1.5);
			
		} else if(salf._pressRightMouseButton == true){
			
			var values = refresh_gx_gy(e.clientX, e.clientY);
			
			if (values == undefined) return;
			
			var [sx, sy] = values;				
			
			leftToolBarHand_svg_mousemove(sx, sy);	
			
		}

	}

	function snapOnClick(e){
		
		salf.setCurrentElement(undefined);
		
	}	
	
	function snapMouseUp(e){

		if (e.which == 1){
			
			salf._pressLeftMouseButton = false
			
		} else if (e.which == 2){

			salf._pressMouseWheel = false
		
		} else if (e.which == 3){

			salf._pressRightMouseButton = false;

		}
		
		[salf._gx, salf._gy] = [undefined, undefined]
		
	}

	function snapMouseLeave(e){

		salf._pressLeftMouseButton = false;

		salf._pressMouseWheel = false;
		
		salf._pressRightMouseButton = false;

		[salf._gx, salf._gy] = [undefined, undefined]
		
	}

	// hammer //

	function loadHammer(elId){
		
		var stage = document.getElementById(elId);
		
		var jQustage = jQuery(stage);

		var manager = new Hammer.Manager(stage);

		var Pan = new Hammer.Pan();
		var Rotate = new Hammer.Rotate();		
		var Pinch = new Hammer.Pinch();
		var Tap = new Hammer.Tap({ taps: 1 });
		var DoubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });		
		
		Rotate.recognizeWith([Pan]);
		Pinch.recognizeWith([Rotate, Pan]);
		DoubleTap.recognizeWith([Tap]);
		Tap.requireFailure([DoubleTap]);		
		
		manager.add(Pan);
		manager.add(Rotate);
		manager.add(Pinch);
		manager.add(DoubleTap);
		manager.add(Tap);
		
		manager.on('panmove', function(e) {
	  
			salf._pressLeftMouseButton = true;
	   
			var values = refresh_gx_gy(e.deltaX, e.deltaY);
			
			if (values != undefined){
				
				var [sx, sy] = values;			
				
				salf.MapCommandButton.checkButton().svg_mousemove(sx*1.5, sy*1.5);

			};
		
		});
		
		manager.on('panend', function(e) {
			
			var values = refresh_gx_gy(e.deltaX, e.deltaY);
			
			if (values != undefined){
				
				var [sx, sy] = values;

				salf.MapCommandButton.checkButton().svg_mousemove(sx*1.5, sy*1.5);			

			};

			salf._pressLeftMouseButton = false;
			
			clean_gx_gy();
			
		});	
		
		manager.on('pinchmove', function(e) {

			var scale = (salf.scale * e.scale).toFixed(2);
			
			scaleAddValue((scale - salf.scale).toFixed(2));

		});

		manager.on('pinchend', function(e) {

			// var scale = (salf.scale * e.scale).toFixed(2);
			
			// scaleAddValue((scale - salf.scale).toFixed(2));

		});		
		
		manager.on('doubletap', function() {
		  
		  // var scale = $.Velocity.hook($stage, 'scale');
		  // if (isShrunken) {
		  //    $.Velocity.hook($stage, 'scale', 2 * scale);
		  // } else {
		  //    $.Velocity.hook($stage, 'scale', .5 * scale);
		  // }
		  // isShrunken = !isShrunken;
		
		});		
		
	}	
	
	//.........
	
 }

// Группа //

function iaaGroup(){
	
	var salf = this;

	{ // Инициализация свойств
	
		this.parent = undefined;			// родительский элемент

		this.name = 'Новый элемент';		// имя
		
		this.bg_color = '#ffffff';				// цвет фона
		
		this.visible = true;				// Видимость
		
		this.position = [0,0,0];			// позиция
		
		this.sizes = [0,0,0];				// размеры

		this.turn = [0,0,0];				// поворот
		
		
		this.сentreValue = [0,0,0];			// координаты центра элемента
		
		this.сentrePoint = [0,0,0,1];		// координаты точки центра элемента  
		
		this.depth = 0;						// глубина	
		
		this.points = [];					// точки
		
		this.faces = [];					// грани

		this.attributes = {};				// атрибуты

		this.elements = [];					// подчиненные элементы


		this.matrixVolume = [[],[],[],[]];	// матрица объема

		this.faceVisible = true;			// отображаемые грани (true - видимые, false - не видимые)

		this.gridVisible = false;			// отображать сетку

		this.gridStep = [50,50,50];			// шаг сетки

	}
	
	//...
	
	this.setProperty = function(prop){						// Установить свойства
		
		if (prop.name != undefined){
			
			salf.name = prop.name;
			
		}
		
		if (prop.position != undefined) {
			
			salf.position = [
				prop.position.x,
				prop.position.y,
				prop.position.z
			];
			
		};
		
		if (prop.sizes != undefined) {
			
			salf.sizes = [
				prop.sizes.w,
				prop.sizes.h,
				prop.sizes.d
			];
			
		};
		
		if (prop.turn != undefined) {
			
			salf.turn = [
				prop.turn.rx,
				prop.turn.ry,
				prop.turn.rz
			];
			
		};
		
	}
	
	this.recalculate = function(){							// Пересчитать
		
		var [w, h, d] = salf.sizes;

		// position..................
		
		var [x, y, z] = salf.getGlobalPosition();

		salf.сentreValue = [x + w/2,  y - h/2 ,  z - d/2]

		var [cx, cy, cz] = salf.сentreValue;			

		var [m, n, k] = salf.getTurnPointValua();
		
		// turn..................
		
		var [rx, ry, rz] = salf.turn;

		//.......................

		//----
		
		salf.matrixVolume = [[],[],[],[]];
	
		salf.сentrePoint
			= myGraphix.getCoordinatesPoint
				(
				salf, cx, cy, cz, m, n, k, rx, ry, rz
				);


		salf.depth
			= myGraphix.vectorFromObservationPointToPoint
				(
				[myCanvas.m, myCanvas.n, -10000],
				[salf.сentrePoint[0],
				 salf.сentrePoint[1],
				 salf.сentrePoint[2]]
				);
		
		//----
	
		salf.clearPoints();

		salf.addPoint(0, 0, 0, '8');			
		salf.addPoint(w, 0, 0, '7');
		salf.addPoint(w, 0, d, '6');
		salf.addPoint(0, 0, d, '5');

		salf.addPoint(0, h, 0, '4');
		salf.addPoint(w, h, 0, '3');
		salf.addPoint(w, h, d, '2');
		salf.addPoint(0, h, d, '1');
		
		//----
		
		salf.clearFaces();
		
		salf.addFace(2, 3, 7, 6, 'R');
		salf.addFace(1, 4, 8, 5, 'L');

		salf.addFace(5, 6, 7, 8, 'T');
		salf.addFace(1, 2, 3, 4, 'B');

		salf.addFace(1, 2, 6, 5, 'H');
		salf.addFace(4, 3, 7, 8, 'Y');
	
		salf.setVisibilityFaces();
		
		salf.pushVisibilityFacesInSurFace();
		
		salf.elements.forEach(function(element){
			
			element.recalculate();
			
		});
		
	}
	
	this.delete = function(){								// Удалить элемент
		
		salf.parent.deleteElement(salf);

		if (myCanvas.currentElement == salf){
			
			myCanvas.setCurrentElement(undefined);
			
		}
		
	}
	
	//---
	
	this.addElement = function(prop){						// Добавить вложенный элемент
		
		var newElement = new iaaЕlement(salf);
		
		this.elements.push(newElement);
		
		newElement.setProperty(prop);
		
		return newElement;
		
	}
	
	this.deleteElement = function(ref){						// Удалить вложенный элемент
		
		for (var i = 0; i < salf.elements.length; i++) {
			
			if (salf.elements[i] == ref){
				
				salf.elements.splice(i, 1);
				
				break;
				
			}
		
		}
		
	}
	
	//---
	
	this.addPoint = function(w, h, d, lit){					//Добавить точку
		
		var point = new iaaPoint(salf, w, h, d, lit);
		
		salf.points.push(point);
		
	}
	
	this.clearPoints = function(){							//Очистить точки
		
		for (var i = 0; i < salf.points.length; i++) {
		
			//this.Точки[i].ЭлементыКарты.remove()

		}
		
		salf.points = [];
		
	}
	
	//---

	this.addFace = function(np1, np2, np3, np4, lit){		// Добавить грань
		
		var face = new iaaFace(salf, np1, np2, np3, np4, lit);
		
		salf.faces.push(face);
		
		for (var i=0; i < 4; i++) {salf.matrixVolume[i].push(face.coeff[i])}
		
	}

	this.clearFaces = function(){							// Очистить грани

		salf.faces.forEach(function(face){

			face.SnapElementRemove();

		});

		salf.faces = [];

	}

	//---
	
	this.getGlobalPosition = function(){					// Получить глобальные координаты позиции
		
		if (salf.parent == undefined) {
			
			return salf.position;
			
		}else{
			
			var	[px, py, pz] = salf.parent.points[0].xyz;		
		
			var [x, y, z] = salf.position;

			x = px + x;

			y = py - y;

			z = pz - z;
			
			return [x, y, z];
			
		}
		
	}
	
	this.getTurnPointValua = function(){					// Получить значение точки поворота
		
		if (salf.parent == undefined) {
			
			return salf.сentreValue;
			
		}else{
			
			return salf.parent.сentreValue;
		
		}
		
	}	
	
	this.setVisibilityFaces = function(){					// Определить видимость граней
		
		//Приведём матрицу объема (тела) к корректному виду
		
		var S = salf.сentrePoint; // Точка точно должна находиться внутри элемента
		
		var V = salf.matrixVolume;
		
		var SV = myGraphix.multiplyPointByMatrix(S, V); // Умножить точку на матрицу
		
		for (var i = 0; i < 6; i++) { // Приводим матрицу объема(тела) к корректному виду, значения для точки внутри должны быть отрицательные

			if (SV[i]>0) {
				V[0][i] = V[0][i] * -1
				V[1][i] = V[1][i] * -1
				V[2][i] = V[2][i] * -1
				V[3][i] = V[3][i] * -1
			}
			
		}
		
		// Определим видимость грани
		
		var p1 = myGraphix.getCoordinatesPoint(salf, myCanvas.m, myCanvas.n, myCanvas.k,0,0,0,0,0,0); // Точна наблюдения
		
		var p2 = salf.сentrePoint;
		
		var F = [p1[0]-p2[0], p1[1]-p2[1], 10000000000, 0] //Вектор из центра элемента в точку наблюдения
		
		for (var i = 0; i < salf.faces.length; i++) {
		
			var FV = myGraphix.multiplyPointByMatrix(F, V);
			
			if (FV[i] <= 0) {salf.faces[i].visible = true}

		}
		
		
	}
	
	this.pushVisibilityFacesInSurFace = function(){			// Добавить грани в поверхности холста
		
		_.forEach(salf.faces, function(item){
		
			myCanvas.surfaces.add_surface(item);

		});
		
	}
	
}

// Грань //

function iaaFace(parentElement, np1, np2, np3, np4, lit){

	var salf = this;

	this.type = 'Грань'; // тип

 	this.parent = parentElement; // Родительский элемент	

 	this.letter = lit; 

	this.visible = false;

	this.points = [ // Точки грани
		parentElement.points[np1-1],
		parentElement.points[np2-1],
		parentElement.points[np3-1],
		parentElement.points[np4-1]
	];

	this.сentreValue // координаты центра элемента
		= myGraphix
			.getAverageCoordinatesOfpoints
				(
				//parentElement.position,
				parentElement.getGlobalPosition(),
				salf.points
				);

	this.depth = (
		salf.points[0].xyz1[2] +
		salf.points[1].xyz1[2] +
		salf.points[2].xyz1[2] +
		salf.points[3].xyz1[2]
	) / 4; // Глубина

	this.coeff = myGraphix.getCoefficientsPlane4(salf.points); // Коэффициенты плоскости

	this.thisConvexShape = myGraphix.thisConvexShape(salf.points) // Это выпуклая фигура

	this.snapElement = undefined;			// csg элемент
	
	this.display = function(){				// Отобразить грань

		salf.SnapElementRemove();

		var p1 = salf.points[0].xyz1
		var p2 = salf.points[1].xyz1
		var p3 = salf.points[2].xyz1
		var p4 = salf.points[3].xyz1

		if (!salf.displayed()) return

		salf.snapElement
			= myCanvas.snap()
				.polyline([
					[p1[0],p1[1]],
					[p2[0],p2[1]],
					[p3[0],p3[1]],
					[p4[0],p4[1]],
					[p1[0],p1[1]]
				]);

		salf.snapElement.attr({'stroke': 'black'});

		salf.snapElement.attr({"stroke-width": 2});

		salf.snapElement.attr({'fill':salf.parent.bg_color});

		salf.snapElement.attr({'fill-opacity':myCanvas.bg_alfa});

		salf.parent.snapElements.add(salf.snapElement)

		salf.displayGrid();

	}
	
	this.displayGrid = function(){			// Отобразить сетку
	
		if (salf.parent.gridVisible != true) return
		
		var [x, y, z] = salf.parent.position;	
		
		var [cx, cy, cz] = salf.parent.сentreValue;			

		var [m, n, k] = salf.parent.getTurnPointValua();

		var [rx, ry, rz] = salf.parent.turn;
		

		var SettingsDisplayGrid = [];		// Настройки отображения сетки
		
		if(salf.letter == 'R' || salf.letter == 'L'){
			
			SettingsDisplayGrid.push({'S':1,'Z':-1,'P':[0,1,3,2]})	//Y
			SettingsDisplayGrid.push({'S':2,'Z':-1,'P':[0,3,1,2]})	//Z
			
		}else if(salf.letter == 'B' || salf.letter == 'T'){	

			SettingsDisplayGrid.push({'S':0,'Z':1,'P':[3,0,2,1]})	//X
			SettingsDisplayGrid.push({'S':2,'Z':-1,'P':[0,1,3,2]})	//Z
			
		}else if(salf.letter == 'H' || salf.letter == 'Y'){	
		
			SettingsDisplayGrid.push({'S':0,'Z':1,'P':[0,3,1,2]})	//X
			SettingsDisplayGrid.push({'S':1,'Z':-1,'P':[0,1,3,2]})	//Y
			
		}else{
			
			return
			
		}

		for(var i=0; i < SettingsDisplayGrid.length; i++){

			var p1 = salf.points[SettingsDisplayGrid[i].P[0]].xyz.slice()
			var p2 = salf.points[SettingsDisplayGrid[i].P[1]].xyz.slice()
			var p3 = salf.points[SettingsDisplayGrid[i].P[2]].xyz.slice()
			var p4 = salf.points[SettingsDisplayGrid[i].P[3]].xyz.slice()

			var stepGrid  = SettingsDisplayGrid[i].S	// Номер оси величины шага

			var signGrid = SettingsDisplayGrid[i].Z 	// Знак шага

			while (p1[stepGrid] * signGrid < p4[stepGrid] * signGrid && p2[stepGrid]*signGrid < p3[stepGrid] * signGrid) {

				var step = [0,0,0]

				step[stepGrid] = salf.parent.gridStep[stepGrid] * signGrid

				p1 = [p1[0] + step[0], p1[1] + step[1], p1[2] + step[2]];

				p2 = [p2[0] + step[0], p2[1] + step[1], p2[2] + step[2]];
				
				if (p1[stepGrid] * signGrid >= p4[stepGrid] * signGrid && p2[stepGrid] * signGrid >= p3[stepGrid] * signGrid) continue

				var pa = myGraphix.getCoordinatesPoint(salf.parent, p1[0], p1[1], p1[2], m, n, k, rx, ry, rz);	

				var pв = myGraphix.getCoordinatesPoint(salf.parent, p2[0], p2[1], p2[2], m, n, k, rx, ry, rz);	

				salf.parent.snapElements.add(myGraphix.createLine(pa, pв, salf.parent.attributes.stroke, salf.parent.attributes['stroke-width']));

			}

		}

	}

	this.displayed = function(){			// Отображаемая грань
		
		return salf.parent.visible && salf.visible == salf.parent.faceVisible;
		
	}
	
	this.SnapElementRemove = function(){	// удалить csg элемент

		// Эту процедуру пока оставил временно,
		// в последствии надо будет удалить. 

		return 

		if (salf.snapElement == undefined) return

		salf.snapElement.remove();

		salf.snapElement = undefined;

	}

 }

// Точка //

function iaaPoint(parentElement, w, h, d, lit){
 
	var salf = this;
	
	this.type = 'Точка'; // тип
 
 	this.parent = parentElement; // Родительский элемент
	
	this.letter = lit;
	
	this.visible = true;
	
	var [x, y, z] = salf.parent.getGlobalPosition();
	
	var [m, n, k] = salf.parent.getTurnPointValua();

	var [rx, ry, rz] = salf.parent.turn;
	
	this.xyz = [x + w,  y - h ,  z - d];
	
	this.xyz1
		= myGraphix.getCoordinatesPoint
			(
			salf.parent,
			salf.xyz[0],
			salf.xyz[1],
			salf.xyz[2], m, n, k, rx, ry, rz
			); 

	this.display = function(){		// Отобразить точку
		
		// myGraphix.getAverageCoordinatesOfpoints(salf.xyz1, 5, 'blue', 'yellow', 1, salf.parent);
		
	}

 } 
 
// Проект //

function iaaDraft(name, w, h, d){
	
	var salf = this;
	
	iaaGroup.apply(this, arguments);
	
	this.type = 'Проект'; // тип

	this.name = name;
	
	this.bg_color = '#008000';
	
	this.attributes = {'stroke': 'black', 'stroke-width': 1}
	
	this.sizes = [w, h, d];	// размеры	
	
	this.faceVisible = false;
	
	this.gridVisible = true;
	
 }

// Элемент //

function iaaЕlement(parentElement){
	
	var salf = this;
	
	iaaGroup.apply(this, arguments);
	
	this.type = 'Элемент'; // тип

	this.parent = parentElement; // родительский элемент
	
	this.attributes = {'stroke': 'black', 'stroke-width': 1}

	// this.gridVisible = true;
	
	// this.gridStep = [25,25,25];	
	
 }

// Поверхности //

function iaaSurFaces(){
	
	var salf = this;
	
	var surfaces = [];
	
	var snap_elements = [];
	
	function sort_face(){
		
		surfaces.sort(function(i, j){
			
			var p1 = {x:myCanvas.m, y:myCanvas.n, z:1000};		

			if (i.element == j.element) return 0;
			
			for (var item of j.points){
				
				var p2 = {x:item.x, y:item.y, z:item.z};
				
				var p3 = myGraphix.intersectionSegmentAndPlane(i, p1, p2);
				
				console.log(i.element.name, i.face.letter, ' => ', j.element.name, j.face.letter, '(', i.element.name,')');
				
				if (!_.isUndefined(p3) && !myGraphix.points_equal(p2, p3) && myGraphix.pointBelongsRange(i.lines, p3)){
					
					myGraphix.createLine([p1.x,p1.y], [p2.x, p2.y], 'blue', 1);
					
					myGraphix.createСircle([p3.x, p3.y], 3, 'blue', 'blue', 1);
				
					return 1;
					
				// }else{
					
					// return 0;
					
				}
				
			};
		
			for (var item of i.points){
				
				var p2 = {x:item.x, y:item.y, z:item.z};
				
				var p3 = myGraphix.intersectionSegmentAndPlane(j, p1, p2);
				
				console.log(i.element.name, i.face.letter, ' => ', j.element.name, j.face.letter, '(', j.element.name,')');
				
				if (!_.isUndefined(p3) && !myGraphix.points_equal(p2, p3) && myGraphix.pointBelongsRange(i.lines, p3)){
					
					myGraphix.createLine([p1.x,p1.y], [p2.x, p2.y], 'red', 1);
				
					myGraphix.createСircle([p3.x, p3.y], 3, 'red', 'red', 1);
				
					return -1;
					
				}
				
			};		
		
		});
		
	}
	
	function snap_element_click(e, element){

		if (myCanvas.MapCommandButton.checkButton()._name == 'ButtonSelectElement') {
		
			myCanvas.setCurrentElement(element);
		
		}	

		e.stopPropagation(); // Прекратить всплывание

	}	
	
	function snap_element_destroy(){
		
		// _.forEach(snap_elements, function(snap_element){
			
			// console.log(snap_element);
			
			// snap_element.snapElements.clear();
			
			// snap_element.snapElements.remove();
			
			myCanvas.snap().clear();
			
		// });		
	
	}	
	
	this.add_surface = function(iaaFace){
		
		if (!iaaFace.displayed()) return
	
		// if (
			// !(iaaFace.letter == 'T' && iaaFace.parent.name == 'red')
			// &&
			// !((iaaFace.letter == 'Y' || iaaFace.letter == 'Y') && iaaFace.parent.name == 'blu')
		// ) return
		
		// if (
			// !((iaaFace.letter == 'B' || iaaFace.letter == 'T') && iaaFace.parent.name == 'red')
			// &&
			// !((iaaFace.letter == 'B' || iaaFace.letter == 'T') && iaaFace.parent.name == 'blu')
		// ) return

		// if (
			// !(iaaFace.letter == 'R' && iaaFace.parent.name == 'red')
			// &&
			// !(iaaFace.letter == 'Y' && iaaFace.parent.name == 'blu')
		// ) return		
		
		var arr_point = [];
		
		_.forEach(iaaFace.points, function(item){
		
			arr_point.push(
				myGraphix.get_point(
					item.xyz1[0],
					item.xyz1[1],
					item.xyz1[2],
					myCanvas.m,
					myCanvas.n,
					0
				)
			);
			
		});
		
		var surface = myGraphix.get_surface(arr_point);
		
		surface.element = iaaFace.parent;
		
		surface.face = iaaFace;
		
		surface.depth_e = _.round(iaaFace.parent.depth, 3);
		
		surface.depth = _.round(iaaFace.depth, 3);
		
		surfaces.push(surface);
		
	}
	
	this.destroy = function(){
		
		surfaces = [];
		
	}

	this.display = function(){
	
		snap_element_destroy();
	
		display1();
		
		return;

		sort_face();	

		myGraphix.createСircle([myCanvas.m, myCanvas.n], 3, 'black', 'black', 1);
		
		var stroke_width = 1;

		var fill_opacity = 0.5;
		
		_.forEach(surfaces, function(surface){
			
			var snap_element = myCanvas.snap().polyline(surface.xy);
		
			snap_element.click(function(e){snap_element_click(e, surface.element)});
			
			// snap_element.attr({'stroke': 'black'});
			snap_element.attr({'stroke': surface.element.bg_color});

			snap_element.attr({"stroke-width": 1});
			// snap_element.attr({"stroke-width": stroke_width});

			// snap_element.attr({'fill-opacity': 1});
			snap_element.attr({'fill-opacity': fill_opacity});

			snap_element.attr({'fill':surface.element.bg_color});
			
			stroke_width += 2;
			
			fill_opacity += 0.1;
			
			//......................
			
			surface.snap_element = myCanvas.snap().g();
			
			snap_elements.push(surface.snap_element);
			
			surface.snap_element.add(snap_element);	
			
			//......................
			
			_.forEach(surface.points, function(point){
				
				// console.log('name', surface.element.name, 'z', point.y);
				
				// myGraphix.createLine([point.x,point.y], [myCanvas.m, myCanvas.n], 'red', 1);
				
				// console.log(surface.element.name,'d:',point.d);
				
				// myGraphix.createText([point.x, point.y], _.round(point.d), 'black');
				
				// if (point.d ==  surface.max_d){

					// var color = 'red';
				
					// if (surface.element.name == 'blu') color = 'blue';

					// myGraphix.createСircle([point.x, point.y], 3, color, color, 1);

					// myGraphix.createLine([point.x,point.y], [myCanvas.m, myCanvas.n], 'black', 2);				
					
				// }
				
			});
			
			// console.log(surface.element.name,surface.face.letter,'m:',surface.max_d);
			
			//......................
			
		});
		
	}
	
	function display1(){
		
		var draft = myCanvas.currentDraft;
		
		// Координаты точки поворота.
		
		var m = draft.сentreValue[0]; 
		
		var n = draft.сentreValue[1];
		
		var k = draft.сentreValue[2];
		
		// Координаты смещения
		
		var d_x = draft.position[0] - 150;

		var d_y = draft.position[1] - 300;
		
		var d_z = draft.position[2];
		
		{// Рисуем прямоугольники синий
		
			var color = 'blue';
			
			var p1 = myGraphix.getCoordinatesPoint(draft, 600 + d_x, d_y - 100, d_z - 100, m, n, k, 0, 0, 0);
			var p2 = myGraphix.getCoordinatesPoint(draft, 300 + d_x, d_y - 100, d_z - 100, m, n, k, 0, 0, 0);
			var p7 = myGraphix.getCoordinatesPoint(draft, 300 + d_x, d_y + 100, d_z - 400, m, n, k, 0, 0, 0);
			var p8 = myGraphix.getCoordinatesPoint(draft, 600 + d_x, d_y + 100, d_z - 400, m, n, k, 0, 0, 0);
			
			p1 = myGraphix.get_point(p1[0],p1[1],p1[2]);
			p2 = myGraphix.get_point(p2[0],p2[1],p2[2]);
			p7 = myGraphix.get_point(p7[0],p7[1],p7[2]);
			p8 = myGraphix.get_point(p8[0],p8[1],p8[2]);

		}

		{// Рисуем прямоугольники красный
		
			var color = 'red';
			
			var p5 = myGraphix.getCoordinatesPoint(draft, 200 + d_x, d_y - 100, d_z - 400, m, n, k, 0, 0, 0);
			var p6 = myGraphix.getCoordinatesPoint(draft, 500 + d_x, d_y - 100, d_z - 400, m, n, k, 0, 0, 0);
			var p3 = myGraphix.getCoordinatesPoint(draft, 500 + d_x, d_y + 100, d_z - 100, m, n, k, 0, 0, 0);
			var p4 = myGraphix.getCoordinatesPoint(draft, 200 + d_x, d_y + 100, d_z - 100, m, n, k, 0, 0, 0);
			
			p5 = myGraphix.get_point(p5[0],p5[1],p5[2]);		
			p6 = myGraphix.get_point(p6[0],p6[1],p6[2]);		
			p3 = myGraphix.get_point(p3[0],p3[1],p3[2]);
			p4 = myGraphix.get_point(p4[0],p4[1],p4[2]);

		}

		
		var blue_fase = myGraphix.get_surface([p1,p2,p7,p8]);
		
		blue_fase.ref = '1';
		blue_fase.color = 'blue';

		var red_fase = myGraphix.get_surface([p5,p6,p3,p4]);
		
		red_fase.ref = '2';
		red_fase.color = 'red';
		
		console.clear();		
		
		var fases = [blue_fase, red_fase];
		
		/////////////////////////////////////////////////////////
		// 1. Линая пересечение поверхностей
		
		var p_intersection = [];
		
		fases.sort(function(f1, f2){

			for (var line of f2.lines){
				
				var p = myGraphix.intersectionSegmentAndPlane(f1, line.p1, line.p2);
				
				if (p == undefined) continue

				p_intersection.push(p);
				
				// myGraphix.createСircle([p.x, p.y], 3, 'black', 'black', 1);	
				
				// myGraphix.createText([p.x + 10, p.y], '('+_.round(p.x, 0) +', '+_.round(p.y, 0) +', '+_.round(p.z, 0)+')', 'black');
				
			}				
			
		});
		
		var line_intersection = myGraphix.get_line(p_intersection[0], p_intersection[1]);
		
		// line_intersection.display(myCanvas.snap());
		
		/////////////////////////////////////////////////////////
		// Разбиение на подграни
		
		var fases1 = [];
		var global_line = [];
		var global_point = [];
		
		var iter = 0;
		
		for (var fase of fases){
	
			var pov = {true:[],false:[]}, current = false; 
	
			for (var line of fase.lines){
				
				pov[current].push(line.p1);				
				
				var p = myGraphix.getPointIntersectionLine(line, line_intersection);

				if (p == undefined) {console.log(line, undefined); continue}
				
				var bline1 = myGraphix.pointBelongsLineXYZ(line, p);

				if (bline1 == true){
				
					p.virtual = true;
				
					pov[current].push(p); current = !current; pov[current].push(p);

				};
			
			}
		
				var new_fase = myGraphix.get_surface(pov[true]);
		
				new_fase.ref = fase.ref;

				if (new_fase.ref == '2'){		

					new_fase.color = fase.color; fases1.push(new_fase);
					
				}

				if (pov[false].length != 0){

					new_fase = myGraphix.get_surface(pov[false]);
				
					new_fase.ref = fase.ref;

					if (new_fase.ref == '1'){

						new_fase.color = fase.color; fases1.push(new_fase);
						
					}
					
				}			

		}

		/////////////////////////////////////////////////////////
		// Определение очерёдности
		
		var p_g = myGraphix.get_point(myCanvas.m, myCanvas.n, -1000);
		
		var max_i = Math.floor(fases1.length/2);
		
		for (var i = 0; i < fases1.length; i++) {

			for (var j = i + 1; j < fases1.length; j++) {
				
				var A = fases1[i], B = fases1[j];
				
				var rez = compare_fase(A, B);
				
				if (rez == 1){
					
					fases1[i] = B;
					fases1[j] = A;

				}
				
			}
			
			if (i == max_i) break;
			
		}
	
		function compare_fase(A,B){
			
			if (A.ref == B.ref) return 0;
			
			for (var lineA of A.lines){

				for (var lineB of B.lines){

					var p = myGraphix.getPointIntersectionLine(lineA, lineB);

					if (p == undefined) continue;
					
					var bline1 = myGraphix.pointBelongsLineXY(lineA, p);
					var bline2 = myGraphix.pointBelongsLineXY(lineB, p);
					
					// if (A.ref == 1 && lineA.n == 1 && B.ref == 2 && lineB.n == 1){
						
						// var bline1 = myGraphix.pointBelongsLineXY(lineA, p);
						// var bline2 = myGraphix.pointBelongsLineXY(lineB, p);

						// console.log(bline1, bline2, A.ref, lineA.n, B.ref, lineB.n);
						
					// }
					
					if (bline1 == true && bline2 == true){

						var lineg = myGraphix.get_line(p_g, p);

						global_line.push(lineg);

						var pA = myGraphix.intersectionSegmentAndPlane(A, p_g, p);

						var pB = myGraphix.intersectionSegmentAndPlane(B, p_g, p);
						
						// if (A.ref == 1 && lineA.n == 1 && B.ref == 2 && lineB.n == 1){

							// var pA = myGraphix.intersectionSegmentAndPlane(A, p_g, p);

							// var pB = myGraphix.intersectionSegmentAndPlane(B, p_g, p);

							//global_point.push({x:p.x, y:p.y, z:p.z, color: 'red'});
							
							// console.log(pA, pB);

						// }
						
						// continue

						
						
						
						
						if (pA == undefined && pB == undefined) {

							continue;

						}else if (pA == undefined && pB != undefined){

							// Та грань которая пересекается лежит ближе
						
							global_point.push({x:pB.x, y:pB.y, z:pB.z, color: B.color});

							return 0;
							
						}else if (pA != undefined && pB == undefined){

							// Та грань которая пересекается лежит ближе
						
							global_point.push({x:pA.x, y:pA.y, z:pA.z, color: A.color});

							return 1;
							
						}else if (pA != undefined && pB != undefined){

							// Определяем по координате z та что меньше та ближе
						
							global_point.push({x:pA.x, y:pA.y, z:pA.z, color: A.color});

							global_point.push({x:pB.x, y:pB.y, z:pB.z, color: B.color});
							
							if (_.round(pA.z, 0) == _.round(pA.z, 0)){
								
								continue;
								
							}else{
								
								if(pA.z > pB.z){
									
									return 0;
									
								}else{
									
									return 1;
									
								}
								
							}
							
						}

					}
					
				}

			}
		
			return 0;
		
		}
	
		/////////////////////////////////////////////////////////
		// Вывод на экран

		for (var fase of fases1){

			fase.display(myCanvas.snap());

		}

		for (var line of global_line){

			line.display();

		}

		for (var point of global_point){

			myGraphix.createСircle([point.x, point.y], 3, 'black', point.color, 1);

			myGraphix.createText([point.x + 10, point.y], '('+_.round(point.z, 0)+')', 'black');

		}

	}

}
 
// Точка действия //

function iaaActionPoint(element, face){
	
	var salf = this;
	
	iaaGroup.apply(this, arguments);
	
	this.type = 'Точка действия'; // тип

	this.parent = element; // Родительский элемент
	
	this.face = face; // Родительская грань
	
	this.letter = face.letter;
	
	this.bg_color = '#ffff00';

	{	// Рассчет свойств
		
		var dimension = 14;			// Размер
		
		var visibleSeeFace = salf.parent.faceVisible;
		
		var [x, y, z] = salf.face.сentreValue;
		
		var [w, h, d] = [dimension, dimension, dimension];
		
		if (visibleSeeFace){
			
			if (salf.letter == 'R'){
				
				salf.bg_color = '#0000ff'; // синий
				
				w = w/4;
			
				y -= h/2;
				z -= d/2;

			}else if (salf.letter == 'L'){	

				salf.bg_color = '#0000ff'; // синий
				
				w = w/4;
			
				x -= w;
				y -= h/2;
				z -= d/2;

			}else if (salf.letter == 'T'){

				salf.bg_color = '#ff0000'; // красный
			
				h = h/4;
			
				x -= w/2;
				z -= d/2;

			}else if (salf.letter == 'B'){
			
				// salf.bg_color = '#ff0000'; // красный

				h = h/4;
			
				x -= w/2;
				y -= h;
				z -= d/2;

			}else if (salf.letter == 'H'){

				salf.bg_color = '#00ff00'; // зелёный
			
				d = d/4;
			
				x -= w/2;
				y -= h/2;
				z -= d;

			}else if (salf.letter == 'Y'){	
			
				salf.bg_color = '#00ff00'; // зелёный

				d = d/4;
			
				x -= w/2;
				y -= h/2;

			}

		}else{
		
			if (salf.letter == 'R'){

				w = w/4;
			
				x -= w;
				y -= h/2;
				z -= d/2;

			}else if (salf.letter == 'L'){	

				w = w/4;
			
				y -= h/2;
				z -= d/2;
		
			}else if (salf.letter == 'T'){

				h = h/4;
			
				x -= w/2;
				y -= h;
				z -= d/2;

			}else if (salf.letter == 'B'){	
			
				h = h/4;
			
				x -= w/2;
				z -= d/2;

			}else if (salf.letter == 'H'){

				d = d/4;
			
				x -= w/2;
				y -= h/2;

			}else if (salf.letter == 'Y'){	

				d = d/4;
				
				x -= w/2;
				y -= h/2;
				z -= d;

			}

		}

	} 
	
	this.onClick = function(){
		
		if (myCanvas.MapCommandButton.checkButton()._name != 'ButtonSelectElement') { return }
		
		if (myCanvas.ElementCommandButton.checkButton()._name == 'ButtonAddElement'){
			
			mySubscriptions.notification(salf,'Открыть-форму-добавления-элемента');

		}else{
		
			if (myCanvas.currentDraft == salf.parent) { return }
		
			var changeSizes = [];
			
			var changePosition = [];
		
			var trend = salf.getStepChange();
		
			if(myCanvas.ElementCommandButton.checkButton()._name == 'ButtonChangePosition'){ // Изменение позиции
			
				if (salf.letter == 'R'){ //x

					changePosition.push({property: 0, trend: trend * 1});

				}else if (salf.letter == 'L'){ //x

					changePosition.push({property: 0, trend: trend * -1});

				}else if (salf.letter == 'T'){ //y

					changePosition.push({property: 1, trend: trend * 1});

				}else if (salf.letter == 'B'){ //y
					
					changePosition.push({property: 1, trend: trend * -1});

				}else if (salf.letter == 'Y'){ //z	

					changePosition.push({property: 2, trend: trend});
				
				}else if (salf.letter == 'H'){ //z

					changePosition.push({property: 2, trend: trend * -1});				
				
				}
			
			}else if(myCanvas.ElementCommandButton.checkButton()._name == 'ButtonChangeSize'){	// Изменение размера
		
				if (salf.letter == 'R'){ //x

					changeSizes.push({property: 0, trend: trend * 1});

				}else if (salf.letter == 'L'){ //x

					changeSizes.push({property: 0, trend: trend * 1});
					changePosition.push({property: 0, trend: trend * -1});

				}else if (salf.letter == 'T'){ //y

					changeSizes.push({property: 1, trend: trend * 1});

				}else if (salf.letter == 'B'){ //y
					
					changeSizes.push({property: 1, trend: trend * 1});					
					changePosition.push({property: 1, trend: trend * -1});

				}else if (salf.letter == 'Y'){ //z	

					changeSizes.push({property: 2, trend: trend});
				
				}else if (salf.letter == 'H'){ //z

					changeSizes.push({property: 2, trend: trend});				
					changePosition.push({property: 2, trend: trend * -1});				
				
				}
				
			}
			
			changePosition.forEach(function(change){
				
				salf.parent.position[change.property]
					= salf.parent.position[change.property]
					+ change.trend * myCanvas.actionPointsStep;
				
			});
			
			changeSizes.forEach(function(change){
				
				salf.parent.sizes[change.property]
					= salf.parent.sizes[change.property]
					+ change.trend * myCanvas.actionPointsStep;
				
			});
			
			myCanvas.refresh();
			
		}

	}
	
	this.getStepChange = function(){
		
		if(myCanvas.ActionPointTrendButton.checkButton()._name == 'ButtonTrendInside'){
			
			return -1;
			
		}else if (myCanvas.ActionPointTrendButton.checkButton()._name == 'ButtonTrendOutside'){
			
			return 1;
			
		} else {
			
			return 0;
			
		}
		
	}
	
	salf.setProperty(
	
		new elementProperty(salf.face.letter, x, y, z, w, h, d, 0, 0, 0)
	
	);

}

// Времяночка //

function elementProperty(name, x, y, z, w, h, d, rx, ry, rz){
	
	var salf = this;

	this.name = name;
	
	this.position = {'x':x,'y':y,'z':z};
	this.sizes = {'w':w,'h':h,'d':d};
	this.turn = {'rx':rx,'ry':ry,'rz':rz};
	
}
	