"use strict"

var [gx, gy] = [undefined, undefined]

var НажатаПраваяКнопкаМыши = false;
var НажатаЛеваяКнопкаМыши = false;
var НажатоКолёсекоМыши = false;

function SVGonLoad(){

	$(window).resize(function(){
	
		ОбновитьОтображениеHtmlЭлементов()

	});
	
	svg = Snap("#svgout");
	
	svg.Поворот = [0,0,0]
	
	svg.Масштаб = 0.60;
	
	УстановитьТекущийЭлемент(undefined);
	
	СоздатьПанельИнструментов()

	СоздатьКарту(600, 300, 325);
	
	//..
	
	$('#svgout').mouseover(function(){setHookMouseWheel(this, mapWheelMouse, 1)})
	$('#svgout').mouseout(function(){setHookMouseWheel(this, mapWheelMouse)})
	
	$("#svgout").mousemove(function(e){snapMouseMove(e)})
	$("#svgout").mouseup(function(e){snapMouseUp(e)})
	$("#svgout").mousedown(function(e){snapMouseDoun(e)})
	$("#svgout").mouseleave(function(e){snapMouseLeave(e)})
	
	ОбновитьОтображениеHtmlЭлементов()
	
}

function СоздатьПанельИнструментов(){
	
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
	
	svg.MapCommandButton = group12;
	svg.ElementCommandButton = group22;
	svg.ActionPointTrendButton = group23;
	
}

function ОбновитьОтображение(Элемент, Свойства){

	if (Элемент == undefined) Элемент = svg.Карта

	if (Элемент == undefined) return

	if (Свойства == undefined) Свойства = {}
	
	Элемент.Точки = []

	Элемент.Грани = []
	
	Элемент.ТочкиДействия.clear()
	
	Элемент.МатрицаОбъема = [[],[],[],[]]

	if (ЭтоКарта(Элемент)){
	

		Элемент.ЭлементыКарты.clear();

	
	}else{
	
		Элемент.ЭлементыКарты.remove();
		
		Элемент.ЭлементыКарты = svg.g().attr(Элемент.Атрибуты);
		
		Элемент.ЭлементыКарты.click(function(e){Элемент.elementClick(e)})
		
	}
	
	var ИмяТекущейКоманды =  svg.ElementCommandButton.checkButton()._name;
			
	if (ИмяТекущейКоманды == 'ButtonChangeSize' && Элемент.Имя != 'Карта') return
	
	//......................................................

	if (Свойства.Позиция != undefined) {
	
		if (Элемент.ТипЗнч == 'ТочкаДействия'){

		}else{

			Элемент.Позиция[0] = Элемент.Позиция[0] + Свойства.Позиция[0]
			Элемент.Позиция[1] = Элемент.Позиция[1] + Свойства.Позиция[1]
			Элемент.Позиция[2] = Элемент.Позиция[2] + Свойства.Позиция[2]
		
		}
	

	}

	if (Свойства.Поворот != undefined) {

		if (Элемент.ТипЗнч == 'ТочкаДействия'){

			Свойства.Поворот[0] = 0;
			Свойства.Поворот[1] = 0;
			Свойства.Поворот[2] = 0;

		}

		Элемент.Поворот[0] = Элемент.Поворот[0] + Свойства.Поворот[0]
		Элемент.Поворот[1] = Элемент.Поворот[1] + Свойства.Поворот[1]
		Элемент.Поворот[2] = Элемент.Поворот[2] + Свойства.Поворот[2]		
		
	}

	//......................................................

	var [x, y, z] = Элемент.Позиция;

	var [w, h, d] = Элемент.Размеры;

	var [rx, ry, rz] = Элемент.Поворот;

	if (Свойства.Центр != undefined) {

		Элемент.Центр = Свойства.Центр
	
	}else{
	
		var [m , n, k] = [w/2+x,  h/2+y,  d/2+z];

		Элемент.Центр = [m, n, k]
		
	}	

	//......................................................

	Элемент.ТочкаЦентр = КоординатыТочки(Элемент, m, n, k, m, n, k, rx, ry, rz);
	
	Элемент.Глубина = ВекторОтТочкиНаблюденияДоТочки(Элемент, Элемент.ТочкаЦентр);
	
	СоздатьТочку(Элемент, 0, 0, d, '1')
	СоздатьТочку(Элемент, w, 0, d, '2')
	СоздатьТочку(Элемент, w, 0, 0, '3')
	СоздатьТочку(Элемент, 0, 0, 0, '4')

	СоздатьТочку(Элемент, 0, h, d, '5')
	СоздатьТочку(Элемент, w, h, d, '6')
	СоздатьТочку(Элемент, w, h, 0, '7')
	СоздатьТочку(Элемент, 0, h, 0, '8')

	СоздатьГрань(Элемент, 2, 3, 7, 6, 'R')
	СоздатьГрань(Элемент, 1, 4, 8, 5, 'L')

	СоздатьГрань(Элемент, 2, 3, 4, 1, 'T')
	СоздатьГрань(Элемент, 6, 7, 8, 5, 'B')

	СоздатьГрань(Элемент, 3, 4, 8, 7, 'H')
	СоздатьГрань(Элемент, 2, 1, 5, 6, 'Y')

	ОпределитьВидимыеГрани(Элемент)
	
	ОтобразитьГрани(Элемент)
	
	if (Элемент.ТочкиДействия != undefined) {

		for (var i = 0; i < Элемент.ТочкиДействия.Точки.length; i++) {
		
			ОбновитьОтображение(Элемент.ТочкиДействия.Точки[i], Свойства)

		}

	}

	if (Элемент.Элементы != undefined) {

		Элемент.Элементы.sort(СортироватьГраниПоУбываниюГлубины)
		//Элемент.Элементы.sort(СортироватьГраниПоВозрастаниюГлубины)

		var text = '';
		
		for (var i = 0; i < Элемент.Элементы.length; i++) {
		
			if (i == 0)  Элемент.Элементы[i].Атрибуты['fill'] = 'red'
			if (i == 1)  Элемент.Элементы[i].Атрибуты['fill'] = 'blue'
			if (i == 2)  Элемент.Элементы[i].Атрибуты['fill'] = 'green'
			if (i == 3)  Элемент.Элементы[i].Атрибуты['fill'] = 'pink'
			
			//text +=	" " + Элемент.Элементы[i].Атрибуты['fill'] + '(' + Math.round(Элемент.Элементы[i].Глубина) + ') ';				
				
		
			ОбновитьОтображение(Элемент.Элементы[i], Свойства)

		}

		//if (text != '') console.log(text)
		
	}

	//if (ЭтоТекущийЭлемент(Элемент)) Элемент.ЭлементыКарты.add(СоздатьКруг(Элемент.ТочкаЦентр, 5, 'blue', 'yellow', 1))
	
}

