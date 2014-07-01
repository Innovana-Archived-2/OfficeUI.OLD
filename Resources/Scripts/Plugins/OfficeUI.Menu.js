// Makes a menu out of the element on which it's called.
$.fn.Menu = function(options) {
	
	// Specify the default options for the menu plugin.
	var options = $.extend({
        openOnRightClick: true
    }, options );

	// Initialization logic for the menu is done here.
	$(this).addClass("menu");

	// Event handler binding goes here.
    $(".ribbon").on("contextmenu", function(e) {
    	alert('demo');
        e.preventDefault();

        //getting height and width of the message box
        var height = $(".contextMenuInArea").height();
        var width = $(".contextMenuInArea").width();
            
        //calculating offset for displaying popup message
        leftVal = e.pageX - (width / 2) + "px";
        topVal = e.pageY - (height / 2) + "px";
            
        //show the popup message and hide with fading effect
        $("#contextMenuInArea").css({left:leftVal,top:topVal}).show("slide", { direction: "up" }, OfficeUIConstants.menuTransition);

	    return false;
    });

	return this;
}