/*
 * author: Nadeem Elahi
 * nadeem.elahi@gmail.com
 * nad@3deem.com
 * license: gpl v3
 *
 */

"use strict";

new function (){

	var idx ,
		idxPrev ,
		lim = 30 ,
		increment = -1 ,
		images = [] ,
		cnv = document.getElementById("cnv")  ,
		ctx = cnv.getContext("2d") ,
		node_rangeInput = document.getElementById("panningLampRangeInput") ,
		raf = window.requestAnimationFrame || 
		window.msRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		function(cb){setTimeout(cb,30);} ;
	
	var tm = 0 ,  // time
		dt ,  // different
		ct ,  // current
		lt ,  // last
		tlim = 100 ; // limit
	
	function ticker ( ) {

		ct = Date.now ( ) ;
		dt = ct - lt ;
		tm += dt;
		lt = ct;
		if ( tm > tlim ) {
			tm = 0 ;
			update ( ) ; 
		}
		raf ( ticker ) ;
	}


	function update ( ) {

		ctx.drawImage( images[ idx ] ,0,0,cnv.width,cnv.height);
		node_rangeInput.value = idx;

		idx += increment;

		if ( idx < 0 ) {

			idx = 0 ;
			increment = 1;
			tlim = 2000 ;

		} else if ( idx > 29 ) {
			
			idx = 29;
			increment = -1;
			tlim = 2000 ;

		} else {
			tlim = 100 ;
		}

		idxPrev = idx;

	}


	// on page reload, the browser will remember
	// the current position and so the default 
	// starting value may be different from 
	// that 29 set in html
	idx = idxPrev = parseInt ( node_rangeInput.value ) ;

	new function () {

		window.addEventListener("resize", windowResizeCB, false);
		function windowResizeCB(){
			cnv.style.width = cnv.width = window.innerWidth;
			cnv.style.height = cnv.height = window.innerHeight;
		}

		windowResizeCB();

	};

	// register range input listener
	new function ( ) {

		function rangeSlide(e){
			if(!e) var e = window.event;
			
			tm = 0;
			tlim = 5000;

			idx = parseInt( this.value ) ;

			if ( idx > idxPrev ) increment = 1;
			else increment = -1;

			idxPrev = idx;

			ctx.drawImage(images[ idx ],0,0,cnv.width,cnv.height);

		}
		node_rangeInput.addEventListener("input", rangeSlide, false);

	};


	// load images
	new function (){

		var names = [] ;

		// generate file names
		// 0 -> 29, names 01 -> 30
		// 0001.png ... 0030.png
		new function ( ) {

			var jdx, path = "./panningLampAnim-jpg/00"; 

			for ( jdx = 1 ; jdx <= lim ; jdx ++ ) {

				if ( jdx < 10 ) {
					names.push( path + "0" + jdx + ".jpg" );
				} else {
					names.push( path + jdx + ".jpg" );
				}
			}

		};

		// load images
		new function ( ) {

			var jdx;
			for( jdx = 0 ; jdx < lim ; jdx++ ){

				loadImage( jdx );

			}			

			function loadImage( jdx ){
				images[ jdx ] = new Image();
				images[ jdx ].addEventListener("load", imgldd, false);
				images[ jdx ].src = names[ jdx ];
			}

			var cnt = 0;
			function imgldd ( ) {

				cnt++;
				//console.log(cnt); 1,2,...30

				if ( cnt == lim ) {
					lt = Date.now();
					update ( ) ;
					raf ( ticker ) ;
				}
				
			}
		};

	};

};
