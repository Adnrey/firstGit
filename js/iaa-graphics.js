"use strict"

function iaaGraphixs(){
	
	var salf = this;
	
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


	
	
	
	
	
	
}