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

  // Enables the next available tab.
  EnableNextTab: function() {
  	// Actives the tab that is the next element.
    var nextTab = $("li[role=tab].active").next();
    var attribute = $(nextTab).attr('role');

	if (attribute == 'tab') {
        $(nextTab).EnableTabContents();
    }
  },

  // Enables the previous available tab.
  EnablePreviousTab: function() {
  	// Actives the tab that is the previous element.
    var previousTab = $("li[role=tab].active").prev();
    var attribute = $(previousTab).attr('role');

	if (attribute == 'tab' && !$(previousTab).hasClass('application')) {
        $(previousTab).EnableTabContents();
    }
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
	
	    // This event handler is executed when you click on the document.
	    $(document).click(function() {
  			// The ribbon can contain items that shows a menu when you click on the icon.
  			// This menu should be hidden again when you click anywhere on the document.
	      $(".menu").each(function() {
	        $(this).hide().parent().removeClass("active");
	        $(this).data("state", 0);
	      });
	    });

	    // Bind the event for changing tabs on mouse scroll. (Firefox).
	    $(".ribbon").on('DOMMouseScroll mousewheel', function(e){
        	if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { $(this).EnableNextTab(); }
        	else { $(this).EnablePreviousTab();	}

        	//prevent page fom scrolling
        	return false;
    	});
	}

}

var OfficeUICore = {

	/** Initialize an element and its descendants.
	 * The initialization is done by placing classes automatticly on the necessary elements.
	 * That way the HTML is cleaner.
	 */
	InitElement: function() {		
		$(".ribbon, .tabs").addClass("brd_btm_grey"); // Place a gray bottem line under the ribbon and under the tabs.
		$(".tabs UL, .menucontents UL").addClass("nopadding nomargin"); // Make sure that on the tabs and the menucontents, there is no padding and no margin.
		$(".menucontents UL LI").addClass("nowrap"); // Make sure that text is not wrapped in the menucontents.
		$("li[role='tab']").addClass("inline"); // Make sure that every tab is displayed inline.
		$("li[role='tab']:not(.application)").first().EnableTabContents(); // Enable the first, non-application tab.
		$("li[role='tab'] span:first-child").addClass("uppercase"); // Make sure that the text of the tabs is always in uppercase.
		$("li[role='tab'] .contents").addClass("absolute"); // Make sure that the contents of the tab are displayed absolute.
		$(".group, .seperator").addClass("relative inline"); // Make sure that the seperator are relative placed and inline.
		$(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("inline"); // Make sure that iconsgroups, smallicons, iconlegend, imageholder and menuholder are displayed inline.
		$(".bigicon").addClass("icon relative inline center"); // Make sure that a bigicon is displayed as an icon, relative, inline and centered.
		$(".smallicon").addClass("icon relative") // Make sure that a smallicon is displayed as an icon, relative.
		$(".legend, .menu").addClass("absolute"); // Make sure that the legend and the menu's are displayed absolute.
		$(".arrow").addClass("relative"); // Make sure that an arrow is placed as relative.
		$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>'); // Make sure that every item in the breadcrumb there is an arrow, except the last one.
		$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>'); // Make sure that in a menuitem, on an li with the class "line" a line is added.

		// When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
		$("li[role=tab]:not(.application)").click(function() {
			$(this).EnableTabContents();
		});
		
		// Make sure that when you click on an icon that holds a menu, that the menu is showed.
		$(".icon").click(function(e) {
		    // When the icon holds a menu, show the menu.
		    if ($(this).children(".menu").length > 0) {
		        e.stopPropagation();
		        $(".menu", this).first().EnableMenu(100, $(this));
		     }
		});

    // When you click on a menu that has an subMenu which is active, don't hide the menu.
    $('.menuEntry').click(function(e) {
      // If it's a submenu, stop executing the event, which means that the original menu item will not be
      if ($(".subMenuHolder", this).length > 0) {
        e.stopPropagation();
      }
    });

    $("LI.menuEntry").on("mouseover", function(e) {
      if ($(this).find(".menu").length > 0) {
        $(this).addClass("active");
        if (!$(".menu", this).is(":visible")) {
          $(".menu", this).show("slide", { direction: "left" }, 100);
        }
      } else {
        if ($(this).parents(".menuEntry.active").length == 0) {
          $(".subMenuArrow > .menu").hide();
          console.log("Everything should be hidden right now.");
        }
      }
    });

		// Set the remaing height of the contents, acoording to the window size.
		$(".main_area").height($(window).height() - 25 - 118 - 25 - 26);

		// Make sure that the contents are resized when the window is resized.
		$(window).resize(function() {
		  	$(".main_area").height($(window).height() - 25 - 118 - 26);
		});
	},
		
  /** Initialize the OfficeUI controls which are on the page. */
  Init: function() {
	 OfficeUICore.InitElement();
	 OfficeUICoreInternal.AddGlobalHandlers();
  }
}