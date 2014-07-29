// Makes a grid out of an element.
$.fn.Modal = function (options) {
	// Specify the default options for the menu plugin.
	var options = $.extend({});

	// Get the object on which this is called.
    var object = $(this);

    // Initialize the ribbon.
    Initialize();

    // Section: Functions.
	    
	    // Initialize the whole grid. This is done by placing classes on the various elements that together form the grid.
    	// This is done to keep the HTML less cluthered.
    function Initialize() {
            $(object).addClass('modalDialog');
            $(object).css('pointer-events', 'auto').css({ opacity: 1 });
            $(object.show());
    }

	// End of Section: Functions.
}