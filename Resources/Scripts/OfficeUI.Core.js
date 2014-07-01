// Provides the core functions for the workings of the OfficeWebControls.
var OfficeUICoreInternal = {
  
  // Enables the next available tab (except the application tab).
  EnableNextTab: function() {
    OfficeUICoreAPI.EnableTab($($("li[role=tab].active").next()).Id());
  },

  // Enables the previous available tab (except the application tab).
  EnablePreviousTab: function() {
    // Check if the previous tab is not the application tab.
    if (!$($("li[role=tab].active").prev()).hasClass("application")) {
      OfficeUICoreAPI.EnableTab($($("li[role=tab]:not(.application).active").prev()).Id());
    } 
  },

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
      $(element).show("slide", { direction: "up" }, time);

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
              OfficeUICoreInternal.EnableMenu(100, $(".menu", this).first());
           }
         } 
      });

	    // Bind the event for changing tabs on mouse scroll. 
      // We'll notice 2 events here. This is because the one ony work in Firefox, while the others are for all the browsers.
	    $(".ribbon").on('DOMMouseScroll mousewheel', function(e){
        	if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { OfficeUICoreInternal.EnableNextTab($(this)); }
        	else { OfficeUICoreInternal.EnablePreviousTab($(this));	}

        	//prevent page fom scrolling
        	return false;
    	});

      // Section: Submenu handling. 

        // Variables needed for this secion.
        var waitHandle;

        // Open up the submenu when you hover on the item that holds the submenu.
        $("LI.menuEntry:not(.OfficeUI_disabled)").on("mouseenter", function(e) {
          e.stopPropagation();
          // Check if the item holds a submenu.
          if ($(".subMenuHolder", this).length > 0) {
            var element = $(this);
            waitHandle = setTimeout(function() {
            
              $(".menu", $(element).parent()).each(function() {
                $(this).hide().parent().Deactivate();
              });

              $(".menu", element).first().show("slide", { direction: "left" }, 100).Activate(); // Always shows the menu. Never hide it on a hover.

            }, 500);
          } else { // The item is not holding any submenu, so we can hide every open submenu.
            $(".menu", $(this).parent()).each(function() {
              $(this).hide().parent().Deactivate();
            });
          }
        });

        // Executed when the menuentry is left.
        $("LI.menuEntry").on("mouseout", function(e) {
          clearTimeout(waitHandle);
        });

      // End - Section: Submenu handling.

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
            $("#contextMenuInArea").css({left:leftVal,top:topVal}).show();
            // $("#contextMenuInArea").show("slide", { direction: "up" }, 100);
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
		$(".ribbon, .tabs").addClass("brd_btm_grey"); // Place a gray bottem line under the ribbon and under the tabs.
		$(".tabs UL, .menucontents UL").addClass("OfficeUI_nopadding OfficeUI_nomargin"); // Make sure that on the tabs and the menucontents, there is no padding and no margin.
		$(".menucontents UL LI").addClass("OfficeUI_nowrap"); // Make sure that text is not wrapped in the menucontents.
		$("li[role='tab']").addClass("OfficeUI_inline"); // Make sure that every tab is displayed inline.
		OfficeUICoreAPI.EnableTab($("li[role='tab']:not(.application)").first().Id()); // Enable the first, non-application tab.
		$("li[role='tab'] span:first-child").addClass("OfficeUI_uppercase"); // Make sure that the text of the tabs is always in uppercase.
		$("li[role='tab'] .contents").addClass("OfficeUI_absolute"); // Make sure that the contents of the tab are displayed absolute.
    $(".group").after("<div class='seperator'>&nbsp;</div>");
		$(".group, .seperator").addClass("OfficeUI_relative OfficeUI_inline"); // Make sure that the seperator are relative placed and inline.
		$(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("OfficeUI_inline"); // Make sure that iconsgroups, smallicons, iconlegend, imageholder and menuholder are displayed inline.
		$(".bigicon").addClass("icon OfficeUI_relative OfficeUI_inline OfficeUI_center"); // Make sure that a bigicon is displayed as an icon, relative, inline and centered.
		$(".smallicon").addClass("icon OfficeUI_relative") // Make sure that a smallicon is displayed as an icon, relative.
		$(".legend, .menu").addClass("OfficeUI_absolute"); // Make sure that the legend and the menu's are displayed absolute.
		$(".arrow").addClass("OfficeUI_relative"); // Make sure that an arrow is placed as relative.
		$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>'); // Make sure that every item in the breadcrumb there is an arrow, except the last one.
		$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>'); // Make sure that in a menuitem, on an li with the class "line" a line is added.

		// When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
		$("li[role=tab]:not(.application)").click(function() {
			OfficeUICoreAPI.EnableTab($(this).Id());
		});

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