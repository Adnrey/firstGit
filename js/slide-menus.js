var showLeft = document.getElementById( 'showLeft' ),
	showRight = document.getElementById( 'showRight' ),
	showTop = document.getElementById( 'showTop' ),
	showBottom = document.getElementById( 'showBottom' );
			
showLeft.onclick = function() {
  
  $("#cbp-spmenu-s1").toggleClass( 'cbp-spmenu-open' );
  
};


showRight.onclick = function() {

  $("#cbp-spmenu-s2").toggleClass( 'cbp-spmenu-open' );

};

showTop.onclick = function() {

  $("#cbp-spmenu-s3").toggleClass( 'cbp-spmenu-open' );

};

showBottom.onclick = function() {

  $("#cbp-spmenu-s4").toggleClass( 'cbp-spmenu-open' );

};
