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

		// Mark the "li" elements in the "tabs" collection act as a "tab".
		$(".tabs > ul > li").attr("role", "tab");
		$(".tabs > ul li > SPAN:first-child").addClass("title");
		$(".tabs > ul li > DIV:first-of-type").addClass("contents");
		$(".contents > DIV").addClass("group");
		$(".group > DIV").addClass("icongroup");
		$(".group > DIV:last-child").removeClass("icongroup");

		// Make the first tab the application tab and disable the margins.
		OfficeUICore.DisableMargin($("#OfficeUI .ribbon .tabs > ul li[role=tab]:first-child").addClass("application"));

		// Mark the first tab (not the application tab) as the active one.
		OfficeUICore.MakeActive($("#OfficeUI .ribbon .tabs > ul li[role=tab]:not(.application)").first());

		// Some general styling is done here.
		$("li[role=tab]").addClass("inline");
		$(".bigicon, .smallicon").addClass("icon").addClass("relative").addClass("inline").addClass("center");
		$(".icon > DIV:first-of-type").addClass("label");
		$(".group").addClass("relative").addClass("left");
		$(".icongroup").addClass("inline");
		$(".menu > DIV:first-child").addClass("menucontents").addClass("relative");
		$(".menu > DIV:first-child > ul").addClass("nomargin").addClass("nopadding");
		$(".imageHolder").addClass("relative");
		$(".seperator").addClass("left");
		$(".group > DIV:last-child").addClass("legend");
		$(".legend").addClass("center").addClass("absolute");
		$(".contents, .icon .menu").addClass("absolute");
		$(".menu > DIV ul li DIV:first-child").addClass("imageHolder");
	}
};