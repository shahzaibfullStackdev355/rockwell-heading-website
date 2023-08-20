
		var windowWidth = 0;
		var windowHeight = 0;
		var totalDifference = 0;
		var counter = 1;
		var lastKeypress = new Date().getTime();
		var amountImages;
		var animationInterval;
		var slideshowInterval;
		var wrapAround;
		var loadingFinished = true;
		var now = new Date();
		var last = 0;
		var thumbs = $("#thumbs img");
		var ignoreHashChange = false;
		var nextThumbsID = 0;
		var prevThumbsID = 0;
		var slideshowID = 0;
		var oldDistance = 0;
		var triggerClick = true;
		var imageLoadedCounter = 0;
		var elementMouseIsOver;
		var opacity = 0.3;
		var slideShowTimeoutID = 0;
		var allowDownload;
		
		function calculateDifference(imageNo) {


			var fullWidth = 0;
						
			var prevWidth = 0;

			var pictures = $("#pictures").children();
			
			if (wrapAround) {

				for ( var i = 0; i < pictures.length; i++ ) {
					
					if ( i < (pictures.length - 1)/2 ) {
						prevWidth += pictures[i].clientWidth;
					}				
					fullWidth += pictures[i].clientWidth;
					
				}
			
			}
			else {
				
				var tempCounter = imageNo - 4;
						
				while (tempCounter <= imageNo + 4) {
					if (tempCounter < imageNo)
						prevWidth += $("#image-" + tempCounter).outerWidth();
					fullWidth += $("#image-" + tempCounter).outerWidth();
					tempCounter++;
				}
				
			}			

			var widthToMiddle = prevWidth + ( $("#image-" + imageNo).outerWidth() / 2 );

			var offSet = widthToMiddle - windowWidth/2;

			var currentOffset = -1 * parseFloat($("#pictures").css("left"));

			var difference = offSet - currentOffset;

			if (!wrapAround) {

				if (!(amountImages === 1 && difference >= 0)) {

				if (currentOffset + difference < 0) {
					difference = 0 - currentOffset;
				}
	
				if ( (currentOffset + difference) > (fullWidth - windowWidth) ) {
					difference = (fullWidth - windowWidth) - currentOffset;
				}

				if (amountImages === 1) {
					difference /= 2;
				}

				}

			}

			return -1 * difference;
						
		}

		function calculateDifferenceThumbs(imageNo) {

			var parentWidth = $(".thumbs").width();

			var fullWidth = $("#thumbs").width();
						
			var prevWidth = 0;
					
			var tempCounter = 0;

			var widthToMiddle = 0;

			if ($(".thumbs").hasClass("collapsed")) {
				while (tempCounter < imageNo - 1) {
					prevWidth += thumbs.height()/thumbs.eq(tempCounter)[0].height * thumbs.eq(tempCounter)[0].width;
					tempCounter++;
				}
				widthToMiddle = prevWidth + ( ( thumbs.height()/thumbs.eq(imageNo - 1)[0].height * thumbs.eq(imageNo - 1)[0].width ) / 2 );
			}

			else {					
				while (tempCounter < imageNo - 1) {
					prevWidth += thumbs.eq(tempCounter)[0].width;
					tempCounter++;
				}				
				widthToMiddle = prevWidth + ( thumbs.eq(imageNo - 1)[0].width / 2 );
			}		

			var offSet = widthToMiddle - windowWidth / 2;

			var currentOffset = -1 * parseFloat($("#thumbs").css("left"));

			var difference = offSet - currentOffset;
			
			if (counter !== 1 && counter !== amountImages) {				
				
				$("#nextThumbs").removeClass( "hidden" );
				$("#prevThumbs").removeClass( "hidden" );
					
			}
				
			if (currentOffset + difference < 0) {
				difference = 0 - currentOffset;
				$("#prevThumbs").addClass( "hidden" );
			}
	
			else if ( (currentOffset + difference) > (fullWidth - parentWidth) ) {
				difference = fullWidth - currentOffset - parentWidth;
				$("#nextThumbs").addClass( "hidden" );
			}
	
			else {
				
				$("#nextThumbs").removeClass( "hidden" );
				$("#prevThumbs").removeClass( "hidden" );
					
			}
			
			if (counter === 1) {
				$("#prevThumbs").addClass( "hidden" );	
				$("#nextThumbs").removeClass( "hidden" );			
			}
			
			if (counter === amountImages) {
				$("#nextThumbs").addClass( "hidden" );	
				$("#prevThumbs").removeClass( "hidden" );			
			}

			if (fullWidth <= parentWidth) {				
				$("#nextThumbs").addClass( "hidden" );
				$("#prevThumbs").addClass( "hidden" );
			}			

			return -1 * difference;
						
		}

		

		function nextImage(direction) {

			if ($("#pictures").children()[1] && $("#pictures").children()[0].id !== $("#pictures").children()[1].id) {

			now = new Date();

			if (now - last > animationInterval) {

				last = now;

				if (!wrapAround) {

					if (counter + direction > 0 && counter + direction <= amountImages) {
						
						if(loadingFinished) {
		
							counter+=direction;
		
							if (direction == +1 && counter > 3 && counter <= amountImages - 2 ) {
		
								loadingFinished = false;
								
								var oldImage = $("#pictures :first-child");
			
								var widthDiff = oldImage.outerWidth();

										
								var img = new Image();
								img.id = "image-" + (counter + 2);
								img.src = thumbs.eq(counter + 1).attr('data-href');
								img.alt = thumbs.eq(counter + 1).attr('alt');
								
								$(img).load( function() {	

									
									if (!allowDownload) {
										$(this).on('contextmenu',function(e) { e.preventDefault(); return false; } );
									};		
									$(this).on('dragstart', function(event) { event.preventDefault(); return false; });
	
									oldImage.remove();	
										
									$("#pictures").css("left" ,'+=' + widthDiff + "px");	
	
									onResize(false);	
	
									animateToNextImage(direction);
	
									$("#pictures").append(this);
										
									var calcWidth = parseInt(windowHeight / $(this).height() * $(this).width() );
										
									if (calcWidth > windowWidth) {
										$(this).css("height","auto");
										$(this).css("width",function(){return windowWidth});
										$(this).css("margin-top",function(){return (windowHeight- $(this).height() )/2});				
									}	
									else {
										$(this).css("height","100%");
										$(this).css("width","auto");
									}
										
									loadingFinished = true;
									
								});
							}
							
		
							else if (direction == -1 && counter >= 3 && counter < amountImages - 2 ) {
		
								loadingFinished = false;
		
								var oldImage = $("#pictures :last-child");
														

								var img = new Image();
								img.id = "image-" + (counter - 2);
								img.src = thumbs.eq(counter - 3).attr('data-href');
								img.alt = thumbs.eq(counter - 3).attr('alt');
																
								$(img).load(function() {			
									
									if (!allowDownload) {
										$(this).on('contextmenu',function(e) { e.preventDefault(); return false; } );
									};
									$(this).on('dragstart', function(event) { event.preventDefault(); return false; });		
									
									oldImage.remove();
	
									$("#pictures").prepend(this);
	
									onResize(false);
										
									var widthDiff = parseInt(windowHeight / $(this).height() * $(this).width() );
											
									if (widthDiff > windowWidth) {
										$(this).css("height","auto");
										$(this).css("width",function(){return windowWidth});
										$(this).css("margin-top",function(){return (windowHeight - $(this).height() )/2});		
										widthDiff = windowWidth;		
									}	
									else {
										$(this).css("height","100%");
										$(this).css("width","auto");
									}
															
									$("#pictures").css("left" ,'-=' + widthDiff + "px");				
															
									animateToNextImage(direction);	
				
									loadingFinished = true;
										
								});
							}
	
							else {
								animateToNextImage(direction);
							}
							
						}					
						
					}

				}

				else {
					if(loadingFinished) {
		
							counter+=direction;

							if (counter > amountImages) {
								counter -= amountImages;
							}

							if (counter <= 0) {
								counter += amountImages;
							}
		
							if (direction === +1) {
		
								loadingFinished = false;
								
								var oldImage = $("#pictures :first-child");
			
								var widthDiff = oldImage.outerWidth();

								var increasedCounter = counter + 2;

								if (increasedCounter > amountImages) {
									increasedCounter -= amountImages;
								}
										

								var img = new Image();
								img.id = "image-" + (increasedCounter);
								img.src = thumbs.eq(increasedCounter - 1).attr('data-href');
								img.alt = thumbs.eq(increasedCounter - 1).attr('alt');
								
								$(img).load( function() {	
									
									if (!allowDownload) {
										$(this).on('contextmenu',function(e) { e.preventDefault(); return false; } );
									};
									$(this).on('dragstart', function(event) { event.preventDefault(); return false; });
	
									oldImage.remove();	
										
									$("#pictures").css("left" ,'+=' + widthDiff + "px");	
	
									onResize(false);	
	
									animateToNextImage(direction);
	
									$("#pictures").append(this);
										
									var calcWidth = parseInt(windowHeight / $(this).height() * $(this).width() );
										
									if (calcWidth > windowWidth) {
										$(this).css("height","auto");
										$(this).css("width",function(){return windowWidth});
										$(this).css("margin-top",function(){return (windowHeight- $(this).height() )/2});				
									}	
									else {
										$(this).css("height","100%");
										$(this).css("width","auto");
									}
										
									loadingFinished = true;
									
								});
							}
							
		
							else if (direction === -1) {
		
								loadingFinished = false;
		
								var oldImage = $("#pictures :last-child");

								var decreasedCounter = counter - 2;

								if (decreasedCounter <= 0) {
									decreasedCounter += amountImages;
								}
									

								var img = new Image();
								img.id = "image-" + (decreasedCounter);
								img.src = thumbs.eq(decreasedCounter - 1).attr('data-href');
								img.alt = thumbs.eq(decreasedCounter - 1).attr('alt');
																
								$(img).load(function() {			
									
									if (!allowDownload) {
										$(this).on('contextmenu',function(e) { e.preventDefault(); return false; } );
									};
									$(this).on('dragstart', function(event) { event.preventDefault(); return false; });		
									
									oldImage.remove();
	
									$("#pictures").prepend(this);
	
									onResize(false);
										
									var widthDiff = parseInt(windowHeight / $(this).height() * $(this).width() );
											
									if (widthDiff > windowWidth) {
										$(this).css("height","auto");
										$(this).css("width",function(){return windowWidth});
										$(this).css("margin-top",function(){return (windowHeight - $(this).height() )/2});		
										widthDiff = windowWidth;		
									}	
									else {
										$(this).css("height","100%");
										$(this).css("width","auto");
									}
															
									$("#pictures").css("left" ,'-=' + widthDiff + "px");				
															
									animateToNextImage(direction);	
				
									loadingFinished = true;
										
								});
							}
							
						}	
				}

			}
			}
			
		}

		function animateToNextImage(direction) {

			var exifInfo = $("#exifInfo");
			exifInfo.html(thumbs.eq(counter-1).attr('data-meta') || "No information available");
			exifInfo.css("margin-top",function() { return -1*$(this).outerHeight()/2 });
			if (exifInfo.hasClass("collapsed")) {
				exifInfo.css("right",function() { return -1*$(this).outerWidth() + "px" });
			}
			else {
				$("#exifCollapse").css("right",function() { return exifInfo.outerWidth() + "px" });
			}
			
			ignoreHashChange = true;
			location.hash = encodeURIComponent($("#image-"+counter)[0].alt);
				
			$("#pictures").stop().animate({ 
				left: '+=' + (calculateDifference(counter)) + "px" 
			}, animationInterval);
			$("#thumbs").stop().animate({ 
				left: '+=' + (calculateDifferenceThumbs(counter)) + "px" 
			}, animationInterval);
			
			if ( amountImages < $("#pictures").children().length ) {
				$("#pictures").children().eq(Math.floor($("#pictures").children().length/2)).stop().animate({
					opacity: 1
				},animationInterval, "linear");
			}
			else {
				$("#image-"+counter).stop().animate({
					opacity: 1
				},animationInterval, "linear");
			}
				
			var lastImageCounter = counter - direction;
			if (lastImageCounter <= 0) {
				lastImageCounter += amountImages;			
			}
			else if (lastImageCounter > amountImages) {
				lastImageCounter -= amountImages;
			}
			if ( amountImages < $("#pictures").children().length ) {
				$("#pictures").children().eq(Math.floor($("#pictures").children().length/2)-direction).stop().animate({
					opacity: opacity
				},animationInterval, "linear");
			}
			else {
				$("#image-"+(lastImageCounter)).stop().animate({
					opacity: opacity
				},animationInterval, "linear");
			}

			if (+$("#image-"+counter).attr("alt") === counter) {
				$("#imageName").html("&nbsp;");
			}
			else {
				$("#imageName").html($("#image-"+counter).attr("alt"));
			}
			$("#imageCount").html(counter + "<span>" + amountImages + "</span>");

			if (!wrapAround) {

				if (counter === 1) {
					$("#prev").addClass("disabled");
				}
	
				else {
					$("#prev").removeClass("disabled");
				}
	
				if (counter === amountImages) {
					$("#next").addClass("disabled");
				}
	
				else {
					$("#next").removeClass("disabled");
				}
			
			}
			
		}

		$(document).keydown(function(e) {

			if (e.which == 39 || e.which == 37 || e.which == 40 || e.which == 38) {
				e.preventDefault();
			}

			if (e.which == 39 ) {
				if (wrapAround || counter < amountImages) {
					nextImage(+1);
				}
			}
											
			else if (e.which == 37) {
				if (wrapAround || counter > 1) {
					nextImage(-1);
				}
			}

		});


		function getImages(amount, name, initialOffset){

			if (thumbs.length > 0) {								

				var offset = initialOffset;
				imageLoadedCounter = 0;
	
				if (name != "") {
						var index = 0;
						var inArray = false;
						for (var i=0; i<thumbs.length; i++) {
							if (thumbs.eq(i).attr("alt").toLowerCase() == name) {									
								inArray = true;
								index = i;
								break;
							}
						}
						if (!inArray) {
							alert("Image with name \""+name+"\" not found. \nReturning to first image of the gallery.");
							location.hash = "";
						}
						else
							offset = index + 1;
				}
				
				counter = offset;

				if (!wrapAround) {

					if (amount > thumbs.length) {
						amount = thumbs.length;	
					}	
							
					if (offset <= (amount - 1) / 2 + 1) {
						for (var i=0; i < amount; i++) {
							createAndAppendImage(i, amount);
						}						
					}
					
					else if (offset >= (amountImages - ( amount - 1 ) / 2 ) ) {
						for (var i = amountImages-amount; i < amountImages; i++) {
							createAndAppendImage(i, amount);
						}
					}
					else {
						for (var i = offset - (amount-1)/2 - 1; i < offset - (amount-1)/2 + amount - 1; i++) {
							createAndAppendImage(i, amount);
						}
					} 

					if (counter === 1) {
						$("#prev").addClass("disabled");
					}
					if (counter === amountImages) {		
						$("#next").addClass("disabled");
					}
				
				}

				else {
					for (var i = -1 * (amount - 1) / 2 + offset; i <= (amount - 1) / 2 + offset; i++) {
						var imageNo = Math.ceil(i);
						if (imageNo <= 0) {
							imageNo = amountImages + i;
						}
						if (imageNo > amountImages) {
							imageNo -= amountImages;
						}
						if (amountImages === 1) {
							imageNo = 1;
						}
						createAndAppendImage(imageNo - 1, amount);
					}

					
					if (amountImages === 1) {
						$("#prev").addClass("disabled");					
						$("#next").addClass("disabled");
					}

				}
				
				$("#image-"+offset).css("opacity","1");
				
				$("#imageCount").html(counter + "<span>" + amountImages + "</span>");
				if (+$("#image-"+counter).attr("alt") === counter) {
					$("#imageName").html("&nbsp");
				}
				else {
					$("#imageName").html($("#image-"+counter).attr("alt"));
				}

				$("#exifInfo").html(thumbs.eq(counter-1).attr('data-meta') || "No information available");
				$("#exifInfo").css("margin-top",function() { return -1*$(this).outerHeight()/2 });
				if ( !$("#exifInfo").hasClass("collapsed") ) {
					$("#exifCollapse").css("right",function() { return $("#exifInfo").outerWidth() + "px" });
				}
				
			}
			else {				
				
				$("#prev").addClass("disabled");			
				$("#next").addClass("disabled");
				$("#imageCount").html("");				
				$("#imageName").html("");
			
			}
		}

		function createAndAppendImage(i, amount) {
			var img = new Image();
			img.id = "image-" + (i+1);
			img.src = thumbs.eq(i).attr('data-href');
			img.alt = thumbs.eq(i).attr('alt');
			if ($.support.opacity) {
				img.style = 'opacity:'+opacity;
			}
			else {
				img.filter = "alpha(opacity="+(opacity*100)+")";
			}
					
			$("#pictures").append($(img).load(function(){
	
				if (!allowDownload) {
					$(this).on('contextmenu',function(e) { e.preventDefault(); return false; } );
				};		

				$(this).on('dragstart', function(event) { event.preventDefault(); return false; });
									
				var calcWidth = parseInt(windowHeight / $(this).height() * $(this).width() );
								
				if (calcWidth > windowWidth) {
					$(this).css("height","auto");
					$(this).css("width",function(){return windowWidth});
					$(this).css("margin-top",function(){return (windowHeight - $(this).height() )/2});			
			}
				else {
					$(this).css("height","100%");
					$(this).css("width","auto");
				}
				if ( $("#pictures")[0].children.length === amount || $("#pictures")[0].children.length === thumbs.length ) {	
					if (amountImages >= 1) {
						$("#pictures").css("left" ,'+=' + (calculateDifference(counter)) + "px");
						var collapsed = $(".thumbs").hasClass("collapsed");
						$(".thumbs").removeClass("collapsed");
						$("#thumbs").css("left" ,'+=' + (calculateDifferenceThumbs(counter)) + "px");
						if(collapsed) {
							$(".thumbs").addClass("collapsed");
						}
						onResize(true);
					}
				}
					
			}));
		}

		function calculateThumbsBehaviour() {
			if ( $("#thumbs").width() < $(".thumbs").width() ) {
				if ( ( windowWidth - $("#thumbs").width() ) / 2 > $("#imageCount").outerWidth() + parseInt($("#imageInfo").css("padding-left")) + parseInt($("#imageInfo").css("padding-right")) ) {
					if ($(".thumbs").hasClass("collapsed")) {
						$(".thumbs").css("margin-left", function() { return ( windowWidth - ( thumbs.height()/thumbs[0].height * thumbs[0].width ) ) / 2 } );
					}
					else {
						$(".thumbs").css("margin-left", function() { return ( windowWidth -  $("#thumbs").width() ) / 2 } );
					}
				}
				else {
					$(".thumbs").css("margin-left", function() { return ($( this ).width() - $("#thumbs").width()) / 2 });
				}
				$(".thumbs").width($("#thumbs").width())
			}
			
			else {
				$(".thumbs").css("margin-left","0");
				$("#nextThumbs").removeClass( "hidden" );
				$("#prevThumbs").mouseout( function(e) {
					e.preventDefault();
					clearInterval(prevThumbsID);				
				});
				$("#nextThumbs").mouseout( function(e) {
					e.preventDefault();
					clearInterval(nextThumbsID);			
				});	
					
				$("#prevThumbs").mouseover( function(e) {
					$("#nextThumbs").removeClass( "hidden" );
					e.preventDefault();
					prevThumbsID = setInterval(function() {
						if ( parseInt($("#thumbs").css("left")) >= 0) {
							clearInterval(prevThumbsID);
							$("#prevThumbs").addClass( "hidden" );
						}
						else {
							if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1) {
								$("#thumbs").css('left', '+=' + 6 + "px");
							}
							else {
								$("#thumbs").css('left', '+=' + 3 + "px");
							}
						}
					},2);			
					
				});
					
				$("#nextThumbs").mouseover( function(e) {
					$("#prevThumbs").removeClass( "hidden" );
					e.preventDefault();
					nextThumbsID = setInterval(function() {
						if ( parseInt($("#thumbs").css("left")) <= -1 * ($("#thumbs").width() - $(".thumbs").width()) ) {
							clearInterval(nextThumbsID);
							$("#nextThumbs").addClass( "hidden" );
						}
						else {
							if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1) {
								$("#thumbs").css('left', '+=' + -6 + "px");
							}
							else {
								$("#thumbs").css('left', '+=' + -3 + "px");
							}
						}
					},2);			
				});
			}
		}

		function onResize(opacityChange) {
			$('#pictures').children().each(function() {
				if ($(this).outerWidth() > windowWidth || $(this).height() != windowHeight ) {
					$(this).css("height","auto");
					$(this).css("width",function(){return $(window).width()});
					$(this).css("margin-top",function(){return ($(window).height() - $(this).height() )/2});				
				}
				if ($(this).outerHeight() > windowHeight) {
					$(this).css("width","auto");
					$(this).css("height","100%");
					$(this).css("margin-top","0");
				}
				if (opacityChange) {
					$(this).css("opacity",opacity);
				}
			});	
			if (opacityChange) {		
				if ( amountImages < $("#pictures").children().length ) {
					$("#pictures").children().eq(Math.floor($("#pictures").children().length/2)).css("opacity","1");
				}
				else {
					$("#image-"+counter).css("opacity","1");
				}
			}		
		}

		function onThumbnailClick() {
				
			var el = $(".thumbs");
				
			if ( el.hasClass("collapsed") ) {
					
				el.removeClass("collapsed");
						
				el.stop().animate({
					bottom: 0
				},300, "linear");
						
				$("#thumbnailCollapse").stop().animate({
					bottom: $("#thumbs").height()
				},300, "linear");
						
			}
	
			else {
	
				setTimeout(function() {
					el.addClass("collapsed")
				}, 300);
						
				el.stop().animate({
					bottom: -1 * $("#thumbs").height()
				},300, "linear");
	
				$("#thumbnailCollapse").stop().animate({
					bottom: 0
				},300, "linear");
						
			}	
				
		}

		function onThumbClick(thumb) {
			clearInterval(nextThumbsID);
			clearInterval(prevThumbsID);
			if (thumb.attr('alt') !== "") {
  				location.hash = encodeURIComponent(thumb.attr('alt'));
			}
			else {
				$("#pictures").empty();
				getImages(5,"",1 + $( this ).index());
			}
  			return false;
  				
		}

		function onExifClick() {

			var el = $("#exifInfo");
				
			if ( el.hasClass("collapsed") ) {
					
				el.removeClass("collapsed");
						
				el.stop().animate({
					right: 0
				},300, "linear");
						
				$("#exifCollapse").stop().animate({
					right: el.outerWidth()
				},300, "linear");
							
			}
	
			else {

				setTimeout(function() {
					el.addClass("collapsed")
				}, 300);
						
				el.stop().animate({
					right: -el.outerWidth()
				},300, "linear");
						
				$("#exifCollapse").stop().animate({
					right: 0
				},300, "linear");
						
			}	
			
		}

		function calculateThumbsWidth() {
			$("#thumbs").width( function() {
				var i = 0.0;
				thumbs.each(function() {
					i += parseFloat(window.getComputedStyle(this).width);
				});
				return Math.ceil(i);
			});
		}

		var pfx = ["webkit", "moz", "ms", "o", ""];
		function RunPrefixMethod(obj, method) {
			
			var p = 0, m, t;
			while (p < pfx.length && !obj[m]) {
				m = method;
				if (pfx[p] == "") {
					m = m.substr(0,1).toLowerCase() + m.substr(1);
				}
				m = pfx[p] + m;
				t = typeof obj[m];
				if (t != "undefined") {
					pfx = [pfx[p]];
					return (t == "function" ? obj[m]() : obj[m]);
				}
				p++;
			}
		
		}

		function startSlideShow() {
			$("#slideshowIcon").attr("title","Stop Slideshow");
			if (wrapAround || counter < amountImages) {
				nextImage(+1);
			}
			slideshowID = setInterval(function() {
				if (wrapAround || counter < amountImages) {
					nextImage(+1);
				}	
			},slideshowInterval*1000);
			$("#slideshowIcon").removeClass("stopped").addClass("started");
			if (navigator.userAgent.indexOf("Android")===-1) {
				$("#slideshow").off("click").on("click" , function() {
					stopSlideShow()
				});
			}
			$("#slideshow").off("touchstart").on("touchstart" , function() {
				stopSlideShow()
			});
		}

		function stopSlideShow() {
			if (slideShowTimeoutID !== 0) {
				clearTimeout(slideShowTimeoutID);
				slideShowTimeoutID = 0;
			}
			$("#slideshowIcon").attr("title","Start Slideshow");
			clearInterval(slideshowID);
			$("#slideshowIcon").removeClass("started").addClass("stopped");
			if (navigator.userAgent.indexOf("Android")===-1) {
				$("#slideshow").off("click").on("click" , function() {
					startSlideShow()
				});
			}
			$("#slideshow").off("touchstart").on("touchstart" , function() {
				startSlideShow()
			});
		}

		function addShareButtons(settings) {

			var shareContainer = $(".sharing");

			var shares = $("<div/>");

			shares.addClass("shares");

			var url = encodeURIComponent( window.location.href.split('#')[0] );
			var pinterestURL = url.substring(0, url.lastIndexOf('%2F')+3);

			if (settings.facebook) {
				shares.append('<a href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" class="facebook" target="_blank"></a>');
			}

			if (settings.twitter) {
				shares.append('<a href="http://twitter.com/home?status=' + url + '" class="twitter" target="_blank"></a>');
			}

			if (settings.google) {
				shares.append('<a href="https://plus.google.com/share?url=' + url + '" class="gplus" target="_blank"></a>');
			}

			if (settings.tumblr) {
				shares.append('<a href="http://www.tumblr.com/share/link?url=' + url + '&name=' + document.title + '" class="tumblr" target="_blank"></a>');
			}

			if (settings.reddit) {
				shares.append('<a href="http://www.reddit.com/submit?url=' + url + '&title=' + document.title + '" class="reddit" target="_blank"></a>');
			}

			if (settings.pinterest) {				
				shares.append('<a href="http://www.pinterest.com/pin/create/button/?media='+ pinterestURL + encodeURIComponent(thumbs.eq(0).attr('data-href')) + '&url='+url+'&description='+document.title+'" data-pin-do="buttonPin" data-pin-config="above" target="_blank" class="pinterest"></a>');
			}

			if (settings.email) {
				shares.append('<a class="mail" href="mailto:?subject=' + document.title + '&body=' + '%0D%0A' + window.location.href.split('#')[0].replace(/%/g, '%25') + '"></a>');
			}

			if ($(shares).children().length!==0) {	
				shareContainer.append(shares);	
			}
					
			
		}

		function initSkin(settings) {
			
			amountImages = settings.amountImages;
			wrapAround = settings.wrapAround;			
			animationInterval = settings.animationInterval;
			slideshowInterval = settings.slideshowInterval;
			opacity = settings.opacity/100;
			allowDownload = settings.allowDownload;

			addShareButtons(settings);
			
			windowWidth = $(window).width();
			windowHeight = $(window).height();
			
			if (location.hash.substr(1)!="")
				getImages(5, decodeURIComponent(location.hash.substr(1)).toLowerCase(), 1);
			else
				getImages(5,"", 1);
				
			$("#exifInfo").css("margin-top",function() { return -1*$(this).outerHeight()/2 + "px" });
			if (settings.showPhotoDataFromStart) {
				$("#exifCollapse").css("right",function() { return $("#exifInfo").outerWidth() + "px" });
			}
			else {
				$("#exifInfo").css("right",function() { return -1*$(this).outerWidth() + "px" });
			}
			
			$("#pictures").width(windowWidth*5.5);

			if (amountImages === 1) {
				$("#slideshow").addClass("hidden");
			}
			else {
				if ($("#slideshowIcon").hasClass("started")) {
					$("#slideshowIcon").attr("title","Stop Slideshow");
					slideShowTimeoutID = setTimeout(function() {startSlideShow();},slideshowInterval*1000);
					if (navigator.userAgent.indexOf("Android")===-1) {
						$("#slideshow").off("click").on("click" , function() {
							stopSlideShow()
						});
					}
					$("#slideshow").off("touchstart").on("touchstart" , function() {
						stopSlideShow()
					});			
				}
				else {
					$("#slideshowIcon").addClass("stopped");
					$("#slideshowIcon").attr("title","Start Slideshow");
					
					if (navigator.userAgent.indexOf("Android")===-1) {
						$("#slideshow").on("click", function() {
							startSlideShow();
						});
					}
					$("#slideshow").on("touchstart", function() {
						startSlideShow();
					});
				}
			}
			
			$("#next").click( function(e){
				if (wrapAround || counter < amountImages) {
					nextImage(+1);
				}
			});
			$("#prev").click( function(e){
				if (wrapAround || counter > 1) {
					nextImage(-1);
				}
			});	

			window.onhashchange = function() {
				if ( !ignoreHashChange ) {
					$("#pictures").empty();
					if (location.hash.substr(1)!="")
						getImages(5, decodeURIComponent(location.hash.substr(1)).toLowerCase(),1);
					else
						getImages(5,"",1);
				}
				ignoreHashChange = false;
			}

			thumbs.on('click', function() {
				if (triggerClick) {
					onThumbClick($(this));
				}
				triggerClick = true;
			});

			thumbs.on('touchstart', function() {
				triggerClick = true; 
			});

			thumbs.on('touchend', function() {
				if (triggerClick) {
					$(this).click(); 
				}
				triggerClick = true;
			});
			
			$(".thumbs").width( (windowWidth - $("#imageCount").outerWidth() - parseInt($("#imageInfo").css("padding-left")) - parseInt($("#imageInfo").css("padding-right")) - 20) );
			
			calculateThumbsWidth();
			
			$(".thumbs").height(thumbs.height());
			
			$(".thumbs").css( { bottom: "" + ( -1 * $("#thumbs").height() ) + "px" } );

			calculateThumbsBehaviour();

			$("#thumbnailCollapse").css("margin-left", function() { return -1 * $( this ).outerWidth() / 2 } );

			$("#thumbnailCollapse").mouseover( function() { 
				$( ".showThumbs" ).css( "background-color" , "#fff" );
				$( "#thumbnailCollapse" ).css( "border-color", "#fff" );
			});	
			
			$("#thumbnailCollapse").mouseout( function() { 
				$( ".showThumbs" ).css( "background-color" , "#aaa" );
				$( "#thumbnailCollapse" ).css( "border-color", "#aaa" ); 
			});	

			$("#thumbnailCollapse").on("click", function() {
				onThumbnailClick();
			});

			$("#thumbnailCollapse").on("touchstart", function() {
				onThumbnailClick();
			});

			if (navigator.userAgent.indexOf("Android")===-1) {
				$("#exifCollapse").on("click",function() {
					console.log("exif click");
					onExifClick();
				});
			}

			$("#exifCollapse").on("touchstart",function() {
				console.log("exif collapse");
				onExifClick();
			});

			$(".thumbs").addClass("collapsed");
			
			$(window).resize(function(e) {	
			
				clearInterval(nextThumbsID);
				clearInterval(prevThumbsID);		
				
				windowWidth = $(window).width();
				windowHeight = $(window).height();

				if (thumbs.height() < 120 ) {
					$(".thumbs-nav").addClass("hidden");
				}
				else {
					$(".thumbs-nav").removeClass("hidden");
				}

				$(".thumbs").width( (windowWidth - $("#imageCount").outerWidth() - parseInt($("#imageInfo").css("padding-left")) - parseInt($("#imageInfo").css("padding-right")) - 20) );
			
				$(".thumbs").height(thumbs.height());

				if (parseInt($("#thumbnailCollapse").css("bottom")) > 0) {
					$("#thumbnailCollapse").css("bottom",thumbs.height()+"px");
				}
				$("#thumbnailCollapse").css("margin-left", function() { return -1 * $( this ).outerWidth() / 2 } );

				collapsed = false;

				if ($(".thumbs").hasClass("collapsed")) {
					collapsed = true;
					$(".thumbs").removeClass("collapsed");
				}

				calculateThumbsWidth();			

				calculateThumbsBehaviour();
				
				$("#thumbs").css("left" ,'+=' + (calculateDifferenceThumbs(counter)) + "px");
							
				onResize(true);
								
				$("#pictures").width(windowWidth*5.5);

				$("#pictures").css("left" ,'+=' + (calculateDifference(counter)) + "px");

				if(collapsed) {
					$(".thumbs").addClass("collapsed");
				}	
				if ($("#exifInfo").hasClass("collapsed")) {
					$("#exifCollapse").css("right", "0");
				}
				else {
					$("#exifCollapse").css("right", function() {return $("#exifInfo").outerWidth(); });
				}
				$("#exifInfo").css("margin-top",function() { return -1*$(this).outerHeight()/2 });
				
			});
			
			$("#pictures").swipe({
  				swipe:function(event, direction, distance, duration, fingerCount) {
    					if (direction == "left") {
    						if (wrapAround || counter < amountImages)
							nextImage(+1);
    					}
    					else if (direction == "right") {
    						if (wrapAround || counter > 1)
							nextImage(-1);
    					}
  			}, threshold: 20 });

  			$("body").swipe({
  				swipe:function(event, direction, distance, duration, fingerCount) {
    					var el = $(".thumbs");
    					if (direction === "up") {				
						if ( el.hasClass("collapsed") ) {
							$("#thumbnailCollapse").click();
						}
    					}
    					else if ( direction === "down" ) {    										
						if ( ! el.hasClass("collapsed") ) {
							$("#thumbnailCollapse").click();
						}
    					}
  			}, threshold: 20 });

			$("#exifInfo").swipe({
  				swipe:function(event, direction, distance, duration, fingerCount) {
    					if ( direction == "right" ) {    	
						$("#exifCollapse").click();
    					}
  			}, threshold: 20 }); 			

  			$(".thumbs").swipe({
  				triggerOnTouchEnd : true,
				swipeStatus : swipeStatus,
				allowPageScroll:"vertical", 
				threshold: 5
  			});

  			function swipeStatus(event, phase, direction, distance, fingers) {
  				clearInterval(prevThumbsID);
  				clearInterval(nextThumbsID);
  				if ($("#thumbs").width() > $(".thumbs").width()) {
	    				if( phase==="move" && (direction==="left" || direction==="right") ) {
	    					if ( direction == "left" && -1 * parseInt($("#thumbs").css("left")) + (distance - oldDistance) < $("#thumbs").width() - $(".thumbs").width() ) {
	    						$("#thumbs").css("left", '-=' + (distance - oldDistance) + 'px');
	    					}
	    					else if ( direction == "right" && parseInt($("#thumbs").css("left")) + (distance - oldDistance) < 0 ) {
	    						$("#thumbs").css("left", '+=' + (distance - oldDistance) + 'px');
	    					}
	    					if (direction == "left" && -1 * parseInt($("#thumbs").css("left")) + (distance - oldDistance) >= $("#thumbs").width() - $(".thumbs").width()) {
							$("#nextThumbs").addClass( "hidden" );    						
	    					}
	    					else {
	    						$("#nextThumbs").removeClass( "hidden" );   
	    					}
	    					if (direction == "right" && parseInt($("#thumbs").css("left")) + (distance - oldDistance) >= 0) {
							$("#prevThumbs").addClass( "hidden" );    						
	    					}
	    					else {
	    						$("#prevThumbs").removeClass( "hidden" );   
	    					}
	    					oldDistance = distance;
	  					triggerClick = false;
	    				}
	    				else if ( phase == "cancel") {
	    					if (-1 * parseInt($("#thumbs").css("left")) + (distance - oldDistance) >= $("#thumbs").width() - $(".thumbs").width()) {
	    						$("#nextThumbs").addClass( "hidden" );  
	    					}
	    					if (parseInt($("#thumbs").css("left")) + (distance - oldDistance) >= 0) {
								$("#prevThumbs").addClass( "hidden" );    						
	    					}
						oldDistance = 0;
					}
	    				else if ( phase == "start") {
						oldDistance = distance;
					}
  				}
  			};

			//diasble right click context menu and image drag
			//thumbnail collapse
			$("#thumbnailCollapse").on('contextmenu',function(e) { e.preventDefault(); return false; } );
			$("#thumbnailCollapse").on('dragstart', function(event) { event.preventDefault(); return false; });
			//thumbnails
			$(thumbs).on('contextmenu',function(e) { e.preventDefault(); return false; } );
			$(thumbs).on('dragstart', function(event) { event.preventDefault(); return false; });
			//sharing icons
			$(".sharing").on('contextmenu',function(e) { e.preventDefault(); return false; } );
			$(".sharing").on('dragstart', function(event) { event.preventDefault(); return false; });
			//navigation control
			$("#navigation").on('contextmenu',function(e) { e.preventDefault(); return false; } );
			$("#navigation").on('dragstart', function(event) { event.preventDefault(); return false; });
			//exif information
			$("#exifCollapse").on('contextmenu',function(e) { e.preventDefault(); return false; } );
			$("#exifCollapse").on('dragstart', function(event) { event.preventDefault(); return false; });

			var e = document.getElementById("fullscreen");
			var target = document.documentElement;

			if (e !== null) {

				e.ontouchstart = function() {
				
					if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
						RunPrefixMethod(document, "CancelFullScreen");
					}
					else {
						RunPrefixMethod(target, "RequestFullScreen");
					}
				
				};

				e.onclick = function() {
				
					if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
						RunPrefixMethod(document, "CancelFullScreen");
					}
					else {
						RunPrefixMethod(target, "RequestFullScreen");
					}
				
				};
			}
			
		};
				
