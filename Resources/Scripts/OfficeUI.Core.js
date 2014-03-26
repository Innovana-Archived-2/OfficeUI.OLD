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
		$(".tabs > ul > li").attr("role", "tab");
		$("li[role=tab]").addClass("inline");
		$(".bigicon, .smallicon").addClass("icon").addClass("relative").addClass("inline").addClass("center");
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