// Make sure the document is loaded and jQuery is available.
$(document).ready(function() {
	// Disable the margin and the padding of the 'UL' class that displays the tabs.
	OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul"));
	OfficeUICore.DisablePadding($("#OfficeUI .ribbon .tabs > ul"));

	// Make the first tab the application tab.
	$("#OfficeUI .ribbon .tabs > ul li[role=tab]:first-child").addClass("application");
	OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul li[role=tab]:first-child"));

	// Set the first tab as the active one.
	OfficeUICore.MakeActive($("#OfficeUI .ribbon .tabs > ul li[role=tab]:not(.application)").first());

	// When clicked on a tab, make sure it's being activated.
	$("#OfficeUI .ribbon .tabs > ul li[role=tab]:not(.application)").click(function() {
		// Loop over all the tabs and deactivate them.
		$('#OfficeUI .ribbon .tabs > ul li[role=tab]').each(function(index) {
			OfficeUICore.MakeInactive(this);
		});

		// Activate the selected tab.
		OfficeUICore.MakeActive(this);
	});

	// See if an item is marked as a menuitem.
	// If that's the case, auto add a down arrow to indicate that this is a menuitem.
	$("#OfficeUI .ribbon .tabs > ul li[role=tab] .contents .group .icongroup .icon").children().each(function(index) {
		if ($(this).hasClass("menu")) {

			var element = $(this);

			$('<i class="fa fa-sort-asc arrow"></i>').appendTo($(this).prev());

			// Add a click event to the element that contains a menu.
			$(this).parent().click(function(e) {
				$(".menu").hide().parent().removeClass("active");

		        // Reset's the state.
		        $(document).data("state", 0);
        
				e.stopPropagation();
            	
            	// Check toggle state
	            if(!$(document).data("state") || $(document).data("state") == 0) {
	                // If menu is closed, show it
	                $(element).show().parent().addClass("active");

	                // Update state
	                $(document).data("state", 1);

	            } else if ($(document).data("state") == 1) {
	                // If menu is already open, close it
	                $(element).hide().parent().removeClass('active');

	                // Update state
	                $(document).data('state', 0);
	            }
			});
		}
	});

	// The following code is executed when a click has been done on the document.
	$(document).click(function() {
        $(".menu").hide().parent().removeClass("active");

        // Reset's the state.
        $(document).data("state", 0);
    });
});