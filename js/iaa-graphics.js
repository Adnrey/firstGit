"use strict"

function iaaGraphixs(){
	
	var salf = this;
	
	//..........	
	
	// Получить среднии значения координат по точкам
	this.getAverageCoordinatesOfpoints = function(xyz, points){
		
		var pc = [0,0,0];
		
		for (var i = 0; i < points.length; i++) {
		
			var p = points[i].xyz;

			for (var j = 0; j < 3; j++) {
			
				pc[j] = pc[j] + p[j];
			
			}
			
		}
		
		for (var i = 0; i < 3; i++) {
			pc[i] = pc[i]/points.length
		}
		
		var x = pc[0] - xyz[0];
		var y = pc[1] - xyz[1];
		var z = pc[2] - xyz[2];

		return [x, y, z];
		
	}	
	
	// Получить коэффициенты плоскости
	this.getCoefficientsPlane = function(points){

		//ax + by + cz + d = 0 уравненеи плоскости

		var p1 = points[0].xyz1
		
		var p2 = points[1].xyz1
		
		var p3 = points[2].xyz1
		
		var p4 = points[3].xyz1	

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
		
		return [a, b, c, d]

	}	
	
	// Эта фигура выпуклая
	this.thisConvexShape = function(points){
		
		var p1 = points[0].xyz1
		var p2 = points[1].xyz1
		var p3 = points[2].xyz1
		var p4 = points[3].xyz1
		
		var V1 = salf.vectorMultiplyRelatedVectors(p4,p1,p2)
		var V2 = salf.vectorMultiplyRelatedVectors(p1,p2,p3)
		var V3 = salf.vectorMultiplyRelatedVectors(p2,p3,p4)
		var V4 = salf.vectorMultiplyRelatedVectors(p3,p4,p1)
		
		// надо доделать,
		//если
		// результат 0, это не фигура;					возврат  0
		// все + или 0 выпуклая правая ориентация +;	возврат  1
		// все - или 0 выпуклая	левая  ориентация -;	возврат -1

		return true
		
	}
	
	//..........
	
	// Добавить матрицу смещения (ДобавитьМатрицуСмещения)
	this.addShiftMatrix = function(arr, m, n, k){
		
		arr.push([
			[ 1,  0,  0,  0],
			[ 0,  1,  0,  0],
			[ 0,  0,  1,  0],
			[ m,  n,  k,  1]
		])
		
		return arr
		
	}

	// Добавить матрицу поворота (ДобавитьМатрицыПоворота)
	this.addTurnMatrixs = function(arr, rx, ry, rz){
		
		var [rx1, ry1, rz1] = myCanvas.turn;
		
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

	// Добавить матрицу поворота вокруг точки (ДобавитьМатрицыПоворотаВокругТочки)
	this.addTurnAroundPointMatrixs = function(arr, m, n, k, rx, ry, rz){
		
		salf.addShiftMatrix(arr, -m, -n, -k)

		salf.addTurnMatrixs(arr, rx, ry, rz)

		salf.addShiftMatrix(arr, m, n, k)	
		
	}

	// Добавить матрицу маштабирования (ДобавитьМатрицуМасштабирования)
	this.addZoomMatrix = function(arr){
		
		var s = myCanvas.scale;
		
		arr.push([
			[  1,  0,  0,  0],
			[  0,  1,  0,  0],
			[  0,  0,  1,  0],
			[  0,  0,  0,  s]
		])
		
	}

	// Добавить матрицу проекции (ДобавитьМатрицуПроекции)
	this.addProjectionMatrix = function(arr){
		
		arr.push([
			[  1,  0,  0,  0],
			[  0,  1,  0,  0],
			[  0,  0,  1,  0.001],
			[  0,  0,  0,  1]
		])
		
	}

	// Перемножить матрицы (ПеремножитьМатрици)
	this.multiplyMatrixByMatrix = function(M1, M2){

		var M3 = []

		for (var i = 0; i < M1.length; i++) {

			var a = M1.slice()
		
			for (var j = 0; j < M2.length; j++) {

				var b = M2.slice()
			
				var c = salf.multiplyPointByMatrix(a[i].slice(), b[j].slice())

				a[i][0] = c[0]/c[3].toFixed(10)
				a[i][1] = c[1]/c[3].toFixed(10)
				a[i][2] = c[2]/c[3].toFixed(10)
				a[i][3] = c[3]/c[3].toFixed(10)
				
			}
		
			M3.push(a[i])
		
		}
		
		return M3

	}

	// Умножить точку на матрицу (УмножитьТочкуНаМатрицу)
	this.multiplyPointByMatrix = function(P, M){

		var PM = [];

		for (var i = 0; i < M.length; i++) {

			for (var j = 0; j < M[i].length; j++) {

				if (PM[j] == undefined){PM[j] = 0}
			
				PM[j] =  PM[j] + P[i] * M[i][j] 
		
			}	
		
		}
		
		return PM
		
	}

	// Получить Координаты точки (КоординатыТочки)
	this.getCoordinatesPoint = function(element, x, y, z, m, n, k, rx, ry, rz){

		var xyz = [[x, y, z, 1]] // Точки

		var matrix = []

		var currentParent = element.Parent;
		
		if (currentParent == undefined){
		
			salf.addTurnAroundPointMatrixs(matrix, m, n, k, rx, ry, rz);
			
		 }else{

			if (element.type == 'Точка действия' && currentParent.Parent != undefined){
				
				currentParent = currentParent.Parent;
				
			}
		 
			var [pm, pn, pk] = currentParent.сentreValue;

			var [prx, pry, prz] = currentParent.turn;
			
			salf.addTurnAroundPointMatrixs(matrix, pm, pn, pk, prx, pry, prz);
			
		}
		
		//..
		
		salf.addShiftMatrix(matrix, -myCanvas.m, -myCanvas.n, -myCanvas.k)
		
		salf.addZoomMatrix(matrix)
		
		salf.addProjectionMatrix(matrix)

		salf.addShiftMatrix(matrix, myCanvas.m, myCanvas.n, myCanvas.k)
		
		
		xyz = salf.multiplyMatrixByMatrix(xyz, matrix);

		var xx = xyz[0][0]; var yy = xyz[0][1]; var zz = xyz[0][2]

		return [xx, yy, zz, 1]

	}
	
	// Вектор от точки наблюдения до точки
	this.vectorFromObservationPointToPoint = function(observationPoint, point){
	 
		var [x1,y1,z1] = observationPoint;
		
		var [x2,y2,z2] = point;
		
		var value 
			= Math.sqrt
				(
				Math.pow(x2-x1, 2) +
				Math.pow(y2-y1, 2) +
				Math.pow(z2-z1, 2)
				);
		
		return value;
		
	}

	// Векторное произведение смежных векторов
	this.vectorMultiplyRelatedVectors = function(p3,p1,p2){
		
		var V3V1_i =  p3[0]-p1[0]
		var V3V1_j =  p3[1]-p1[1]

		var V1V2_i =  p2[0]-p1[0]
		var V1V2_j =  p2[1]-p1[1]
		
		var V = (V3V1_i * V1V2_i * 0)	//i * i = 0
		  + (V3V1_i * V1V2_j * 1)		//i * j = 1
		  + (V3V1_j * V1V2_i * -1)		//j * i = -1 
		  + (V3V1_j * V1V2_j * 0)		//j * j = 0
		
		return V
		
	}
	
	//...........
	
	// Создать линию (СоздатьЛинию)
	this.createLine = function(xyz1, xyz2, color, thickness){

		//thickness - толщина линии
	
		var line = myCanvas.snap().line(xyz1[0], xyz1[1], xyz2[0], xyz2[1])

		if (color != undefined) {

			line.attr({"stroke": color})

		}

		if (thickness != undefined) {

			line.attr({"stroke-width": thickness})

		}

		//СоздатьЛинию([], [], "black", 2)

		return line

	}
	
	// Создать круг (СоздатьКруг)
	this.createСircle = function(xy, radius, color, background, thickness, element){

		//background = цвет фона 
	
		//color - цвет линии
	
		//thickness - толщина линии
	
		var circle = myCanvas.snap().circle(xy[0], xy[1], radius);

		circle.attr({'stroke': color, 'fill': background, "stroke-width": thickness})

		if (element != undefined) element.snapElements.add(circle);
		
		return circle
		
		//createСircle([], 3, 'blue', 'red', 1)

	}
	
}