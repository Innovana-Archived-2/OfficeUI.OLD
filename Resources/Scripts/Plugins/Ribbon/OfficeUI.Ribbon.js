// Makes a ribbon out of an element.
$.fn.Ribbon = function(options) { 
	// Specify the default options for the menu plugin.
	var options = $.extend({});

	// Get the object on which this is called.
    var object = $(this);

    $("ul[role='tablist'] > li").attr("role", "tab"); // Add a role 'tab' on every direct LI element of the tabslist.
	$(".ribbon, .tabs").addClass("brd_btm_grey"); // Place a gray bottem line under the ribbon and under the tabs.
	$(".tabs UL, .menucontents UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin"); // Make sure that on the tabs and the menucontents, there is no padding and no margin.
	$("li[role='tab']").addClass("OfficeUI_inline"); // Make sure that every tab is displayed inline.
	$("li[role='tab'] span:first-child").addClass("OfficeUI_uppercase"); // Make sure that the text of the tabs is always in uppercase.
	$("li[role='tab'] .contents").addClass("OfficeUI_absolute"); // Make sure that the contents of the tab are displayed absolute.
    $(".group").after("<div class='seperator'>&nbsp;</div>"); // Auto add a seperator after each group.
	$(".group, .seperator").addClass("OfficeUI_relative OfficeUI_inline"); // Make sure that the seperator are relative placed and inline.
	$(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("OfficeUI_inline"); // Make sure that iconsgroups, smallicons, iconlegend, imageholder and menuholder are displayed inline.
	$(".bigicon").addClass("icon OfficeUI_relative OfficeUI_inline OfficeUI_center"); // Make sure that a bigicon is displayed as an icon, relative, inline and centered.
	$(".smallicon").addClass("icon OfficeUI_relative") // Make sure that a smallicon is displayed as an icon, relative.
	$(".legend, .menu").addClass("OfficeUI_absolute"); // Make sure that the legend and the menu's are displayed absolute.
	$(".arrow").addClass("OfficeUI_relative"); // Make sure that an arrow is placed as relative.
	$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>'); // Make sure that every item in the breadcrumb there is an arrow, except the last one.
	$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>'); // Make sure that in a menuitem, on an li with the class "line" a line is added.

    EnableTab($("li[role='tab']:not(.application)").first().Id()); // Enable the first, non-application tab.

	// Event handlers are placed below.

		// When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
		$("li[role=tab]:not(.application)").click(function() {
			EnableTab($(this).Id());
		});

		// Bind the event for changing tabs on mouse scroll. 
        // We'll notice 2 events here. This is because the one ony work in Firefox, while the others are for all the browsers.
	    $(".ribbon").on('DOMMouseScroll mousewheel', function(e){
        	if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { EnableNextTab($(this)); }
        	else { EnablePreviousTab($(this));	}

        	//prevent page fom scrolling
        	return false;
    	});

    // General functions so make it work are placed here.

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

		// Enables the next available tab (except the application tab).
		function EnableNextTab() {
			EnableTab($($("li[role=tab].active").next()).Id());
		}

  		// Enables the previous available tab (except the application tab).
  		function EnablePreviousTab() {
    		// Check if the previous tab is not the application tab.
    		if (!$($("li[role=tab].active").prev()).hasClass("application")) {
      			EnableTab($($("li[role=tab]:not(.application).active").prev()).Id());
    		} 
  		}
}