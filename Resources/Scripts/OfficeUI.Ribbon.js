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
});