function ОбновитьОтображениеHtmlЭлементов (){

	var pageWidth = $("html").width(),
		pageHeight = $("html").height(),
		winHeight = $(window).height(); 
	
	// container
	
	var container = $(".container");
	
	var containerWidth = 800;
	
	if (pageWidth > 1650){
	
		containerWidth = 1600
		
	} else if (pageWidth > 1550){
	
		containerWidth = 1500
	
	} else if (pageWidth > 1450){
	
		containerWidth = 1400
	
	} else if (pageWidth > 1350){
	
		containerWidth = 1300
		
	} else if (pageWidth > 1250){
	
		containerWidth = 1200
		
	} else if (pageWidth > 1150){
	
		containerWidth = 1100
	
	} else if (pageWidth > 1050){
	
		containerWidth = 1000
		
	} else if (pageWidth > 950){
	
		containerWidth = 900	
	}

	container.css('width', containerWidth);
	
	var containerPaddding = +container.css('Padding').replace('px','');
	
	var asideWidth = 58;
	
	$('aside.left').width(asideWidth)
	
	$('aside.right').width(asideWidth)
	
	$('aside.left').height(50)
	
	$('aside.right').height(50)
	
	// article ...............................
	
	var article = $('article');
	
	var articleWidth = containerWidth - asideWidth * 2 - containerPaddding * 2 + 22;
	
	article.width(articleWidth);
	
	article.height(50);
	
	var обновитьSvg = false;

	if (svg.Ширина != articleWidth){svg.Ширина = articleWidth; обновитьSvg = true;}
	
	if (svg.Высота != winHeight){svg.Высота = winHeight; обновитьSvg = true;}

	if (обновитьSvg){
		
		svg.ПриИзмененииРазмеров();

		ОбновитьОтображение()
		
	
	} //
	
	//..............................................
	
	var maxHeight = Math.max(
		$('aside.left').height(),
		$('article').height(),
		$('aside.right').height(),
		winHeight
	)
	
	$('aside.left').height(maxHeight),
	$('article').height(maxHeight),
	$('aside.right').height(maxHeight)
	
}

function УстановитьТекущийЭлемент(ref){

	svg.ТекущийЭлемент = ref;

	if (svg.formPropertyElement != undefined) {
			
		svg.formPropertyElement.open(ref);
			
	}
	
}

function ЭтоТекущийЭлемент(ref){

	return (svg.ТекущийЭлемент == Элемент);

}

function ЭтоТочкаДействия(ref){
	
	return ref.ТипЗнч == 'ТочкаДействия';

}

function ЭтоКарта(ref){
	
	return ref == svg.Карта;

}

//------------------------------------------

function mapWheelMouse(e) {

	var i = new mauseWheelEvent(e)

	var [ScaleMin, ScaleMax, ScaleStep] = [0.05, 1.5, 0.1];	
	
	var newScale = svg.Масштаб;
	
	if (i.value > 0){

		newScale = svg.Масштаб - ScaleStep;
		
	}else{

		newScale = svg.Масштаб + ScaleStep;

	}

	if (newScale >= ScaleMin && newScale <= ScaleMax){
	
		svg.Масштаб = newScale;
	
		ОбновитьОтображение()
		
	}
	
	return cancelEvent(e);

}

function inputWheelMouse(e){

	var i = new mauseWheelEvent(e)

	var iaaInput = $(i.elem).prop('iaaInputNumberField');
	
	if (iaaInput != undefined){

		var sing = -1;
	
		if (i.value > 0){

			sing = 1;

		}
	
		console.log(sing);
	
		iaaInput.addStep(sing);
	
	}
	
	return cancelEvent(e);

}

