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
	}
};