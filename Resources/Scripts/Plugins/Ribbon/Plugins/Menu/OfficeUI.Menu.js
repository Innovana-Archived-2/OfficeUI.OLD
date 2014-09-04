// Section: Variables needed for this menu.

	var menuArrowTemplateFile = "";
	var menuTemplateFile = "";

// End of section: Variables needed for this menu.

// Defines the menu plugin for the ribbon.
var OfficeUIMenuPlugin = {

	// Initialize the plugin.
	Initialize: function(options, jsonData) {

		// This plugin is handling the menu, so we need to parse the Json data string until we found an item that's bound to an image.
		// This means that we need to have a couple of for-each statement in eachother to get to the menu's.

		menuArrowTemplateFile = options.MenuArrowTemplateFile; // Get the url of the menu arrow template.
		menuTemplateFile = options.MenuTemplateFile; // Get the url of the menu template.

		// Get all the tab elements.
		$(jsonData.Tabs).each(function(tabIndex, tab) {

			console.log("[OfficeUI Menu Plugin]: Searching the tab '" + tab.Name + "'.");

			// For every tab element, get the groups.
			$(tab.Groups).each(function(groupIndex, group) {

				console.log("[OfficeUI Menu Plugin]: Searching the group with legend: '" + group.Legend + "'.");

				// For every group, get the icon groups.
				$(group.IconGroups).each(function(iconGroupIndex, iconGroup) {

					console.log("[OfficeUI Menu Plugin]: Searching the icon group at position: '" + iconGroupIndex + "'.");

					// For every icon group, get the icon.
					$(iconGroup.Icons).each(function(iconIndex, icon) {
						
						if (icon.MenuItems != null) {
							console.log("[OfficeUI Menu Plugin]: The icon at position: '" + iconIndex + "' has defined menu items and should be rendered.");

							// With the jQuery selector, get to the icon by using various selectors.
							var tabElement = $("#OfficeUI ul[role=tablist] > li[role=tab]:eq(" + tabIndex + ")");
							var groupElement = $(".contents .group:eq(" + groupIndex + ")", tabElement);
							var iconGroupElement = $(".icongroup:eq(" + iconGroupIndex +")", groupElement);
							var iconElement = $(".icon:eq(" + iconIndex + ")", iconGroupElement);

							var iconArrowArea = $(".iconlegend", iconElement); // Defines the area where the down arrow should be showed.

							OfficeUIMenuPlugin.ConstructMenuArrow(null, iconArrowArea);
							OfficeUIMenuPlugin.ConstructMenu(icon.MenuItems, iconElement);
						} else {
							console.log("[OfficeUI Menu Plugin]: The icon at position: '" + iconIndex + "' has not defined any menu items.");
						}
					});

				});

			});

		});
		
		// Adds all the required clasess to construct the menu.
		$(".menuItem, .imageHolder").addClass("OfficeUI_inline");
		$('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>');
		$(".menucontents UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin");
        $(".menu").addClass("OfficeUI_absolute"); 
	},

	// Construct the menu arrow by using the OfficeUI templates.
    // Parameters:
    //      menu: 	            The menu object itself which is going to be rendered.
    //      menuHolder:       	Defines the area in which the menu should be rendered.
    ConstructMenuArrow: function(menu, menuHolder) {
        // Get the template to build the ribbon.
        $.ajax({
            async: false,    
            dataType: "text",
            url: menuArrowTemplateFile,
            success: function(template) {

                // I need to pass this data to the templating engine at first.
                var templated = OfficeUITemplating.LoadTemplate("Menu arrow template", template, menu);

                $(menuHolder).append(templated);
            },

            // When there's an error while consuming the Json, render it here.
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    },

    // Construct the menu arrow by using the OfficeUI templates.
    // Parameters:
    //      menu: 	            The menu object itself which is going to be rendered.
    //      menuHolder:       	Defines the area in which the menu should be rendered.
    ConstructMenu: function(menu, menuHolder) {
        // Get the template to build the ribbon.
        $.ajax({
            async: false,    
            dataType: "text",
            url: menuTemplateFile,
            success: function(template) {

                // I need to pass this data to the templating engine at first.
                var templated = OfficeUITemplating.LoadTemplate("Menu template", template, menu);

                $(menuHolder).append(templated);
            },

            // When there's an error while consuming the Json, render it here.
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }
}