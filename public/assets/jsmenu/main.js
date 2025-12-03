(function($){
	"use strict";

	// Mean Menu
	$('.mean-menu').meanmenu({
		meanScreenWidth: "1199"
	});

	// Header Sticky
	$(window).on('scroll', function() {
		var currentScroll = $(this).scrollTop();  // Current scroll position
		var navbar = $('.navbar-area');  // The navbar element
	
		// If the current scroll position is greater than 50px and the user is scrolling down
		if (currentScroll > 50) {
			if (currentScroll > lastScroll) {  // Scrolling down
				navbar.addClass("is-sticky");
			} else {  // Scrolling up
				navbar.removeClass("is-sticky");
			}
		} else {
			navbar.removeClass("is-sticky");  // Remove class if scrolled back to the top
		}
	
		lastScroll = currentScroll;  // Update the last scroll position
	});
	
	var lastScroll = 0;  // Initialize the variable to store the last scroll position
	
	// Others Option For Responsive JS
	$(".others-option-for-responsive .dot-menu").on("click", function(){
		$(".others-option-for-responsive .container .container").toggleClass("active");
	});

	// Search Menu JS
	$(".others-option .search-icon i").on("click", function(){
		$(".search-overlay").toggleClass("search-overlay-active");
	});
	$(".search-overlay-close").on("click", function(){
		$(".search-overlay").removeClass("search-overlay-active");
	});

}(jQuery));