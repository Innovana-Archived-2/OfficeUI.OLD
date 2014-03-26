// Make sure the document is loaded and jQuery is available.
$(document).ready(function() {
	// Disable the margin and the padding of the "UL" class that displays the tabs.
	OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul"));
	OfficeUICore.DisablePadding($("#OfficeUI .ribbon .tabs > ul"));

	// Make the first tab the application tab and disable the margins.
	OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul li[role=tab]:first-child").addClass("application"));

	// Mark the first tab (not the application tab) as the active one.
	OfficeUICore.MakeActive($("#OfficeUI .ribbon .tabs > ul li[role=tab]:not(.application)").first());

	// Check if an item is marked as a "MenuItem". This indicates that there is an invisible dropdown which will be showed when you click on it.
	$("#OfficeUI .ribbon .tabs > ul li[role=tab] .contents .group .icongroup .icon").children().each(function(index) {
		if ($(this).hasClass("menu")) {

			// Gets the current element.
			var element = $(this);

			// Add the down arrow to indicate that there are some icons underneath it.
			$('<i class="fa fa-sort-asc arrow"></i>').appendTo($(this).prev());

			// Add a click event on the element which should show the dropdown.
			$(this).parent().click(function(e) {
                e.stopPropagation();

                // Check the "toggle" state.
                if(!$(this).data("state") || $(this).data("state") == 0) { // Menu is closed, so we should show it.
                    $(element).show().parent().addClass("active");
                    
                    // Update the current state.
                    $(this).data("state", 1);
                } else if ($(this).data("state") == 1) { // Menu is visible, so let's close it.
                    $(element).hide().parent().removeClass("active");
                    
                    // Update the state.
                    $(this).data("state", 0);
                }
                
			});
		}
	});
	


	// Event handlers for the Ribbon are placed here.

		// When you click on a tab (not the application tab), make sure that the correct contents are showed.
		$("#OfficeUI .ribbon .tabs > ul li[role=tab]:not(.application)").click(function() {
			
			// Deactivate all the tabs.
			$("#OfficeUI .ribbon .tabs > ul li[role=tab]").each(function(index) {
				OfficeUICore.MakeInactive(this);
			});

			// Activate the tab which is selected.
			OfficeUICore.MakeActive(this);
		});
    	
    	// When you click somewhere on the document, execute the following code.
	    $(document).click(function() {
	    	// Make sure that all dropdowns are closed and that the toggle state is updated.
	        $(".menu").each(function() {
	            $(this).hide().parent().data("state", 0).removeClass("active");
	        });
	    });
});