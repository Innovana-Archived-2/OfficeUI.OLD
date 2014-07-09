// Extend the jQuery FN so that new methods can be called.
// Those new methods are needed in the API.
jQuery.fn.extend({
  
  // Gets the value of the id attribute of the called element.
  // Returns:
  //    A string that matches the id of the element.
  Id: function() {
    return $(this).attr('id');
  },

  // Activates the element on which this function is called by adding the class "active" on it.
  Activate: function() {
    $(this).addClass("active");
  },

  // Deactivate the element on which this function is called by removing the class "active" from it.
  Deactivate: function() {
    $(this).removeClass("active");
  },

  // Checks if the element holds a menu.
  HoldsMenu: function() {
    return ($(this).children(".menu").length > 0);
  },

  // Log a message when an element is not found.
  // Parameters:
  //    message:    The message to write to the console.
  // Returns:
  //    True if the object has been found, otherwise false.
  LogWhenNotFound: function(message) {
    if ($(this).length == 0) {
      console.log(message);

      return false;
    }

    return true;
  }
});



// Provides the core functions for the workings of the OfficeWebControls.
var OfficeUICoreInternal = {

  // Add's all the events handlers for the application.
	AddGlobalHandlers: function() {
	
	  // Events handlers are placed here.
	
      



      // Experimental section: Contextmenu handling. 

        // When you're in an area that can hold a contextmenu, add an event for a right click.
        $(".contextMenu").on("contextmenu", function(e) {
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

      // End - Experimental section: Contextmenu handling.
	} 
} 

var OfficeUICore = {
		
  Init: function() {
	 OfficeUICoreInternal.AddGlobalHandlers();
  }
}