function snapMouseDoun(e){
	
	if (e.which == 1) НажатаЛеваяКнопкаМыши = true;
	if (e.which == 2) {НажатоКолёсекоМыши = true; cancelEvent(e)};	
	if (e.which == 3) {НажатаПраваяКнопкаМыши = true;  cancelEvent(e)};

}

function snapMouseMove(e){

	var [sx,sy,sz] = [0,0,0]

	if (gx != undefined) {[sx, sy] = [e.clientX - gx, e.clientY - gy]}

	[gx, gy] = [e.clientX, e.clientY]

	if (e.which == 0){НажатаПраваяКнопкаМыши = false; НажатаЛеваяКнопкаМыши = false;НажатоКолёсекоМыши = false;}

	svg.MapCommandButton.checkButton().svg_mousemove(sx*1.5, sy*1.5)
	
	if (НажатоКолёсекоМыши == true) leftToolBarTurn_svg_mousemove(sx, sy)
	
	if (НажатаПраваяКнопкаМыши == true) leftToolBarHand_svg_mousemove(sx, sy)

}

function snapMouseUp(e){

	if (e.which == 1) НажатаЛеваяКнопкаМыши = false;
	if (e.which == 2) НажатоКолёсекоМыши = false;
	if (e.which == 3) НажатаПраваяКнопкаМыши = false;
	
	[gx, gy] = [undefined, undefined]
	
}

function snapMouseLeave(e){

	НажатаЛеваяКнопкаМыши = false;

	НажатоКолёсекоМыши = false;
	
	НажатаПраваяКнопкаМыши = false;

	[gx, gy] = [undefined, undefined]
	
}

//------------------------------------------

