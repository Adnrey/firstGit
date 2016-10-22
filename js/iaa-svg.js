"use strict"

var myWindow = new iaaWindow();

var myCanvas = new iaaCanvas();

// Окно //

function iaaWindow(){
	
	var salf = this;
	
	//.....
	
	function onDocumentLoad(){

		createToolbar()

		// СоздатьКарту(600, 300, 325);
		
		//..
		
		// $('#svgout').mouseover(function(){setHookMouseWheel(this, mapWheelMouse, 1)})
		// $('#svgout').mouseout(function(){setHookMouseWheel(this, mapWheelMouse)})
		
		// $("#svgout").mousemove(function(e){snapMouseMove(e)})
		// $("#svgout").mouseup(function(e){snapMouseUp(e)})
		// $("#svgout").mousedown(function(e){snapMouseDoun(e)})
		// $("#svgout").mouseleave(function(e){snapMouseLeave(e)})
	
	}

	function createToolbar(){
		
		var tolBar1 = new iaaVerticalToolBar('leftToolBar', 'aside.left'); 

		var group11 = tolBar1.addGroupButton('group11');

		var button111 = group11.addButton('ButtonPropertyElement', 'button'); 

		var group12 = tolBar1.addGroupButton('MapCommandButton');

		var button122 = group12.addButton('ButtonSelectElement', 'radio'); 
		var button123 = group12.addButton('ButtonHand',   'radio'); 
		var button124 = group12.addButton('ButtonTurn',   'radio'); 	
		
		var tolBar2 = new iaaVerticalToolBar('rightToolBar', 'aside.right'); 

		var group21 = tolBar2.addGroupButton('group21');

		var button211 = group21.addButton('ButtonActionPoint', 'checkbox');

		var group22 = tolBar2.addGroupButton('ElementCommandButton');

		var button222 = group22.addButton('ButtonAddElement', 'radio');
		var button223 = group22.addButton('ButtonChangePosition', 'radio');
		var button224 = group22.addButton('ButtonChangeSize', 'radio');

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
		
		// svg.MapCommandButton = group12;
		// svg.ElementCommandButton = group22;
		// svg.ActionPointTrendButton = group23;
		
	}
	
	$(document).ready(function (){onDocumentLoad()}); // При загрузке
	
}

// Холст //

function iaaCanvas(){
	
	var salf = this;
	
	var idForm = 'svgout';

	var selector = "#" + idForm; 

	var snap = undefined;
	
	//.....	
	
	this.type = 'Холст';	// тип
	
	this.width = 0;			// ширина
	
	this.height = 0;		// высота
	
	this.m = 0;				// половина ширины
	
	this.n = 0;				// половина высоты
	
	this.k = 0;				// поидее половина глубины, но всегда 0
	
	this.turn = [0,0,0];	// поворот

	this.scale = 0.60; 		// масштаб
	
	this.currentElement = undefined;	// текущий элемент
	
	this.currentDraft = undefined;		// текущий проект

	this.actionPoints = {points:[]};	// точки действия	
	
	var _attributes = {};	// атрибуты
	
	$(document).ready(function (){onDocumentLoad()});
	
	$(window).resize(function(){onWindowsResize()});

	this.snap = function(){
		
		return snap;
		
	}
	
	function onDocumentLoad(){
		
		$('article').append(' <svg id="'+idForm+'"></svg> ');  
		
		snap = Snap(selector);
		
		snap.attr({fill: "#fff", "stroke-width": "1px"});
		
		onWindowsResize();
		
		salf.currentDraft = new iaaDraft('Новый проект', 600, 300, 325);
		
	}
	
	function onWindowsResize(){
		
		salf.width = +$(selector).width();
		
		salf.height = +$(selector).height();
		
		snap.attr({width: salf.width, height: salf.height});

		salf.m = salf.width / 2; salf.n = salf.height / 2; salf.k = 0;
		
		//snap.rect(0, 0, salf.width, salf.height);		

	}

}

// Группа //

function iaaGroup(){
	
	var salf = this;

	this.parent = undefined;	// родительский элемент

	this.name = '';
	
	this.position = [0,0,0];	// позиция
	
	this.sizes = [0,0,0];		// размеры

	this.turn = [0,0,0];		// поворот
	
	
	this.points = [];			// точки
	
	this.faces = [];			// грани
	
	this.attributes = {};		// атрибуты

	this.elements = []			// подчиненные элементы
 

	this.matrixVolume = [[],[],[],[]]; // матрица объема
	
	this.faceVisible = true; // отображаемые грани (true - видимые, false - не видимые)
	
	this.gridVisible = false; // отображать сетку
	
	this.gridStep = [50,50,50]; // шаг сетки
	
}

// Грань //

function iaaFace(parentElement, np1, np2, np3, np4, lit){
 
	var salf = this;
	
	var _type = 'Грань'; // тип
	
 	var _parent = parentElement; // Родительский элемент	
 
 	var _letter = lit; 
	
	var _visible = false;

 }

// Точка //

function iaaPoint(parentElement, w, h, d, lit){
 
	var salf = this;
	
	var _type = 'Точка'; // тип
 
 	var _parent = parentElement; // Родительский элемент
	
	var _letter = lit;
	
	var _visible = true;
	
 } 
 
// Проект //

function iaaDraft(name, w, h, d){
	
	var salf = this;
	
	this.type = 'Проект'; // тип
	
	iaaGroup.apply(this, arguments);
	
	this.name = name;
	
	this.attributes = {'stroke': 'green', 'fill': 'green', 'stroke-width': 1, 'fill-opacity': 0.5}
	
	this.sizes = [w, h, d];	// размеры	
	
	this.position = [myCanvas.m-w/2, myCanvas.n-h/2, d/2]; // позиция
	
	this.faceVisible = false;
	
	this.gridVisible = true;

}

// Элемент //

function iaaЕlement(name, parentElement){
	
	var salf = this;
	
	var _type = 'Элемент'; // тип

	iaaGroup.apply(this, arguments);
	
	var _parent = parentElement; // родительский элемент
	
	var _name = name; // имя
		
}

// Точка действия //

function iaaActionPoint(parentElement, parentFace){
	
	var salf = this;
	
	var _type = 'Точка действия'; // тип

	iaaGroup.apply(this, arguments);
	
	var _parent = parentElement; // Родительский элемент
	
	var _face = parentFace; // Родительская грань

}




