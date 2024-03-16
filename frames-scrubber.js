/*
 * author: Nadeem Elahi
 * nadeem.elahi@gmail.com
 * nad@3deem.com
 * license: gpl v3
 *
 */

"use strict";

new function (){
	var aspect = 600/800 ,
		lim = 5 ,
		speed = 1000 ,
		delay = 5000 ,
		ext = ".jpg" , // or png 
		path = "./frames" ,
		node_rangeInput = document.getElementById("framesRangeInput") ,
		cnv = document.getElementById("scrubbingFrames") ;

	var idx ,
		idxPrev ,
		increment = -1 ,
		images = [] ,
		ctx = cnv.getContext("2d") ,
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
		tlim = 1000 ; // limit
	
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

		//console.log( idx , images [ idx ] );
		ctx.drawImage( images[ idx ] ,0,0,cnv.width,cnv.height);
		node_rangeInput.value = idx;

		idx += increment;

		if ( idx < 0 ) {

			idx = 0 ;
			increment = 1;
			tlim = delay;

		} else if ( idx > (lim - 1) ) {
			
			idx = ( lim - 1 ) ;
			increment = -1;
			tlim = delay;

		} else {
			tlim = speed;
		}

		idxPrev = idx;

	}


	new function () {

		var resizedWidth , resizedHeight ;
		window.addEventListener("resize", windowResizeCB, false);
		function windowResizeCB(){
			// if window.innerWidth > 600 then 600 else window.innerWidth
			resizedWidth = ( window.innerWidth > 600) ? 600 : window.innerWidth;
			resizedWidth -= 8; // #pageWrapper has 4px padding
			// aspect = height / width = 800 / 600
			// ( height / width ) * width = height
			resizedHeight = aspect * resizedWidth;

			cnv.style.width = cnv.width = resizedWidth;
			cnv.style.height = cnv.height = resizedHeight;
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

			var jdx ;

			for ( jdx = 1 ; jdx <= lim ; jdx ++ ) {

				if ( jdx < 10 ) { // 0001, 0002, ... 0009

					names.push( path + "/000" + jdx + ext );

				} else if ( jdx < 100 ) { // 0010, 0011, ... 0099

					names.push( path + "/00" + jdx + ext );

				} else if ( jdx < 1000 ) { // 0100, 0101, ... 0999

					names.push( path + "/0" + jdx + ext );

				} else if ( js < 10000 ) { // 1000, 1001, ... 9999

					names.push( path + "/" + jdx + ext );

				} else {
					//console.log( "error: image name cnt too large " );

				}
			}
			//console.log(names);

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

					// on page reload, the browser will remember
					// the current position and so the default 
					// starting value may be different from 
					// that 29 set in html
					idx = idxPrev = parseInt ( node_rangeInput.value ) ;
					//console.log(idx);


					//console.log(images);
					lt = Date.now();
					update ( ) ;
					raf ( ticker ) ;
				}
				
			}
		};

	};

};