function leftToolBarPropertyElement_onclick(e){
	
	if (svg.ТекущийЭлемент.ТипЗнч == 'Карта') {
				
		var forma = new formPropertyMap();
	
		forma.open(Карта);
	
	}else{
		
		if (svg.formPropertyElement == undefined) {
		
			svg.formPropertyElement = new formPropertyElement();
			
		}
		
		svg.formPropertyElement.open(svg.ТекущийЭлемент);
		
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
	
	if (НажатаЛеваяКнопкаМыши == true || НажатаПраваяКнопкаМыши == true){

		var m = svg.Масштаб;

		var value = svg.Карта.Позиция

		var [x, y, z] = value;

		var Свойства = {'Позиция':[sx * m, sy * m, 0]}

		ОбновитьОтображение(undefined, Свойства)

	}

}

function leftToolBarTurn_onclick(e){
	
	$("#svgout").css("cursor", "url('images/update.png'), auto")
	
	//svg.activeButton = but;
	
}

function leftToolBarTurn_svg_mousemove(sx, sy){

	if (НажатаЛеваяКнопкаМыши == true || НажатоКолёсекоМыши == true){

		var value = svg.Поворот

		var [rx, ry, rz] = value;

		value[0] = rx + (sy/4);
		value[1] = ry - (sx/4);
		
		ОбновитьОтображение()
		
	}

}

function rightToolBarActionPoint_onclick(e){

	ОбновитьОтображение()
	
}

//------------------------------------------

function propertyOnChange(ref, name, value){
	
	ref[name] = value;
	
}

function propertySizeOnChange(ref, name, value){
	
	if (name == 'x') ref.Размеры[0] = value; 
	if (name == 'y') ref.Размеры[1] = value; 
	if (name == 'z') ref.Размеры[2] = value; 
	
	ОбновитьОтображение(ref)	
	
}

function propertyPositionOnChange(ref, name, value){
	
	var [x, y, z] = ref.Позиция;

	var newArr = [0, 0, 0];
	
	if (name == 'x') newArr[0] = value - x; 
	if (name == 'y') newArr[1] = value - y; 
	if (name == 'z') newArr[2] = value - z; 
	
	var property = {'Позиция':newArr}

	ОбновитьОтображение(ref, property)
	
}

//..........

function НайтиКоэффициентыПлоскости(Грань){

	//ax + by + cz + d = 0 уравненеи плоскости

	var p1 = Грань.points[0].xyz1
	
	var p2 = Грань.points[1].xyz1
	
	var p3 = Грань.points[2].xyz1
	
	var p4 = Грань.points[3].xyz1	

	var x1 = p1[0], x2 = p2[0], x3 = p3[0], x4 = p4[0];

	var y1 = p1[1], y2 = p2[1], y3 = p3[1], y4 = p4[1]; 
	
	var z1 = p1[2], z2 = p2[2], z3 = p3[2], z4 = p4[2]; 
	
	var a = (y1 - y2)*(z1 + z2) + (y2 - y3)*(z2 + z3) + (y3 - y4)*(z3 + z4) + (y4 - y1)*(z4 + z1)

	var b = (z1 - z2)*(x1 + x2) + (z2 - z3)*(x2 + x3) + (z3 - z4)*(x3 + x4) + (z4 - z1)*(x4 + x1)

	var c = (x1 - x2)*(y1 + y2) + (x2 - x3)*(y2 + y3) + (x3 - x4)*(y3 + y4) + (x4 - x1)*(y4 + y1)

	var d = -(a * p1[0] + b * p1[1] + c * p1[2])
	
	if (a == -0) a = 0
	if (b == -0) b = 0
	if (c == -0) c = 0
	if (d == -0) d = 0
	
	Грань.Коэфф = [a, b, c, d]

}

function НайтиТочкуПоСреднимЗначениям(Элемент, points){
	
	var pc = [0,0,0];
	
	for (var i = 0; i < points.length; i++) {
	
		var p = points[i].xyz;

		for (var j = 0; j < 3; j++) {
		
			pc[j] = pc[j] + p[j]
		
		}
		
	}
	
	for (var i = 0; i < 3; i++) {
		pc[i] = pc[i]/points.length
	}
	
	var x = pc[0] - Элемент.Позиция[0];
	var y = pc[1] - Элемент.Позиция[1];
	var z = pc[2] - Элемент.Позиция[2];

	return СоздатьТочку(Элемент, x, y, z)
	
}

function ОпределитьВидимыеГрани(Элемент){
	
	//Приведём матрицу объема (тела) к корректному виду
	
	var S = Элемент.ТочкаЦентр // Точка точно должна находиться внутри элемента
	
	var V = Элемент.МатрицаОбъема
	
	var SV = УмножитьТочкуНаМатрицу(S, V)
	
	for (var i = 0; i < 6; i++) { // Приводим матрицу объема(тела) к корректному виду, значения для точки внутри должны быть отрицательные

		if (SV[i]>0) {
			V[0][i] = V[0][i] * -1
			V[1][i] = V[1][i] * -1
			V[2][i] = V[2][i] * -1
			V[3][i] = V[3][i] * -1
		}
		
	}
	
	// Определим видимость грани
	
	var p1 = КоординатыТочки(Элемент, svg.m, svg.n, svg.k,0,0,0,0,0,0); // Точна наблюдения
	
	var p2 = Элемент.ТочкаЦентр
	
	var F = [p1[0]-p2[0], p1[1]-p2[1], 10000000000, 0] //Вектор из центра элемента в точку наблидения
	
	for (var i = 0; i < Элемент.Грани.length; i++) {
	
		var Грань = Элемент.Грани[i]
		
		var FV = УмножитьТочкуНаМатрицу(F, V)
		
		if (FV[i] <= 0) {Грань.Видимость = true}
	
	}
	
}
	
function ЭтаФигураВыпуклая(points){
	
	var p1 = points[0].xyz1
	var p2 = points[1].xyz1
	var p3 = points[2].xyz1
	var p4 = points[3].xyz1
	
	var V1 = ВекторноеПроизведениеСмежныхВекторов_1(p4,p1,p2)
	var V2 = ВекторноеПроизведениеСмежныхВекторов_1(p1,p2,p3)
	var V3 = ВекторноеПроизведениеСмежныхВекторов_1(p2,p3,p4)
	var V4 = ВекторноеПроизведениеСмежныхВекторов_1(p3,p4,p1)
	
	// надо доделать,
	//если
	// результат 0, это не фигура;					возврат  0
	// все + или 0 выпуклая правая ориентация +;	возврат  1
	// все - или 0 выпуклая	левая  ориентация -;	возврат -1

	return true
	
}

function ВекторноеПроизведениеСмежныхВекторов_1(p3,p1,p2){
	
	//V = V3V1 * V1V2
	
	// p3 = [0,0]
	// p1 = [0,3]
	// p2 = [2,1] 
	
	var V3V1_i =  p3[0]-p1[0]
	var V3V1_j =  p3[1]-p1[1]

	var V1V2_i =  p2[0]-p1[0]
	var V1V2_j =  p2[1]-p1[1]
	
	var V = (V3V1_i * V1V2_i * 0) //i * i = 0
  	  + (V3V1_i * V1V2_j * 1) //i * j = 1
	  + (V3V1_j * V1V2_i * -1)//j * i = -1 
	  + (V3V1_j * V1V2_j * 0) //j * j = 0
	
	return V
	
}

function ВекторОтТочкиНаблюденияДоТочки(Элемент, Точка){
 
	var [x1,y1,z1] = [svg.m, svg.n, svg.k]
	
	var [x2,y2,z2] = Точка;
	
	var value 
		= Math.sqrt
			(
			Math.pow(x2-x1, 2) +
			Math.pow(y2-y1, 2) +
			Math.pow(z2-z1, 2)
			);
	
	return value;
	
}

//..........

function ДобавитьМатрицуСмещения(arr, m, n, k){
	
	arr.push([
		[ 1,  0,  0,  0],
		[ 0,  1,  0,  0],
		[ 0,  0,  1,  0],
		[ m,  n,  k,  1]
	])
	
	return arr
	
}

function ДобавитьМатрицыПоворота(arr, rx, ry, rz){
	
	var [rx1, ry1, rz1] = svg.Поворот
	
	//...........................................
	
	var ax = Math.sin(rx * Math.PI / 180);
	var bx = Math.cos(rx * Math.PI / 180);
	
	arr.push([// Поворот X1
		[  1,   0,    0,  0],
		[  0,  bx,   ax,  0],
		[  0, -ax,   bx,  0],
		[  0,   0,    0,  1]
	])		

	var ay = Math.sin(ry1 * Math.PI / 180);
	var by = Math.cos(ry1 * Math.PI / 180);
	
	arr.push([// Поворот Y
		[ by,   0, -ay,	 0],
		[  0,	1,	 0,	 0],
		[ ay,	0,	by,	 0],
		[  0,   0,   0,  1]
	])	

	var az = Math.sin(rz * Math.PI / 180);
	var bz = Math.cos(rz * Math.PI / 180);		
	
	arr.push([// Поворот Z
		[ bz,  az,   0,  0],
		[-az,  bz,   0,  0],
		[  0,   0,   1,  0],
		[  0,   0,   0,  1]
	])
	
	//...........................................
	
	ax = Math.sin(rx1 * Math.PI / 180);
	bx = Math.cos(rx1 * Math.PI / 180);

	arr.push([// Поворот X
		[  1,   0,    0,  0],
		[  0,  bx,   ax,  0],
		[  0, -ax,   bx,  0],
		[  0,   0,    0,  1]
	])		

	var ay = Math.sin(ry * Math.PI / 180);
	var by = Math.cos(ry * Math.PI / 180);

	arr.push([// Поворот Y1
		[ by,   0, -ay,	 0],
		[  0,	1,	 0,	 0],
		[ ay,	0,	by,	 0],
		[  0,   0,   0,  1]
	])		
	
	//...........................................
	
}

function ДобавитьМатрицыПоворотаВокругТочки(arr, m, n, k, rx, ry, rz){
	
	ДобавитьМатрицуСмещения(arr, -m, -n, -k)

	ДобавитьМатрицыПоворота(arr, rx, ry, rz)

	ДобавитьМатрицуСмещения(arr, m, n, k)	
	
}

function ДобавитьМатрицуМасштабирования(arr){
	
	var s = svg.Масштаб
	
	arr.push([
		[  1,  0,  0,  0],
		[  0,  1,  0,  0],
		[  0,  0,  1,  0],
		[  0,  0,  0,  s]
	])
	
}

function ДобавитьМатрицуПроекции(arr){
	
	arr.push([
		[  1,  0,  0,  0],
		[  0,  1,  0,  0],
		[  0,  0,  1,  0.001],
		[  0,  0,  0,  1]
	])
	
}

function ПеремножитьМатрици(M1, M2){

	var M3 = []

	for (var i = 0; i < M1.length; i++) {

		var a = M1.slice()
	
		for (var j = 0; j < M2.length; j++) {

			var b = M2.slice()
		
			var c = УмножитьТочкуНаМатрицу(a[i].slice(), b[j].slice())

			a[i][0] = c[0]/c[3].toFixed(10)
			a[i][1] = c[1]/c[3].toFixed(10)
			a[i][2] = c[2]/c[3].toFixed(10)
			a[i][3] = c[3]/c[3].toFixed(10)
			
		}
	
		M3.push(a[i])
	
	}
	
	return M3

}

function УмножитьТочкуНаМатрицу(P, M){

	var PM = [];

	for (var i = 0; i < M.length; i++) {

		for (var j = 0; j < M[i].length; j++) {

			if (PM[j] == undefined){PM[j] = 0}
		
			PM[j] =  PM[j] + P[i] * M[i][j] 
	
		}	
	
	}
	
	return PM
	
}

function КоординатыТочки(Элемент, x, y, z, m, n, k, rx, ry, rz){

	var xyz = [[x, y, z, 1]] // Точки

	var matrix = []

	if (Элемент.Элементы == undefined) return

	var ТекущийРодитель = Элемент.Родитель;
	
	if (ТекущийРодитель == undefined){
	
		ДобавитьМатрицыПоворотаВокругТочки(matrix, m, n, k, rx, ry, rz);
		
	 }else{

		if (Элемент.ТипЗнч == 'ТочкаДействия' && ТекущийРодитель.Родитель != undefined){
			
			ТекущийРодитель = ТекущийРодитель.Родитель;
			
		}
	 
		var [pm, pn, pk] = ТекущийРодитель.Центр;

		var [prx, pry, prz] = ТекущийРодитель.Поворот;
		
		ДобавитьМатрицыПоворотаВокругТочки(matrix, pm, pn, pk, prx, pry, prz);
		
		//ТекущийРодитель.ЭлементыКарты.add(СоздатьКруг(ТекущийРодитель.ТочкаЦентр, 5, 'red', 'blue', 5));
		
	}
	
	//..
	
	ДобавитьМатрицуСмещения(matrix, -svg.m, -svg.n, -svg.k)
	
	ДобавитьМатрицуМасштабирования(matrix)
	
	ДобавитьМатрицуПроекции(matrix)

	ДобавитьМатрицуСмещения(matrix, svg.m, svg.n, svg.k)
	
	
	xyz = ПеремножитьМатрици(xyz, matrix);

	var xx = xyz[0][0]; var yy = xyz[0][1]; var zz = xyz[0][2]

	return [xx, yy, zz, 1]

}

//..........

function СоздатьКарту(ШиринаКарты, ВысотаКарты, ГлубинаКарты){

	svg.Ширина = 1600; svg.Высота = 720; //++
	
	svg.attr({fill: "#fff", "stroke-width": "1px"});
	
	svg.attr({width: svg.Ширина, height: svg.Высота}); //++

	svg.rect(0, 0, svg.Ширина, svg.Высота)
	
	svg.ПриИзмененииРазмеров = function(){
		
		svg.m = svg.Ширина / 2; svg.n = svg.Высота / 2; svg.k = 0;
		
		svg.attr({width: svg.Ширина, height: svg.Высота});

		$('svg > rect').attr({width: svg.Ширина, height: svg.Высота});
		
		if (svg.Карта != undefined) {
			
			var [w, h, d] = Карта.Размеры;
			
			var x = svg.m - w / 2;
	
			var y = svg.n - h / 2;

			var z = d / 2
			
			Карта.Позиция = [x , y, z]
			
		}
		
	}
	
	svg.ПриИзмененииРазмеров();
	
	
	////////////////////////////////////////////////////////////////////

	var x = svg.m - ШиринаКарты / 2;
	
	var y = svg.n - ВысотаКарты / 2;

	var z = ГлубинаКарты / 2
	
	Карта = {}

	svg.Карта = Карта;
	
	Карта.Имя = 'Карта'
	Карта.ТипЗнч = 'Карта'
	
	Карта.Позиция = [x , y, z]
	Карта.Размеры = [ШиринаКарты, ВысотаКарты, ГлубинаКарты]
	Карта.Поворот = [0, 0, 0]
	Карта.Атрибуты = {'stroke': 'green', 'fill': 'green', 'stroke-width': 1, 'fill-opacity': 0.5}
	
	Карта.ОтображатьГрани = false
	Карта.ПоказыватьСетку = true
	Карта.ШагСетки = [50,50,50]
	
	////////////////////////////////////////////////////////////////////

	СоздатьЭлемент(Карта)

	УстановитьТекущийЭлемент(Карта);
	
	ОбновитьОтображение()

	//.................................................................
	
}

function СоздатьЭлемент(Элемент){

	if (Элемент == undefined) Элемент = {}; //++

	if (Элемент.Родитель == undefined) Элемент.Родитель = undefined //++

	if (Элемент.ТипЗнч  == undefined) Элемент.ТипЗнч = "Элемент" //+

	if (Элемент.Элементы == undefined) Элемент.Элементы = []
	
	if (Элемент.Позиция == undefined)  Элемент.Позиция = [0,0,0] //++

	if (Элемент.Размеры == undefined)  Элемент.Размеры = [0,0,0] //++

	if (Элемент.Поворот == undefined)  Элемент.Поворот = [0,0,0] //++

	if (Элемент.Точки == undefined)    Элемент.Точки = [] //++
	
	if (Элемент.Грани == undefined)    Элемент.Грани = [] //++
	
	if (Элемент.ТочкиДействия == undefined) Элемент.ТочкиДействия = {Точки:[]}	//++
	
	if (Элемент.МатрицаОбъема == undefined) Элемент.МатрицаОбъема =[[],[],[],[]] //++
	
	if (Элемент.ОтображатьГрани == undefined) Элемент.ОтображатьГрани = true //++
	
	
	
	Элемент.ЭлементыКарты = svg.g().attr(Элемент.Атрибуты);
	
	Элемент.ЭлементыКарты.click(function(e){Элемент.elementClick(e)})
	
	//..
	
	Элемент.ТочкиДействия.add = function(value){
		
		this.Точки.push(value)
		
	}
	
	Элемент.ТочкиДействия.clear = function(){
		
		for (var i = 0; i < this.Точки.length; i++) {
		
			//this.Точки[i].ЭлементыКарты.clear()
			
			this.Точки[i].ЭлементыКарты.remove()

		}
		
		this.Точки = []
		
	}
	
	//..
	
	Элемент.elementClick = function(e){
		
		if (Элемент.ТипЗнч == 'ТочкаДействия'){

			var ИмяТекущейКоманды =  svg.ElementCommandButton.checkButton()._name;
		
			if (ИмяТекущейКоманды == 'ButtonAddElement'){
				
				var di = new formAddElemrnt();
				
				di.open(Элемент);

				cancelEvent(e);
				
			}else if(ИмяТекущейКоманды == 'ButtonChangePosition'){
				
				alert('Действие изменение позиции')
				
			}else if(ИмяТекущейКоманды == 'ButtonChangeSize'){
			
				alert('Действие изменение размера')
				
			}
		
		}else if (svg.MapCommandButton.checkButton()._name == 'ButtonSelectElement') {

			if (Элемент == svg.Карта) {

				//УстановитьТекущийЭлемент(undefined)

				УстановитьТекущийЭлемент(Элемент);

			}else if (Элемент.ТипЗнч == 'Элемент'){

				УстановитьТекущийЭлемент(Элемент);

			}

			ОбновитьОтображение()
	
		}

	}
	
	//..
	
	return Элемент

}

function СоздатьГрань(Элемент, np1, np2, np3, np4, lit){
	
	var Грань = {}
	
	Грань.Родитель = Элемент //++
	
	Грань.ТипЗнч = "Грань" //++
	
	Грань.Лит = lit //++
	
	Грань.Видимость = false; //++

	var [p1, p2, p3, p4] = [Элемент.Точки[np1-1], Элемент.Точки[np2-1], Элемент.Точки[np3-1], Элемент.Точки[np4-1]]
	
	Грань.points = [p1, p2, p3, p4] 
	
	Грань.Центр = НайтиТочкуПоСреднимЗначениям(Элемент, Грань.points)
	
	Грань.Глубина = (p1.xyz1[2] + p2.xyz1[2] + p3.xyz1[2] + p4.xyz1[2]) / 4

	НайтиКоэффициентыПлоскости(Грань)
	
	ЭтаФигураВыпуклая(Грань.points);
	
	Элемент.Грани.push(Грань)
	
	for (var i=0; i < 4; i++) {
	
		Элемент.МатрицаОбъема[i].push(Грань.Коэфф[i])
	
	}
	
	return Грань; 
	
}

function СоздатьТочку(Элемент, w, h, d, lit){
	
	var Точка = {};
	
	Точка.Родитель = Элемент; //++
	
	Точка.ТипЗнч = "Точка"; //++
	
	Точка.Лит = lit; //++
	
	Точка.Видимость = true; //++
	
	var [x, y, z] = Элемент.Позиция;
	
	var [m, n, k] = Элемент.Центр;

	var [rx, ry, rz] = Элемент.Поворот;
	
	var xyz = [x + w, y + h, z + d];
	
	Точка.xyz = xyz;
	
	Точка.xyz1 = КоординатыТочки(Элемент, xyz[0], xyz[1], xyz[2], m, n, k, rx, ry, rz);

	Элемент.Точки.push(Точка)
	
	return Точка;
	
}

function СоздатьТочкуДействия(Объект){
	
	if ($("#ButtonActionPoint").prop("checked") == false) return
	
	if (Объект.Родитель == undefined) return
	
	if (Объект.Родитель.ТипЗнч == 'ТочкаДействия') return

	if (svg.ТекущийЭлемент != Объект.Родитель) return

	var ОтображатьВнешниеграни = Объект.Родитель.ОтображатьГрани;
	
	var Габарит = 14;
	
	var [x, y, z] = Объект.Центр.xyz;
	
	var [w, h, d] = [Габарит, Габарит, Габарит];
	
	if (ОтображатьВнешниеграни){
		
		if (Объект.Лит == 'R'){

			w = w/4;
		
			y -= h/2;
			z -= d/2;

		}else if (Объект.Лит == 'L'){	

			w = w/4;
		
			x -= w;
			y -= h/2;
			z -= d/2;

		}else if (Объект.Лит == 'T'){

			h = h/4;
		
			x -= w/2;
			y -= h;
			z -= d/2;

		}else if (Объект.Лит == 'B'){	

			h = h/4;
		
			x -= w/2;
			z -= d/2;

		}else if (Объект.Лит == 'H'){

			d = d/4;
		
			x -= w/2;
			y -= h/2;
			z -= d;

		}else if (Объект.Лит == 'Y'){	

			d = d/4;
		
			x -= w/2;
			y -= h/2;

		}

	}else{

		if (Объект.Лит == 'R'){

			w = w/4;
		
			x -= w;
			y -= h/2;
			z -= d/2;

		}else if (Объект.Лит == 'L'){	

			w = w/4;
		
			y -= h/2;
			z -= d/2;

		}else if (Объект.Лит == 'T'){

			h = h/4;
		
			x -= w/2;
			z -= d/2;

		}else if (Объект.Лит == 'B'){	

			h = h/4;
		
			x -= w/2;
			y -= h;
			z -= d/2;

		}else if (Объект.Лит == 'H'){

			d = d/4;
		
			x -= w/2;
			y -= h/2;

		}else if (Объект.Лит == 'Y'){	

			d = d/4;
			
			x -= w/2;
			y -= h/2;
			z -= d;

		}

	}

	var newЭлемент = {}
	
	newЭлемент.Родитель = Объект.Родитель; //++
	newЭлемент.Имя = "Добавить " + Объект.Лит; //++
	newЭлемент.ТипЗнч = "ТочкаДействия"; //++
 	newЭлемент.ParentFace = Объект; //++
	newЭлемент.Позиция = [x, y, z]; //++
	newЭлемент.Размеры = [w, h, d]; //++
	newЭлемент.Поворот = [0, 0, 0]; //++
	newЭлемент.Атрибуты = { //++
		'fill': 'yellow',
		"fill-opacity": 1
	};

	СоздатьЭлемент(newЭлемент)
	
	newЭлемент.Родитель.ТочкиДействия.add(newЭлемент)

}

function ОтобразитьГрани(Элемент){

	Элемент.Грани.sort(СортироватьГраниПоВозрастаниюГлубины)

	for (var index in Элемент.Грани) {

		var Грань = Элемент.Грани[index]

		var p1 = Грань.points[0].xyz1
		var p2 = Грань.points[1].xyz1
		var p3 = Грань.points[2].xyz1
		var p4 = Грань.points[3].xyz1

		if (Грань.Видимость == Элемент.ОтображатьГрани) {
		
			Грань.ЭлементКарты = svg.polyline([[p1[0],p1[1]],[p2[0],p2[1]],[p3[0],p3[1]],[p4[0],p4[1]],[p1[0],p1[1]]]);

			Грань.ЭлементКарты.attr({'stroke': 'black'});
			
			Грань.ЭлементКарты.attr({"stroke-width": 2});

			Грань.ЭлементКарты.attr({'fill':Элемент.Атрибуты['fill']});
		
			Грань.ЭлементКарты.attr({'fill-opacity':Элемент.Атрибуты['fill-opacity']});
			
			Элемент.ЭлементыКарты.add(Грань.ЭлементКарты)
			
			ОтобразитьСеткуНаГрани(Грань);			
			
			//if (ЭтоТекущийЭлемент(Элемент)) Элемент.ЭлементыКарты.add(СоздатьКруг(Грань.Центр.xyz1, 3, 'blue', 'red', 1))
	
			СоздатьТочкуДействия(Грань)

		}

	}

}

function ОтобразитьСеткуНаГрани(Грань){
	
	var Родитель = Грань.Родитель 
	
	if (Родитель.ПоказыватьСетку != true){return}

	var [x, y, z] = Родитель.Позиция;	

	var ШагОси = [];
	
	if(Грань.Лит == 'R' || Грань.Лит == 'L'){
		
		ШагОси.push({'S':1,'Z':-1,'P':[3,2,0,1]}) //Y
		ШагОси.push({'S':2,'Z':1,'P':[1,2,3,0]}) //Z
		
	}else if(Грань.Лит == 'B' || Грань.Лит == 'T'){	

		ШагОси.push({'S':0,'Z':1,'P':[2,3,0,1]}) //X
		ШагОси.push({'S':2,'Z':1,'P':[1,2,3,0]}) //Z
		
	}else if(Грань.Лит == 'H' || Грань.Лит == 'Y'){	
	
		ШагОси.push({'S':0,'Z':1,'P':[1,2,0,3]}) //X
		ШагОси.push({'S':1,'Z':-1,'P':[2,3,0,1]}) //Y
		
	}else{
		
		return
		
	}
	
	for(var i=0; i <ШагОси.length; i++){
		
		var p1 = Грань.points[ШагОси[i].P[0]].xyz.slice()
		var p2 = Грань.points[ШагОси[i].P[1]].xyz.slice()
		var p3 = Грань.points[ШагОси[i].P[2]].xyz.slice()
		var p4 = Грань.points[ШагОси[i].P[3]].xyz.slice()

		var ШагОсь  = ШагОси[i].S

		var ЗнакОсь = ШагОси[i].Z
		
		while (p1[ШагОсь]*ЗнакОсь < p4[ШагОсь]*ЗнакОсь && p2[ШагОсь]*ЗнакОсь < p3[ШагОсь]*ЗнакОсь) {

			var Шаг = [0,0,0]

			Шаг[ШагОсь] = Родитель.ШагСетки[ШагОсь]*ЗнакОсь
		
			p1 = [p1[0] + Шаг[0], p1[1] + Шаг[1], p1[2] + Шаг[2]];

			p2 = [p2[0] + Шаг[0], p2[1] + Шаг[1], p2[2] + Шаг[2]];
			
			if (p1[ШагОсь]*ЗнакОсь >= p4[ШагОсь]*ЗнакОсь && p2[ШагОсь]*ЗнакОсь >= p3[ШагОсь]*ЗнакОсь){continue}
			
			var pa = СоздатьТочку(Родитель, p1[0]-x, p1[1]-y, p1[2]-z, '')
			
			var pв = СоздатьТочку(Родитель, p2[0]-x, p2[1]-y, p2[2]-z, '')
			
			Родитель.ЭлементыКарты.add(СоздатьЛинию(pa.xyz1, pв.xyz1))
			
		}
		
	}
	
}

function СоздатьЛинию(xyz1, xyz2, ЦветЛинии, Толщина){

	var Линия = svg.line(xyz1[0], xyz1[1], xyz2[0], xyz2[1])

	if (ЦветЛинии != undefined) {

		Линия.attr({"stroke": ЦветЛинии})

	}

	if (Толщина != undefined) {

		Линия.attr({"stroke-width": Толщина})

	}

	//СоздатьЛинию([], [], "black", 2)

	return Линия

}

function СоздатьКруг(xy, Радиус, ЦветЛинии, ЦветФона, Толщина){

	var круг = svg.circle(xy[0], xy[1], Радиус)

	круг.attr({'stroke': ЦветЛинии, 'fill': ЦветФона, "stroke-width": Толщина})

	return круг
	
	//СоздатьКруг([], 3, 'blue', 'red', 1)

}

function СоздатьПрямоугольник(xy, Размер1, Размер2, ЦветЛинии, ЦветФона, Толщина){

	var Прямоугольник = svg.polyline(
		xy[0], xy[1],
		xy[0] + Размер1, xy[1],
		xy[0] + Размер1, xy[1] - Размер2,
		xy[0], xy[1] - Размер2,
		xy[0], xy[1]
	);

	if (ЦветЛинии != undefined) {

		Прямоугольник.attr({'stroke': ЦветЛинии})

	}

	if (ЦветФона != undefined) {

		Прямоугольник.attr({'fill': ЦветФона})

	}

	if (Толщина != undefined) {

		Прямоугольник.attr({'stroke-width': Толщина})

	}

	return Прямоугольник

}

function СортироватьГраниПоВозрастаниюГлубины(i, j) { // По возрастанию
 
	if (i.Глубина > j.Глубина){
	
		return 1
	
	} else if (i.Глубина < j.Глубина){
	
		return -1;
	
	}else {
		
		return 0;
		
	}

}

function СортироватьГраниПоУбываниюГлубины(i, j) { // По убыванию
	
	if (i.Глубина > j.Глубина){
		
		return -1;
	
	}else if (i.Глубина < j.Глубина) {
	
		return 1;
	
	}else{
		
		return 0
	
	}
	
}