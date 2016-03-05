jQuery(function ($) {

    'use strict';

		/*==============================================================*/
	//Mobile Toggle Control
	/*==============================================================*/

	 $(function(){
		 var navMain = $("#mainmenu");
		 navMain.on("click", "a", null, function () {
			 navMain.collapse('hide');
		 });
	 });


	/*==============================================================*/
    // Menu add class
    /*==============================================================*/
	(function () {
		function menuToggle(){
			var windowWidth = $(window).width();
			if(windowWidth > 767 ){
				$(window).on('scroll', function(){
					if( $(window).scrollTop()>650 ){
						$('.navbar').addClass('navbar-fixed-top');
					} else {
						$('.navbar').removeClass('navbar-fixed-top');
					};
					if( $(window)){
						$('#home-three .navbar').addClass('navbar-fixed-top');
					}
				});
			}else{

				$('.navbar').addClass('navbar-fixed-top');

			};
		}

		menuToggle();
	}());

	$('#mainmenu').onePageNav({
		currentClass: 'active',
	});


	/*==============================================================*/
    // WoW Animation
    /*==============================================================*/
	new WOW().init();


});
