"use strict"

var myGraphix = new iaaGraphixs(); 

var myCanvas = new iaaCanvas();

// Холст //

function iaaCanvas(){
	
	var salf = this;
	
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
	
	this.m = 0;				// половина ширины
	
	this.n = 0;				// половина высоты
	
	this.k = 0;				// поидее половина глубины, но всегда 0
	
	this.turn = [0,0,0];	// поворот

	this.scale = 0.60; 		// масштаб
	
	this.currentElement = undefined;		// текущий элемент
	
	this.currentDraft = undefined;			// текущий проект

	this.actionPoints = {points:[]};		// точки действия	
	
	this.formPropertyElement = undefined;	// форма свойств элемента
	
	
	var _attributes = {};				// атрибуты
	
	$(document).ready(function (){onDocumentLoad()});
	
	$(window).resize(function(){onWindowsResize()});

	function onDocumentLoad(){
		
		$('article').append(' <svg id="'+idForm+'"></svg> ');  
		
		//..
		
		$(selector).mouseover(function(){setHookMouseWheel(this, mapWheelMouse, 1)});
		$(selector).mouseout(function(){setHookMouseWheel(this, mapWheelMouse)});
		
		$(selector).mousemove(function(e){snapMouseMove(e)});
		$(selector).mouseup(function(e){snapMouseUp(e)});
		$(selector).mousedown(function(e){snapMouseDoun(e)});
		$(selector).mouseleave(function(e){snapMouseLeave(e)});
		
		$(selector).click(function(e){snapOnClick(e)});
		
		//..
		
		// var elementHammertime = document.getElementById(idForm);
		
		// var hammertime = new Hammer(elementHammertime);
		
		// hammertime.on('pan', function(ev) {snapMouseMoveHamer(ev)});
		
		//..
		
		createToolbar()
		
		//..

		snap = Snap(selector);
		
		snap.attr({fill: "#fff", "stroke-width": "1px"});
		
		onWindowsResize();
		
		// ++ Времяночка..
		
		salf.currentDraft = new iaaDraft('Новый проект', 600, 300, 400);
		
		salf.currentDraft.addElement(
		
			new elementProperty('Новый Элемент 1', 300, 0, 0, 100, 100, 50,0,0,0)

		);

		salf.currentDraft.addElement(
			
			new elementProperty('Новый Элемент 2', 120, 50, 50, 100, 10, 150,0,0,0)
		
		);

		salf.recalculate();
		
		salf.repaint();
		
		//--Времяночка..
		
	}
	
	function onWindowsResize(){
		
		salf.width = +$(selector).width();
		
		salf.height = +$(selector).height();
		
		snap.attr({width: salf.width, height: salf.height});

		salf.m = salf.width / 2; salf.n = salf.height / 2; salf.k = 0;
		
		//snap.rect(0, 0, salf.width, salf.height);		

	}
	
	//..
	
	this.snap = function(){			// swg объект
		
		return snap;
		
	}
	
	this.recalculate = function(){	// пересчитать координаты

		if (salf.currentDraft == undefined) return;
	
		salf.currentDraft.recalculate();
	
	}
	
	this.repaint = function(){		// перерисовать элементы
		
		if (salf.currentDraft == undefined) return;
	
		salf.currentDraft.repaint();
	
	}

	this.setCurrentElement = function(ref){	// Установить текущий элемент
		
		salf.currentElement = ref;
		
		if (salf.currentElement == undefined){
			
			if (salf.formPropertyElement != undefined) {
		
				salf.formPropertyElement.destroy();
				
				salf.formPropertyElement = undefined;
		
			}
			
		} else {
			
			// if (salf.formPropertyElement != undefined) {
		
				// salf.formPropertyElement.open(ref);
		
			// }	
			
		}
		
	}
	
	//.Tool.bar.........
	
	function createToolbar(){
		
		var tolBar1 = new iaaVerticalToolBar('leftToolBar', 'aside.left'); 

		var group11 = tolBar1.addGroupButton('group11');

		var button111 = group11.addButton('ButtonPropertyElement', 'button'); 

		var group12 = tolBar1.addGroupButton('MapCommandButton');

		var button122 = group12.addButton('ButtonSelectElement', 'radio'); 
		var button123 = group12.addButton('ButtonHand',			 'radio'); 
		var button124 = group12.addButton('ButtonTurn',			 'radio'); 	
		
		var tolBar2 = new iaaVerticalToolBar('rightToolBar',	 'aside.right'); 

		var group21 = tolBar2.addGroupButton('group21');

		var button211 = group21.addButton('ButtonActionPoint', 'checkbox');

		var group22 = tolBar2.addGroupButton('ElementCommandButton');

		var button222 = group22.addButton('ButtonAddElement',		'radio');
		var button223 = group22.addButton('ButtonChangePosition',	'radio');
		var button224 = group22.addButton('ButtonChangeSize',		'radio');

		var group23 = tolBar2.addGroupButton('ActionPointTrendButton');

		var button235 = group23.addButton('button235', 'radio');
		var button236 = group23.addButton('button236', 'radio');

		// 
		
		button122.check(true);

		button211.check(true);

		button222.check(true);

		button235.check(true);

		//

		button111.click = function(e){leftToolBarPropertyElement_onclick(e)}

		button122.click = function(e){leftToolBarSelectElement_onclick(e)}


		button123.click = function(e){leftToolBarHand_onclick(e)}

		button123.svg_mousemove = function(sx, sy){leftToolBarHand_svg_mousemove(sx, sy)}


		button124.click = function(e){leftToolBarTurn_onclick(e)}

		button124.svg_mousemove = function(sx, sy){leftToolBarTurn_svg_mousemove(sx, sy)}


		button211.click = function(e){rightToolBarActionPoint_onclick(e)}

		//

		salf.MapCommandButton = group12;
		salf.ElementCommandButton = group22;
		salf.ActionPointTrendButton = group23;

	}
	
	function leftToolBarPropertyElement_onclick(e){
		
		if (salf.currentElement == undefined || salf.currentElement == salf.currentDraft) {

			var forma = new formPropertyMap();
		
			forma.open(salf.currentDraft);

		}else{

			salf.formPropertyElement = new formPropertyElement();

			salf.formPropertyElement.open(salf.currentElement);

		}

		cancelEvent(e);

	}

	function leftToolBarSelectElement_onclick(e){
		
		$("#svgout").css("cursor", "default")
		
		//svg.activeButton = but;
		
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

			myCanvas.currentDraft.recalculate();
			
			myCanvas.currentDraft.repaint();

		}

	}

	function leftToolBarTurn_onclick(e){
		
		$("#svgout").css("cursor", "url('images/update.png'), auto")
		
		//svg.activeButton = but;
		
	}

	function leftToolBarTurn_svg_mousemove(sx, sy){

		if (salf._pressLeftMouseButton == true || salf._pressMouseWheel == true){

			var value = salf.turn

			var [rx, ry, rz] = value;
			
			value[0] = rx + (sy/4);
			value[1] = ry - (sx/4);
			
			myCanvas.currentDraft.recalculate();
			
			myCanvas.currentDraft.repaint()
			
		}

	}

	function rightToolBarActionPoint_onclick(e){

		myCanvas.recalculate();
		
		myCanvas.repaint();
		
	}
	
	//..........

	this.propertyOnChange = function(ref, name, value){
		
		ref[name] = value;
		
	}

	this.propertySizeOnChange = function(ref, name, value){
		
		if (name == 'x') ref.sizes[0] = value; 
		if (name == 'y') ref.sizes[1] = value; 
		if (name == 'z') ref.sizes[2] = value; 
		
		ref.recalculate();

		myCanvas.repaint();
		
	}

	this.propertyPositionOnChange = function(ref, name, value){
		
		if (name == 'x') ref.position[0] = value; 
		if (name == 'y') ref.position[1] = value; 
		if (name == 'z') ref.position[2] = value; 
		
		ref.recalculate();

		myCanvas.repaint();
		
	}
	
	
	//..........
	
	function mapWheelMouse(e) {

		var i = new mauseWheelEvent(e)

		var [ScaleMin, ScaleMax, ScaleStep] = [0.1, 1.5, 0.1];	
		
		var newScale = salf.scale;
		
		if (i.value > 0){

			newScale = salf.scale - ScaleStep;
			
		}else{

			newScale = salf.scale + ScaleStep;

		}

		if (newScale >= ScaleMin && newScale <= ScaleMax){
		
			salf.scale = newScale;
			
			if (salf.scale == 0) salf.scale = 0.1;
		
			myCanvas.recalculate();
		
			myCanvas.repaint();
			
		}
		
		return cancelEvent(e);

	}

	this.inputWheelMouse = function(e){

		var i = new mauseWheelEvent(e)

		var iaaInput = $(i.elem).prop('iaaInputNumberField');
		
		if (iaaInput != undefined){

			var sing = -1;
		
			if (i.value > 0){

				sing = 1;

			}
		
			// console.log(sing);
		
			iaaInput.addStep(sing);
		
		}
		
		return cancelEvent(e);

	}

	function snapMouseDoun(e){
		
		// console.log('snapMouseDoun', e.which);
		
		if (e.which == 1) {
			
			salf._pressLeftMouseButton = true;
		
		} else if (e.which == 2){
			
			salf._pressMouseWheel = true;

			cancelEvent(e)
			
		} else if (e.which == 3){
			
			salf._pressRightMouseButton = true;

			cancelEvent(e)
			
		};
		
		// console.log('_pressLeftMouseButton', salf._pressLeftMouseButton);
		// console.log('_pressMouseWheel', salf._pressMouseWheel);
		// console.log('_pressRightMouseButton', salf._pressRightMouseButton);

	}

	function snapMouseMove(e){
	
		// console.log(e);
	
		var [sx, sy] = [0,0]

		if (salf._gx != undefined) {[sx, sy] = [e.clientX - salf._gx, e.clientY - salf._gy]}

		[salf._gx, salf._gy] = [e.clientX, e.clientY]

		if (e.which == 0){
			
			salf._pressRightMouseButton = false;

			salf._pressLeftMouseButton = false;

			salf._pressMouseWheel = false;
			
		}

		salf.MapCommandButton.checkButton().svg_mousemove(sx*1.5, sy*1.5)
		
		if (salf._pressMouseWheel == true) leftToolBarTurn_svg_mousemove(sx, sy)
		
		if (salf._pressRightMouseButton == true) leftToolBarHand_svg_mousemove(sx, sy)

	}

	function snapMouseMoveHamer(e){
	
		// console.log(e);
	
		var [sx, sy] = [0, 0]

		if (salf._gx != undefined) {[sx, sy] = [e.deltaX - salf._gx, e.deltaY - salf._gy]}

		[salf._gx, salf._gy] = [e.deltaX, e.deltaY]
		
		// alert('sx:' + sx + ', ' + 'sy:' + sy);
		
		console.log('sx:' + sx + ', ' + 'sy:' + sy);
		
		salf._pressLeftMouseButton = true;
		
		salf.MapCommandButton.checkButton().svg_mousemove(sx*1.5, sy*1.5)
		
		salf._pressLeftMouseButton = false;
		
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


	
	//.........
	
}

