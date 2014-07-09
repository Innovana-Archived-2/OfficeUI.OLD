// Makes a ribbon out of an element.
$.fn.Ribbon = function(options) { 
	// Specify the default options for the menu plugin.
	var options = $.extend({});

	// Get the object on which this is called.
    var object = $(this);

    // Initialize the ribbon.
    Initialize();

    // Section: Functions.

    	// Initialize the whole ribbon. This is done by placing classes on the various elements that together form the ribbon.
    	// This is done to keep the HTML less cluthered.
    	// Also some basic functions such as selecting the correct tab are executed here.
	    function Initialize() {
		    $("ul[role='tablist'] > li").attr("role", "tab");
			$(".ribbon, .tabs").addClass("brd_btm_grey"); 
			$(".tabs UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin"); 
			$("li[role='tab']").addClass("OfficeUI_inline"); 
			$("li[role='tab'] span:first-child").addClass("OfficeUI_uppercase"); 
			$("li[role='tab'] .contents").addClass("OfficeUI_absolute"); 
		    $(".group").after("<div class='seperator'>&nbsp;</div>"); 
			$(".group, .seperator").addClass("OfficeUI_relative OfficeUI_inline");
			$(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("OfficeUI_inline"); 
			$(".bigicon").addClass("icon OfficeUI_relative OfficeUI_inline OfficeUI_center"); 
			$(".smallicon").addClass("icon OfficeUI_relative");
			$(".legend").addClass("OfficeUI_absolute"); 
			$(".arrow").addClass("OfficeUI_relative"); 
			$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>'); 
			$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>'); 

			// Enable the first tab which is not an application tab.
			EnableTab($("li[role='tab']:not(.application)").first().Id());
		}

		// Enables a given tab, based on the id of the tab.
	    // Parameters: 
	    //    tabId:    The id of the tab that should be showed.
	    function EnableTab(tabId) {
		    // Chech if the tab with the id can be found and if not, write a message to the log.
		    if ($("#" + tabId).LogWhenNotFound("Tab with id '" + tabId + "' not found."))
		    {   
		      // Start by deactiving every tab element on the page.
		      OfficeUICoreHelpers.DeactivateAllTabs();

		      // Marks the tab as the active one and display the contents for the tab.
		      OfficeUICoreHelpers.ActivateTab(tabId);
		    }
		}

		// Enables the next tab if there is any.
		function EnableNextTab() {
			EnableTab($($("li[role=tab].active").next()).Id());
		}

  		// Enables the previous tab, but only if it's not the application tab.
  		function EnablePreviousTab() {
    		if (!$($("li[role=tab].active").prev()).hasClass("application")) {
      			EnableTab($($("li[role=tab]:not(.application).active").prev()).Id());
    		} 
  		}

  		// Enable the menu for a given icon.
		//  Parameters:
		//    Timekey: The duration it takes to slide down the element., 
		//    Elementkey: The element on which the "active" class should be set. 
		function EnableMenu(time, element) {
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
		      DisableMenu($(element));
		    }
		}

		// Disables a menu.
  		//  Parameters:
  		//      element:    The element (menu) that should be hidden.
  		function DisableMenu(element) {
    		$(element).hide().parent().Deactivate();
      
    		// Update the state.
    		$(element).data("state", 0);
  		}

	// End of section: Functions.


	// Section: Event Handlers.

		// When you click on a tab element (not the application tab), make sure that that tab element becomes active.
		$("li[role=tab]:not(.application)").click(function() {
			EnableTab($(this).Id());
		});

		// When you scroll when you're mousecursor is somewhere in the Ribbon, make sure that either the next or the previous tab is selected,
		// based on the direction of the scroll.
		// Note: We're binding 2 events here ('DOMMouseScroll' & 'mousewheel'). This is needed to make it work in Internet Explorer, Google Chrome & Mozilla Firefox.
		$(".ribbon").on('DOMMouseScroll mousewheel', function(e){
        	if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { EnableNextTab($(this)); }
        	else { EnablePreviousTab($(this));	}

        	// Prevent the page from scrolling.
        	return false;
    	});

    	// Executed when you click on any icon which is not disabled.
      	$(".icon").on("click", function(e) {
        	if (!$(this).hasClass("OfficeUI_disabled")) { // Check if the icon is not disabled. This is needed because items can be disabled on the fly.
          		if ($(this).HoldsMenu()) { // Check if it's a menu.
	              	e.stopPropagation();
	              	EnableMenu(OfficeUIConstants.menuTransition, $(".menu", this).first());
	            }
         	} 
      	});

	// End of section : Event Handlers.
}

// Provides constants that will be used in here.
var OfficeUIConstants = {
  menuTransition: 100, // Defines the amount of time (milliseconds) that it takes for a menu item in the ribbon to be completely shown.
  subMenuTimeout: 500  // Defines the amount of time (milliseconds) that a cursor must be placed over a certain menu entry in the ribbon before the submenu will open.
};

// Provides internal helpers for the ribbon.
var OfficeUICoreHelpers = {

  // Enables a given tab, based on the id of the tab.
  // Parameters: 
  //    tabId:    The id of the tab that should be showed.
  ActivateTab: function(tabId) {
    $("#" + tabId).Activate();
    $(".contents", $("#" + tabId)).Activate();
  },

  // Deactivates a given tab, based on the id of the tab.
  // Parameters: 
  //    tabId:    The id of the tab element that should be deactivated.
  DeactivateTab: function(tabId) {
    $("#" + tabId).Deactivate();
    $(".contents", $("#" + tabId)).Deactivate();
  },

  // Deactivates all the tab elements which are on the page.
  DeactivateAllTabs: function() {
    $("li[role=tab]").each(function(index) {
      OfficeUICoreHelpers.DeactivateTab($(this).Id());
    });
  }
}