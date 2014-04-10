// Extend the jQuery FN so that new methods can be called.
jQuery.fn.extend({
  
  // Enable the tab contents for a given tab element.
  EnableTabContents: function() {
    
    // Start by deactiving every tab element on the page.
    $("li[role=tab]").each(function(index) {
      $(this).removeClass("active");
      $(".contents", this).removeClass("active");
    });

    // Activate the tab which is requested.
    $(this).addClass("active");
    $(".contents", this).addClass("active");

    // Return the "tab" element.
    return $(this);
  },

  // Enable the menu for a given icon.
  //  Parameters:
  //    Timekey: The duration it takes to slide down the element., 
  //    Elementkey: The element on which the "active" class should be set. 
  EnableMenu: function(time, element) {
    // Check if the menu is closed. If that's the case, we should show it.
    if(!$(this).data("state") || $(this).data("state") == 0) { 
      $(this).show("slide", { direction: "up" }, time);
      $(element).addClass("active");

      // Update the current state.
      $(this).data("state", 1);

    // Menu is visible, so let's close it.
    } else if ($(this).data("state") == 1) { 
      $(this).DisableMenu($(element));
    }

    $(".menu").not(this).each(function() {
      $(this).DisableMenu($(this).parent());
    });
  },

  DisableMenu: function(element) {
      $(this).hide();
      $(element).removeClass("active");
      
      // Update the state.
      $(this).data("state", 0);
  }

});

var OfficeUICoreInternal = {
	AddGlobalHandlers: function() {
	
	  // Events handlers are placed here.
	
	    // When you click anywhere on the document, execute the following code.
	    $(document).click(function() {
	      // Make sure that all dropdowns are closed.
	       $(".menu").each(function() {
	         $(this).hide().parent().removeClass("active");
	         $(this).data("state", 0);
	       });
	    });
	
	}

}

var OfficeUICore = {

	/** Initialize an element and its descendants.
	 * The initialization is done by placeing classes automatticly on the necessary elements.
	 * That way the HTML is cleaner.
	 */
	InitElement: function(element) {
		var el = $(element);
		
		for (var i = 0; i < 2; i++) {
			var fun;
			
			if(i == 0)
				fun = function(s) { return el.filter(s); };
			else
				fun = function(s) { return el.find(s); };
			
			fun(".ribbon, .tabs").addClass("brd_btm_grey");
			fun(".tabs UL, .menucontents UL").addClass("nopadding nomargin");
			fun(".menucontents UL LI").addClass("nowrap");
			fun("li[role='tab']").addClass("inline");
			
			// Enable the first tab.
			fun("li[role='tab']:not(.application)").first().EnableTabContents();
			
			fun("li span:first-child").addClass("uppercase");
			fun("li[role='tab'] .contents").addClass("absolute");
			fun(".group, .seperator").addClass("relative inline");
			fun(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("inline");
			fun(".bigicon").addClass("icon relative inline center");
			fun(".smallicon").addClass("icon relative");
			fun(".legend, .menu").addClass("absolute");
			fun(".arrow").addClass("relative");
			
			// Attach handlers
			
		    // When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
		    $("li[role=tab]:not(.application)").click(function() {
		      $(this).EnableTabContents();
		    });
		
		    // When you click on an icon execute the code below.
		    $(".icon").click(function(e) {
		      // When the icon holds a menu, show the menu.
		      if ($(this).children(".menu").length > 0) {
		
		        e.stopPropagation();
		
		        $(".menu", this).EnableMenu(50, $(this));
		
		      }
		    });
		}
	
	},
		
  /** Initialize the OfficeUI controls which are on the page. */
  Init: function() {
	OfficeUICore.InitElement(document);
    OfficeUICoreInternal.AddGlobalHandlers();
  }

}