// Группа //

function iaaGroup(){
	
	var salf = this;

	this.parent = undefined;			// родительский элемент

	this.name = 'Новый элемент';		// имя
	
	
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


	this.snapElements = myCanvas.snap().g(); // svg элементы 
	
	this.snapElements.click(function(e){snapElementsOnClick(e)}) // событие OnClick

	//...
	
	function snapElementsOnClick(e){
		
		if (myCanvas.MapCommandButton.checkButton()._name == 'ButtonSelectElement') {
	
			myCanvas.setCurrentElement(salf);

			myCanvas.recalculate();

			myCanvas.repaint();
	
		}
		
		e.stopPropagation(); // Прекратить всплывание

	}
	
	//...
	
	this.setProperty = function(prop){	//Установить свойства
		
		if (prop.position != undefined) {
			
			this.position = [
				prop.position.x,
				prop.position.y,
				prop.position.z
			];
			
		};
		
		if (prop.sizes != undefined) {
			
			this.sizes = [
				prop.sizes.w,
				prop.sizes.h,
				prop.sizes.d
			];
			
		};
		
		if (prop.turn != undefined) {
			
			this.turn = [
				prop.turn.rx,
				prop.turn.ry,
				prop.turn.rz
			];
			
		};
		
	}
	
	this.recalculate = function(){		// Пересчитать
		
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
		
		salf.elements.forEach(function(element){
			
			element.recalculate();
			
		});
		
	}
	
	this.repaint = function(){			// Перерисовать
		
		salf.faces.sort(salf.sortFaceAscendingDepth)

		this.snapElements.clear();
		
		salf.points[0].display();		
		
		salf.faces.forEach(function(face){
			
			face.display();
			
		});
		
		salf.elements.forEach(function(element){
			
			element.repaint();
			
		});
		
		// myGraphix.createСircle(salf.сentrePoint, 5, 'blue',	'red', 1, salf);
		
	}
	
	this.addElement = function(prop){	// Добавить элемент
		
		var newElement = new iaaЕlement(prop.name, this);
		
		this.elements.push(newElement);
		
		newElement.setProperty(prop);
		
	}
	
	//---
	
	this.addPoint = function(w, h, d, lit){	//Добавить точку
		
		var point = new iaaPoint(salf, w, h, d, lit);
		
		salf.points.push(point);
		
	}
	
	this.clearPoints = function(){			//Очистить точки
		
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
	
	this.sortFaceAscendingDepth = function(i, j){			// Cортировать грани по возрастанию глубины
		
		if (i.depth > j.depth){
		
			return 1
		
		} else if (i.depth < j.depth){
		
			return -1;
		
		}else {
			
			return 0;
			
		}
		
	}
	
	this.sortFaceDescendingDepth = function(i, j){			// Cортировать грани по убыванию глубины
		
		if (i.depth > j.depth){
			
			return -1;
		
		}else if (i.depth < j.depth) {
		
			return 1;
		
		}else{
			
			return 0
		
		}
		
	}
	
	//---
	
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
				parentElement.position,
				salf.points
				);

	this.depth = (
		salf.points[0].xyz1[2] +
		salf.points[1].xyz1[2] +
		salf.points[2].xyz1[2] +
		salf.points[3].xyz1[2]
	) / 4; // Глубина

	this.coeff = myGraphix.getCoefficientsPlane(salf.points); // Коэффициенты плоскости

	this.thisConvexShape = myGraphix.thisConvexShape(salf.points) // Это выпуклая фигура

	this.snapElement = undefined;			// csg элемент
	
	this.display = function(){				// Отобразить грань
		
		// console.log(salf, '1.');
		
		salf.SnapElementRemove();
		
		var p1 = salf.points[0].xyz1
		var p2 = salf.points[1].xyz1
		var p3 = salf.points[2].xyz1
		var p4 = salf.points[3].xyz1

		if (salf.visible == salf.parent.faceVisible) {
		
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

			salf.snapElement.attr({'fill':salf.parent.attributes['fill']});
		
			salf.snapElement.attr({'fill-opacity':salf.parent.attributes['fill-opacity']});
			
			salf.parent.snapElements.add(salf.snapElement)
			
			salf.displayGrid();			
			
		}
		
	}
	
	this.displayGrid = function(){			// Отобразить сетку
	
		// console.log('displayGrid', salf);
	
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

	this.SnapElementRemove = function(){	// удалить csg элемент

		// Эту процедуру пока оставил временно,
		// в последствии надо будет удалить. 

		return 

		if (salf.snapElement == undefined) return

		// console.log('SnapElementRemove', salf.snapElement);

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
		
		// myGraphix.(salf.xyz1, 5, 'blue', 'yellow', 1, salf.parent);
		
	}

} 
 
// Проект //

function iaaDraft(name, w, h, d){
	
	var salf = this;
	
	this.type = 'Проект'; // тип
	
	iaaGroup.apply(this, arguments);
	
	this.name = name;
	
	this.attributes = {'stroke': 'black', 'fill': 'green', 'stroke-width': 1, 'fill-opacity': 0.5}
	
	this.sizes = [w, h, d];	// размеры	
	
	this.position = [myCanvas.m-w/2, myCanvas.n+h/2, 1.3*d]; // позиция
	
	this.faceVisible = false;
	
	this.gridVisible = true;
	
}

// Элемент //

function iaaЕlement(name, parentElement){
	
	var salf = this;
	
	var type = 'Элемент'; // тип

	iaaGroup.apply(this, arguments);
	
	this.parent = parentElement; // родительский элемент
	
	this.name = name; // имя
	
	this.attributes = {'stroke': 'black', 'stroke-width': 1, 'fill-opacity': 0.5}

	// this.gridVisible = true;
	
	// this.gridStep = [10,10,10];	
	
}

// Точка действия //

function iaaActionPoint(parentElement, parentFace){
	
	var salf = this;
	
	var type = 'Точка действия'; // тип

	iaaGroup.apply(this, arguments);
	
	var _parent = parentElement; // Родительский элемент
	
	var _face = parentFace; // Родительская грань

}

// Времяночка //

function elementProperty(name, x , y, z, w, h, d, rx, ry, rz){
	
	var salf = this;

	this.name = name;
	
	this.position = {'x':x,'y':y,'z':z};
	this.sizes = {'w':w,'h':h,'d':d};
	this.turn = {'rx':rx,'ry':ry,'rz':rz};
	
	//console.log(arguments)
	
}

