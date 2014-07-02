// Provides constants that will be used in here.
var OfficeUIConstants = {
  menuTransition: 100, // Defines the amount of time (milliseconds) that it takes for a menu (either ribbon menu or context menu) to be completely shown.
  subMenuTimeout: 500  // Defines the amount of time (milliseconds) that a cursor must be placed over a certain menu entry (either in the ribbon menu or context menu) before it will be opened.
};

// Provides the core functions for the workings of the OfficeWebControls.
var OfficeUICoreInternal = {


  // Enable the menu for a given icon.
  //  Parameters:
  //    Timekey: The duration it takes to slide down the element., 
  //    Elementkey: The element on which the "active" class should be set. 
  EnableMenu: function(time, element) {
    // Check if the menu is closed. If that's the case, we should show it.
    if(!$(element).data("state") || $(element).data("state") == 0) { 

      // Hide every menutitem which is visible for the moment.
      $(".menu").each(function() {
        $(this).hide().parent().Deactivate();
        $(this).data("state", 0);
      });

      $(element).parent().Activate();
      $(element).Menu().Show();

      // Update the current state.
      $(element).data("state", 1);

    // Menu is visible, so let's close it.
    } else if ($(element).data("state") == 1) {
      OfficeUICoreInternal.DisableMenu($(element));
    }
  },

  // Disables a menu.
  //  Parameters:
  //      element:    The element (menu) that should be hidden.
  DisableMenu: function(element) {
    $(element).hide().parent().Deactivate();
      
    // Update the state.
    $(element).data("state", 0);
  },

  // Add's all the events handlers for the application.
	AddGlobalHandlers: function() {
	
	  // Events handlers are placed here.
	
      // This event handler is executed when you click on the document.
      $(document).click(function() {
        // The ribbon can contain items that shows a menu when you click on the icon.
        // This menu should be hidden again when you click anywhere on the document.
        $(".menu").each(function() {
          $(this).hide().parent().Deactivate();
          $(this).data("state", 0);
        });
      });

      // Executed when you click on any icon which is not disabled.
      $(".icon").on("click", function(e) {
        if (!$(this).hasClass("OfficeUI_disabled")) { // Check if the icon is not disabled. This is needed because items can be disabled on the fly.
          if ($(this).HoldsMenu()) { // Check if it's a menu.
              e.stopPropagation();
              OfficeUICoreInternal.EnableMenu(OfficeUIConstants.menuTransition, $(".menu", this).first());
           }
         } 
      });

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

      // End - Experimental sectoin: Contextmenu handling.
	} 
} 

var OfficeUICore = {

	/** Initialize an element and its descendants.
	 * The initialization is done by placing classes automatticly on the necessary elements.
	 * That way the HTML is cleaner.
	 */
	InitElement: function() {		
    




		// Set the remaing height of the contents, acoording to the window size.
		$(".main_area").height($(window).height() - 25 - 118 - 25 - 26);
    $(".OfficeUI_v-scroll").height($(window).height() - 25 - 118 - 25 - 26 - 20);

		// Make sure that the contents are resized when the window is resized.
		$(window).resize(function() {
		  	$(".main_area").height($(window).height() - 25 - 118 - 26);
        $(".OfficeUI_v-scroll").height($(window).height() - 25 - 118 - 25 - 26 - 20);
		});
	},
		
  /** Initialize the OfficeUI controls which are on the page. */
  Init: function() {
	 OfficeUICore.InitElement();
	 OfficeUICoreInternal.AddGlobalHandlers();
  }
}