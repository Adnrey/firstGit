"use strict"

function iaaGraphixs(){
	
	var salf = this;
	
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
		var y = xyz[1] - pc[1];
		var z = xyz[2] - pc[2];

		return [x, y, z];
		
	}	
	
	// Получить коэффициенты плоскости (старый вариант по 4 точкам)
	this.getCoefficientsPlane4 = function(points){

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

		if (element.type == 'Точка действия' && element.parent != myCanvas.currentDraft){
			
			var parentElement = element.parent.parent;	

			var [pm, pn, pk] = parentElement.сentreValue;

			var [prx, pry, prz] = parentElement.turn;
			
			salf.addTurnAroundPointMatrixs(matrix, pm, pn, pk, prx, pry, prz);			
			
		}else{

			salf.addTurnAroundPointMatrixs(matrix, m, n, k, rx, ry, rz);
		
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

	//Получить вектор
	this.getVector = function(p1, p2){
		
		var v = {};
		
		v.x = p2.x - p1.x;
		v.y = p2.y - p1.y;
		v.z = p2.z - p1.z;
		
		return v;
	}

	//Получить вектор нормали плоскости
	this.getVectorNormalPlane = function(surface){
		
		var p1 = surface.points[0]; //Точка A, задающая плоскость
		
		var p2 = surface.points[1]; //Точка B, задающая плоскость
		
		var p3 = surface.points[2]; //Точка C, задающая плоскость
		
		var vp1 = salf.getVector(p1, p2); // Первый вектор на плоскости
		
		var vp2 = salf.getVector(p1, p3); // Второй вектор на плоскости
		
		return salf.vectorProduct(vp1, vp2);
		
	}
	
	// Векторное произведение векторов
	this.vectorProduct = function(p1, p2){

		var vpv = {};	

		vpv.x = p1.y * p2.z - p2.y * p1.z;
		vpv.y = p1.z * p2.x - p2.z * p1.x;
		vpv.z = p1.x * p2.y - p2.x * p1.y;
		
		return vpv;

	}
	 
	 // Скалярное произведение векторов
	function scalarProduct(p1, p2){
	
		var spv = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
		
		return spv;
		
	}	
	
	// Точка принадлежит областии
	this.pointBelongsRange = function(lines, p3){
		
		var sign = undefined;
		
		for (var line of lines){
			
			var cur_sign =
			
			_.round(
				(p3.x - line.p1.x)
				*
				(line.p2.y - line.p1.y)
				-
				(p3.y - line.p1.y)
				*
				(line.p2.x - line.p1.x)
				
				, 5);
				
			// console.log('cur_sign', cur_sign);
				
			if(cur_sign === 0){
				
				console.log('sign = 0');
				
				return true;
				
			}else if (sign === undefined){
				
				sign = cur_sign
			
			}else if (sign < 0 && cur_sign > 0 || sign > 0 && cur_sign < 0){
				
				// console.log('Не пренадлежит');
				
				return false;
			
			}
			
		}
		
		if (sign == undefined){
		
			console.log('Не пренадлежит');
		
			return false;
		
		}else{

			console.log('Принадлежит');
			
			return true;
			
		}
		
		
	}
	
	// Точка пересечения плоскости и отрезка
	this.intersectionSegmentAndPlane = function(surface, l1, l2){
		
		var p1 = surface.points[0]; //Точка A, задающая плоскость
		
		//...............................
		
		var vl = salf.getVector(l1, l2); // Направляющий вектор. (W)
		
		var np =  salf.getVectorNormalPlane(surface); //Вектор нормали к плоскости (произведение векторов плоскости) (N)
		
		var e = scalarProduct(np, vl); // Сколярное произведение направляющего вектора и вектора нормали.
		
		//--
		
		var v = salf.getVector(l1, p1);
		
		var d = scalarProduct(np, v);
		
		//--
		
		if (e != 0 ){
		
			// Это значит что векторы нормали и направляющий вектор НЕ перпендикулярны
			// Это значит что прямая не параллельна плоскости.
			// Это значит что прямая пересикается с плоскостью
			
			// 1. Найти точку пересечения прямой и плоскости

			var p = {};
			
			p.x = l1.x + vl.x * d / e;
			p.y = l1.y + vl.y * d / e;
			p.z = l1.z + vl.z * d / e;			
			
			// 2. Определить принадлежит ли точка пересечения отрузку	

			var vl1_p = salf.getVector(p, l1);
			
			var vl2_p = salf.getVector(p, l2);
			
			if (scalarProduct(vl1_p,vl2_p) <= 0){ // Точка принадлежит отрезку
				
				return p;
			
			}else{

				return undefined;
			
			};
			
		}else if(e == 0){
			
			// Это значит что векторы нормали и направляющий вектор перпендикулярны.
			// Это в свою очередь значит что прямая паралельна плоскости

			// Прямая либо парралельна плоскости, либо лежит в ней
			// Если параллельна то Ax + By + Cz + D != 0
			// Если лижит в плоскости то Ax + By + Cz + D == 0
			// Подставить координаты любой точки отрезка в уравнение поверхности.
			
			var d = scalarProduct(np, vl); 
			
			if (d == 0){
				
				// прямая принадлежит плоскости
				
				console.log('прямая принадлежит плоскости');
				
			}else{
				
				console.log('прямая параллельна плоскости');
				// прямая параллельна плоскости
				
			}
			
			return undefined;
			
		}
		
	}
	
	// Получить коэффициенты плоскости 
	this.getCoefficientsPlane = function(points){

		//ax + by + cz + d = 0 уравненеи плоскости

		var p1 = points[0]; var p2 = points[1]; var p3 = points[2];

		var x1 = p1.x, x2 = p2.x, x3 = p3.x;

		var y1 = p1.y, y2 = p2.y, y3 = p3.y; 

		var z1 = p1.z, z2 = p2.z, z3 = p3.z; 

		var a = (y1 - y2)*(z1 + z2) + (y2 - y3)*(z2 + z3) + (y3 - y1)*(z3 + z1);

		var b = (z1 - z2)*(x1 + x2) + (z2 - z3)*(x2 + x3) + (z3 - z1)*(x3 + x1);

		var c = (x1 - x2)*(y1 + y2) + (x2 - x3)*(y2 + y3) + (x3 - x1)*(y3 + y1);

		var d = -(a * p1.x + b * p1.y + c * p1.z)

		if (a == -0) a = 0
		if (b == -0) b = 0
		if (c == -0) c = 0
		if (d == -0) d = 0

		return {a:a, b:b, c:c, d:d}

	}	
	
	// Точка пересечения двух отрезков
	this.getPointIntersectionLine = function(line1, line2){
		
		var a1 = line1.p1, a2 = line1.p2;
		
		var b1 = line2.p1, b2 = line2.p2;
		
		console.log("a1", a1, "a2", a2, "b1", b1, "b2", b2);
		
		var kcm = [ // Матрица коэффициентов сравнения отрезка;
			[a2.x - a1.x, b1.x - b2.x],
			[a2.y - a1.y, b1.y - b2.y]
		];
	
		console.log("kcm", kcm);
	
		var rm = [ // Матрица значений правых частей уравнения
			[b1.x - a1.x],
			[b1.y - a1.y]
		];

		console.log("rm", rm);		
		
		var okcm = salf.inverseMatrix(kcm); // Обратная матрица
		
		console.log("okcm", okcm);			
		
		var pm = salf.multiplyMatrix(okcm, rm);// Значение параметров описания отрезуов
		
		console.log("pm", pm);			
		
		var x = a1.x + (a2.x - a1.x) * pm[0][0];

		var y = a1.y + (a2.y - a1.y) * pm[0][0];
		
		var p = salf.get_point(x, y, 0,0,0,0);
		
		return p;
	
	}
	
	//...........
	
	// Нахождение определителя матрицы
	function determinant(A){   
	
		var N = A.length, B = [], denom = 1, exchanges = 0;
		
		for (var i = 0; i < N; ++i){

			B[i] = [];
		   
			for (var j = 0; j < N; ++j){
				B[i][j] = A[i][j];
			}
			
		}
		
		for (var i = 0; i < N-1; ++i){

			var maxN = i, maxValue = Math.abs(B[i][i]);
		   
			for (var j = i+1; j < N; ++j){

				var value = Math.abs(B[j][i]);
			  
				if (value > maxValue){
					
					maxN = j; maxValue = value;

				}
			
			}
			
			
			if (maxN > i){
			  
				var temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
				
				++exchanges;
				
			} else {

				if (maxValue == 0) return maxValue; 
				
			}
			
		   var value1 = B[i][i];
		
			for (var j = i+1; j < N; ++j){

				var value2 = B[j][i];
				
				B[j][i] = 0;
				
				for (var k = i+1; k < N; ++k) {
					
					B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
				
				}
			}
		   
			denom = value1;
		 
		}                                           
		
		if (exchanges%2) {
			
			return -B[N-1][N-1];
		
		}else{
			
			return B[N-1][N-1]
		
		};
		
	}
	
	//Алгебраическое дополнение матрицы
	function matrixCofactor(i,j,A){   
	 
		var N = A.length, sign = ((i+j)%2==0) ? 1 : -1;
	
		for (var m = 0; m < N; m++) {

			for (var n = j+1; n < N; n++) {
				
				A[m][n-1] = A[m][n]
			
			};
		
			A[m].length--;
	
		}
		
		for (var k = i+1; k < N; k++){

			A[k-1] = A[k];
		
		}
		
		A.length--;
		
		return sign*determinant(A);
	
	}
	
	//Присоединенная матрица	
	function adjugateMatrix(A){      
	
		var N = A.length, B = [], adjA = [];
		
		for (var i = 0; i < N; i++){

			adjA[i] = []; 
		   
			for (var j = 0; j < N; j++){

				for (var m = 0; m < N; m++){

					B[m] = [];

					for (var n = 0; n < N; n++){

						B[m][n] = A[m][n];

					}

				}

				adjA[i][j] = matrixCofactor(j,i,B);

			}
		
		}

		return adjA;
	
	}

	// Обратная матрица
	this.inverseMatrix = function(A){
		
		var det = determinant(A);
		
		if (det == 0) return false;
		
		var N = A.length, A = adjugateMatrix(A);
		
		for (var i = 0; i < N; i++){
			
			for (var j = 0; j<N; j++) {
				
				A[i][j] /= det;
			
			}

		}

		return A;
		
	}

	//Перемножение матриц
	this.multiplyMatrix = function(A,B){
		
		var rowsA = A.length, colsA = A[0].length,
			rowsB = B.length, colsB = B[0].length,
			C = [];

		if (colsA != rowsB) return false;

		for (var i = 0; i < rowsA; i++) {
		
			C[i] = [];
		
		}

		for (var k = 0; k < colsB; k++){

			for (var i = 0; i < rowsA; i++){

				var temp = 0;
				
				for (var j = 0; j < rowsB; j++){
					
					temp += A[i][j]*B[j][k];
					
				}
				
				C[i][k] = temp;
				
			}
		 
		}

		return C;
	
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
	
	// Создать текст
	this.createText = function(xy, text, color){
		
		var text = myCanvas.snap().text(xy[0], xy[1], text)
		
		if (color != undefined) {

			text.attr({"stroke": color, 'stroke-width': 0.1, 'fill': color, 'zIndex': 500})

		}
		
		return text;
		
	}
	
	//..........

	// Точка
	function point(x, y, z){
		
		this.x = x;
		
		this.y = y;
		
		this.z = z;
		
		this.xy = [x, y];
		
	}

	// Линия
	function line(p1, p2){
		
		var salf = this;
		
		this.p1 = p1;
		
		this.p2 = p2;
		
		this.xy = [p1.xy,p2.xy];

	}

	// Поверхность
	function surface(points){
		
		var salf = this;
		
		this.points = [];
		
		this.lines = [];
		
		this.xy = [];
		
		{ // Инициализация
			
			var ps = undefined; // Первая точка

			var pn = undefined; // Текущая точка
			
			var _line = undefined;
			
			_.forEach(points, function(item){
				
				salf.points.push(item);
		
				if(_.isUndefined(ps)){
					
					ps = item;

				}else{
					
					_line = new line(pn, item);
					
					salf.lines.push(_line);
					
					salf.xy.push(_line.xy);
					
				}

				pn = item;
				
			});	
			
			if (ps != pn) {
				
				_line = new line(pn, ps);

				salf.lines.push(_line);
				
				salf.xy.push(_line.xy);
				
			};
			
		}
		
	}

	// Координаты точек равны
	this.points_equal = function(p1, p2){
		
		if(
			_.round(p1.x,5) == _.round(p2.x,5) &&
			_.round(p1.y,5) == _.round(p2.y,5) &&
			_.round(p1.z,5) == _.round(p2.z,5)
			) {
		
			return true 
			
		}else {
			
			return false
			
		};
		
		
	}
	
	// Получить точку
	this.get_point = function(x,y,z){
		
		return new point(x, y, z);
		
	}

	// Получить линия
	this.get_line = function(p1, p2){
		
		return new line(p1, p2);
		
	}	

	// Получить поверхность
	this.get_surface = function(points){
		
		return new surface(points);
		
	}	

}