// The OfficeUICore namespace. Every function can be called by using "OfficeUICore.{functionName}"
var OfficeUICore = {
	// Disable the margin on the requested element.
	DisableMargin: function(element) {
		$(element).addClass("nomargin");
	},

	// Disable the padding on the requested element.
	DisablePadding: function(element) {
		$(element).addClass("nopadding");
	},

	// Marks an item as being active.
	MakeActive: function(element) {
		$(element).addClass("active");
		$(".contents", element).addClass("active");
	},

	// Marks an item as being inactive.
	MakeInactive: function(element) {
		$(element).removeClass("active");
		$(".contents", element).removeClass("active");
	},

	// Initialize the ribbon.
	Init: function(element) {
		// Disable the margin and the padding of the "UL" class that displays the tabs.
		OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul"));
		OfficeUICore.DisablePadding($("#OfficeUI .ribbon .tabs > ul"));

		$(".tabs > ul > li").attr("role", "tab"); // Make the "li" elements in the "tabs" collection act as a "tab".

		// Make the first tab the application tab and disable the margins.
		OfficeUICore.DisableMargin($("li[role=tab]:first-child").addClass("application"));

		$(".tabs > ul li[role=tab] > DIV:first-of-type").addClass("contents"); // Make the first DIV element in each tab act as the "contents".

		// Mark the first tab (not the application tab) as the active one.
		OfficeUICore.MakeActive($("li[role=tab]:not(.application)").first());

		$(".tabs > ul li[role=tab] > SPAN:first-child").addClass("title"); // Make the first element in each tab if it's a SPAN act as a "title".
		$(".contents > DIV").addClass("group"); // For every DIV element in the contents, let them act as a group.
		$(".group > DIV").addClass("icongroup"); // For every DIV element in a group, let them act as an icongroup.
		$(".group > DIV:last-child").addClass("legend"); // Make the last DIV element in a group act as the "legend".
		$(".group > DIV:last-child").removeClass("icongroup"); // On the last DIV element in a group, remove the icongroup.
		$(".menu > DIV ul li DIV:first-child").addClass("imageHolder"); // In a menu dropdown, make sure the first element is always a "ImageHolder".

		// Put some additional classes on the icons.
		$(".bigicon, .smallicon").addClass("icon").addClass("relative").addClass("inline").addClass("center");
		
		$(".icon > DIV:first-of-type").addClass("label"); // Make the first DIV element in an icon act as the "legend".

		// Some general styling on different elements.
		$("li[role=tab]").addClass("inline");
		$(".group").addClass("relative").addClass("left");
		$(".icongroup").addClass("inline");
		$(".menu > DIV:first-child").addClass("menucontents").addClass("relative");
		$(".menu > DIV:first-child > ul").addClass("nomargin").addClass("nopadding");
		$(".imageHolder").addClass("relative");
		$(".seperator").addClass("left");
		$(".legend").addClass("center").addClass("absolute");
		$(".contents, .icon .menu").addClass("absolute");
	}
};