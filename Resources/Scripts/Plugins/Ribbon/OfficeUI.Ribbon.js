// Section: Global variables.

var settings; // Holds the settings for the construction of the ribbon.

// End of section: Global variables.

// Provides a way to construct a Ribbon through a Json data string.
// Parameters:
//      jsonUrl:            The url where the Json data string can be found.
//      options:            The options for the rendering of the ribbon.
// The options which are passed to this function have the following properties:
//      AutoGenerateTabId:  When this value is set to yet, every tab will have it's own unique identified (a guid).
//      RibbonTemplateFile: The template file to use to render the Ribbon.
$.fn.RibbonFromJson = function (jsonUrl, options) {
  
    // Specify the default options for the Ribbon plugin.
    settings = $.extend({
        AutoGenerateTabId: false, // Defines a boolean that indicates wether id of tab elements should be automatticle generated or not.
        RibbonTemplateFile: "", // The template file (.tmpl) that defines the template for the ribbon.
        MenuArrowTemplateFile: "", // The template file (.tmpl) that defines the template for the menu arrow.
        Plugins: [] // Defines the plugins for the ribbon.
    }, options );

    // Section: Common variables.

    var applicationTabs = 0; // Holds the amount of application tabs that are defined.
    var renderable = true; // Holds a boolean that indicates if the ribbon can be rendered.
    var ribbonHolder = this; // Holds the area where the ribbon should be rendered.
    var ribbonConstructor = { ribbonId: "" }; // Holds the object that will be passed to the templating engine for rendering the templates.

    // End of section: Common variables.

    // Validate if the 'RibbonTemplateFile' is provided.
    if (settings.RibbonTemplateFile == "") {
        console.log("%c [OfficeUI Ribbon]: The 'RibbonTemplateFile' specified in the options is a required field.", "color: red;");

        return; // Return the function since it's configuration is considered invalid.
    }

    // Load the Json data file, of which the location is specified in the 'jsonUrl' parameter.
    $.ajax({
        dataType: "json",
        url: jsonUrl,
        success: function(ribbon) {

            // Loop over all the defined plugins, and for every plugin, extend the options by adding "JsonData" field.
            // This field will then hold the Json data for the ribbon.
            if (settings.Plugins != "") {
                $(settings.Plugins).each(function(index, plugin) {
                    plugin.PluginOptions["JsonData"] = ribbon;
                });
            }

            // Defines the menu plugin here.
            var menuPlugin = {
                PluginName: "Menu Plugin",                                             
                    PluginFunction: function(pluginOptions) {                             
                        OfficeUIMenuPlugin.Initialize(pluginOptions, ribbon);
                    },
                    PluginOptions: $.extend({ 
                        MenuArrowTemplateFile: options.MenuArrowTemplateFile,
                        MenuTemplateFile: options.MenuTemplateFile
                    }) 
            }

            // Add the menu plugin, but we want to add it as the first plugin. This way we're sure that third pary plugins can extend the menu if they want, because the menu would already
            // have been rendered.
            settings.Plugins.unshift(menuPlugin);

            // Start the entire validation of the ribbon before rendering it.

            // Step 1: Verify that there are tabs elements defined.
            if (ribbon.Tabs == null) {
                console.log("%c [OfficeUI Ribbon]: A ribbon must be equipped with at least a single tab element.", "color: red;");
                
                return; // Return the function since it's configuration is considered invalid.

                renderable = false; // Change the 'renderable' value to make sure that the ribbon will not be rendered.
            }

            // Validate all the individual tab elements.
            $(ribbon.Tabs).each(function(index, tab) {
                if (ValidateTabElement(tab, settings)) {
                    renderable = true;
                }
            });

            // If we reach this point, the validation has been done for the ribbon and we can continue with the rendering of the Ribbon.
            if (!renderable) {
                console.log("%c [OfficeUI Ribbon]: The ribbon cannot be rendered since it's configuration is invalid.", "color: red;");

                return; // Return the function since it's configuration is considered invalid.
            } else {
                // Build the ribbon constructor object.
                if (ribbon.Id != null) {
                    ribbonConstructor.ribbonId = ribbon.Id
                }

                ribbonConstructor.tabs = [] // Set the tabs for the ribbon.

                // Loop over all the tabs which are defined in the Json and built the ribbon constructor
                $(ribbon.Tabs).each(function(index, tab) {                    
                    if (tab.Type == "Application") {
                        tab.TabType = "application";
                    } else {
                        tab.TabType = "normal";
                    }

                    // Loop over all the groups.
                    $(tab.Groups).each(function(index, group) {
                        
                        // Loop over all the icon groups.
                        $(group.IconGroups).each(function(index, iconGroup) {
                        
                            // Loop over all the icons.
                            $(iconGroup.Icons).each(function(index, icon) {
                                if (icon.Type == "Big") {
                                    icon.IconType = "bigicon";
                                } else {
                                    icon.IconType = "smallicon";
                                }
                            });
                        });
                    });
                });

                // Construct the ribbon, by given an area where to render the ribbon and the constructor which contains all the required properties to render the ribbon.
                ConstructRibbon(ribbon, ribbonHolder);

                // Initialize the ribbon.
                Initialize();

                // Loop through all the plugins and execute them.
                $(settings.Plugins).each(function(index, plugin) {
                    console.log("[OfficeUI]: The plugin '" + plugin.PluginName + "' is being executed.");

                    // The plugin is being executed.
                    plugin.PluginFunction(plugin.PluginOptions);

                    console.log("[OfficeUI]: The plugin '" + plugin.PluginName + "' has finished it's execution.");
                });
            }
        },

        // When there's an error while consuming the Json, render it here.
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });

    // Section: Validation.

    // Validate if a tab element is correctly.
    //
    // The following validation is executed within this function:
    //      - Make sure that every tab has an id when the options did not specify that a tab id would be generated by the framework.
    //      - Make sure that there is only 1 application tab.
    //      - Make sure that the selected tab types are supported by the framework.
    //        Only 2 tabs are allowed. "Application" and "Normal".
    //
    // Parameters:
    //      tab:            The tab which is going to be validated.
    //      settings:       The settings which were passed to the plugin in the first place.
    function ValidateTabElement(tab, settings) {
        // If the tabs should not have an auto-generated id, make sure that every tab has an id.
        if (settings.AutoGenerateTabId == false) {
            if (tab.Id == null) {
                console.log("%c [OfficeUI Ribbon]: Every tab must have an id element.", "color: red;");

                renderable = false; // Change the 'renderable' value to make sure that the ribbon will not be rendered.
                
                return; // Return the function since it's configuration is considered invalid.
            }
        } else { // Tabs should be auto generated, so assign id's to every tab element.
            if (tab.Id == null) {
                tab.Id = CreateUniqueId().toUpperCase();
            }
        }

        if (tab.Type == "Application") {
            applicationTabs += 1;

            // More than 1 application tab has been found.
            if (applicationTabs > 1) {
                console.log("%c [OfficeUI Ribbon]: A maximum of 1 application tab is allowed.", "color: red;");

                return; // Return the function since it's configuration is considered invalid.

                renderable = false; // Change the 'renderable' value to make sure that the ribbon will not be rendered.
            }

        } else if (tab.Type != "Normal") {
            console.log("%c [OfficeUI Ribbon]: The tab type '" + tab.Type + "' is not supported by the Ribbon framework.", "color: red;");

            return; // Return the function since it's configuration is considered invalid.

            renderable = false; // Change the 'renderable' value to make sure that the ribbon will not be rendered.
        }
    }

    // End of section: Validation.

    // Section: Functions.

    // Construct the ribbon by using the OfficeUI templates.
    // Parameters:
    //      ribbon:             The ribbon object itself which is going to be rendered.
    //      ribbonHolder:       Defines the area in which the ribbon should be rendered.
    function ConstructRibbon(ribbon, ribbonHolder) {
        // Get the ribbon template.
        var ribbonTemplateUrl = settings.RibbonTemplateFile;

        // Get the template to build the ribbon.
        $.ajax({
            async: false,    
            dataType: "text",
            url: ribbonTemplateUrl,
            success: function(template) {
                
                // I need to pass this data to the templating engine at first.
                var templated = OfficeUITemplating.LoadTemplate("Ribbon template", template, ribbon);

                $(ribbonHolder).append(templated);

            },

            // When there's an error while consuming the Json, render it here.
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    // Provides a way to create a Unique Id that can be assigned to tab elements.
    function CreateUniqueId()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    // Initialize the whole ribbon. This is done by placing classes on the various elements that together form the ribbon.
    // This is done to keep the HTML less cluthered.
    // Also some basic functions such as selecting the correct tab are executed here.
    function Initialize() {
        $("ul[role='tablist'] > li").attr("role", "tab");
        $(".ribbon, .tabs").addClass("brd_btm_grey");
        $(".tabs UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin");
        $("li[role='tab']").addClass("OfficeUI_inline");
        $("li[role='tab'] span:first-child").addClass("OfficeUI_uppercase");
        $("li[role='tab'] .contents").addClass("OfficeUI_absolute");
        $(".group").after("<div class='seperator'>&nbsp;</div>");
        $(".group, .seperator").addClass("OfficeUI_relative OfficeUI_inline");
        $(".icongroup, .smallicon .iconlegend").addClass("OfficeUI_inline");
        $(".bigicon").addClass("icon OfficeUI_relative OfficeUI_inline OfficeUI_center");
        $(".smallicon").addClass("icon OfficeUI_relative");
        $(".legend").addClass("OfficeUI_absolute");
        //$(".arrow").addClass("OfficeUI_relative");
        //$(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>');
        $('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>');

        // Enable the first tab which is not an application tab.
        EnableTab($("li[role='tab']:not(.application)").first().Id());

        // When you click on a tab element (not the application tab), make sure that that tab element becomes active.
        $("li[role=tab]:not(.application)").click(function () {
            EnableTab($(this).Id());
        }); 

        // When you scroll when you're mousecursor is somewhere in the Ribbon, make sure that either the next or the previous tab is selected,
        // based on the direction of the scroll.
        // Note: We're binding 2 events here ('DOMMouseScroll' & 'mousewheel'). This is needed to make it work in Internet Explorer, Google Chrome & Mozilla Firefox.
        $(".ribbon").on('DOMMouseScroll mousewheel', function (e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { EnableNextTab($(this)); }
            else { EnablePreviousTab($(this)); }

            // Prevent the page from scrolling.
            return false;
        });

        var waitHandleShowing; // An object that is used to specify a delay. 

        // Executed when you click on any icon which is not disabled.
        $(".icon").on("click", function (e) {
            // Make sure that tooltips will not be showed anymore by clearing the showing timeout.
            clearTimeout(waitHandleShowing);
            
            if (!$(this).hasClass("OfficeUI_disabled")) { // Check if the icon is not disabled. This is needed because items can be disabled on the fly.
                if ($(this).HoldsMenu()) { // Check if it's a menu.
                    e.stopPropagation();
                    EnableMenu(OfficeUIConstants.menuTransition, $(".menu", this).first());
                }
            }
        });
    }

    // Enables a given tab, based on the id of the tab.
    // Parameters: 
    //    tabId:    The id of the tab that should be showed.
    function EnableTab(tabId) {
        // Chech if the tab with the id can be found and if not, write a message to the log.
        if ($("#" + tabId).LogWhenNotFound("[OfficeUI Ribbon]: Tab with id '" + tabId + "' not found.")) {
            // Start by deactiving every tab element on the page.
            OfficeUICoreHelpers.DeactivateAllTabs();

            // Marks the tab as the active one and display the contents for the tab.
            OfficeUICoreHelpers.ActivateTab(tabId);
        } 
    }

    // Enables the next tab if there is any.
    function EnableNextTab() {
        // If there's a next tab (if the tab has an id, select it, otherwise, do nothing).
        if ($("li[role=tab].active").next().Id() != null) {
            EnableTab($($("li[role=tab].active").next()).Id());
        }
    }

    // Enables the previous tab, but only if it's not the application tab.
    function EnablePreviousTab() {
        if (!$($("li[role=tab].active").prev()).hasClass("application")) {
            EnableTab($($("li[role=tab]:not(.application).active").prev()).Id());
        }
    }

        // Enable the menu for a given icon.
    //  Parameters:
    //    Timekey: The duration it takes to slide down the element., 
    //    Elementkey: The element on which the "active" class should be set. 
    function EnableMenu(time, element) {
        // Check if the menu is closed. If that's the case, we should show it.
        if (!$(element).data("state") || $(element).data("state") == 0) {

            // Hide every menutitem which is visible for the moment.
            $(".menu").each(function () {
                $(this).hide().parent().Deactivate();
                $(this).data("state", 0);
            });

            $(element).parent().Activate();
            $(element).Menu().Show();

            // Update the current state.
            $(element).data("state", 1);

            // Menu is visible, so let's close it.
        } else if ($(element).data("state") == 1) {
            DisableMenu($(element));
        }
    }

    // Disables a menu.
    //  Parameters:
    //      element:    The element (menu) that should be hidden.
    function DisableMenu(element) {
        $(element).Menu().Hide();

        // Update the state.
        $(element).data("state", 0);
    }

    return CreateRibbonAPI();

    // Creates the ribbon API.
    function CreateRibbonAPI() {
        return {
            ActivateAction: ActivateAction,
            DeactivateAction: DeactivateAction
        }
    }

    // Actviate an action based on the ic.
    // Parameters:
    //  actionId:   The id of the action that should be enabled.
    function ActivateAction(actionId) {
        var element = $("#" + actionId);
        element.removeClass("OfficeUI_disabled");
    }

    // Deactivate an action based on the ic.
    // Parameters:
    //  actionId:   The id of the action that should be enabled.
    function DeactivateAction(actionId) {
        var element = $("#" + actionId);
        element.addClass("OfficeUI_disabled");
    }
},



// Makes a ribbon out of an element.
$.fn.Ribbon = function (options) {
    // Specify the default options for the menu plugin.
    var options = $.extend({});

    // Get the object on which this is called.
    var object = $(this);

    // Initialize the ribbon.
    Initialize();

    // Section: Functions.

    // Initialize the whole ribbon. This is done by placing classes on the various elements that together form the ribbon.
    // This is done to keep the HTML less cluthered.
    // Also some basic functions such as selecting the correct tab are executed here.
    function Initialize() {
        $("ul[role='tablist'] > li").attr("role", "tab");
        $(".ribbon, .tabs").addClass("brd_btm_grey");
        $(".tabs UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin");
        $("li[role='tab']").addClass("OfficeUI_inline");
        $("li[role='tab'] span:first-child").addClass("OfficeUI_uppercase");
        $("li[role='tab'] .contents").addClass("OfficeUI_absolute");
        $(".group").after("<div class='seperator'>&nbsp;</div>");
        $(".group, .seperator").addClass("OfficeUI_relative OfficeUI_inline");
        $(".icongroup, .smallicon .iconlegend, .imageHolder, .menuItem").addClass("OfficeUI_inline");
        $(".bigicon").addClass("icon OfficeUI_relative OfficeUI_inline OfficeUI_center");
        $(".smallicon").addClass("icon OfficeUI_relative");
        $(".legend").addClass("OfficeUI_absolute");
        $(".arrow").addClass("OfficeUI_relative");
        $(".breadcrumbItem:not(:last-child)").after('<i class="fa fa-caret-right"></i>');

        // Enable the first tab which is not an application tab.
        EnableTab($("li[role='tab']:not(.application)").first().Id());
    }

    // Enables a given tab, based on the id of the tab.
    // Parameters: 
    //    tabId:    The id of the tab that should be showed.
    function EnableTab(tabId) {
        // Chech if the tab with the id can be found and if not, write a message to the log.
        if ($("#" + tabId).LogWhenNotFound("Tab with id '" + tabId + "' not found.")) {
            // Start by deactiving every tab element on the page.
            OfficeUICoreHelpers.DeactivateAllTabs();

            // Marks the tab as the active one and display the contents for the tab.
            OfficeUICoreHelpers.ActivateTab(tabId);
        } else {
            EnableTab($("li[role='tab']:not(.application)").first().Id());
        }
    }

    // Enables the next tab if there is any.
    function EnableNextTab() {
        EnableTab($($("li[role=tab].active").next()).Id());
    }

    // Enables the previous tab, but only if it's not the application tab.
    function EnablePreviousTab() {
        if (!$($("li[role=tab].active").prev()).hasClass("application")) {
            EnableTab($($("li[role=tab]:not(.application).active").prev()).Id());
        }
    }

    // Enable the menu for a given icon.
    //  Parameters:
    //    Timekey: The duration it takes to slide down the element., 
    //    Elementkey: The element on which the "active" class should be set. 
    function EnableMenu(time, element) {
        // Check if the menu is closed. If that's the case, we should show it.
        if (!$(element).data("state") || $(element).data("state") == 0) {

            // Hide every menutitem which is visible for the moment.
            $(".menu").each(function () {
                $(this).hide().parent().Deactivate();
                $(this).data("state", 0);
            });

            $(element).parent().Activate();
            $(element).Menu().Show();

            // Update the current state.
            $(element).data("state", 1);

            // Menu is visible, so let's close it.
        } else if ($(element).data("state") == 1) {
            DisableMenu($(element));
        }
    }

    // Disables a menu.
    //  Parameters:
    //      element:    The element (menu) that should be hidden.
    function DisableMenu(element) {
        $(element).Menu().Hide();

        // Update the state.
        $(element).data("state", 0);
    }

    // End of section: Functions.


    // Section: Event Handlers.

    // When you click on a tab element (not the application tab), make sure that that tab element becomes active.
    $("li[role=tab]:not(.application)").click(function () {
        EnableTab($(this).Id());
    });

    // When you scroll when you're mousecursor is somewhere in the Ribbon, make sure that either the next or the previous tab is selected,
    // based on the direction of the scroll.
    // Note: We're binding 2 events here ('DOMMouseScroll' & 'mousewheel'). This is needed to make it work in Internet Explorer, Google Chrome & Mozilla Firefox.
    $(".ribbon").on('DOMMouseScroll mousewheel', function (e) {
        if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { EnableNextTab($(this)); }
        else { EnablePreviousTab($(this)); }

        // Prevent the page from scrolling.
        return false;
    });

    var waitHandleShowing; // An object that is used to specify a delay. 
    var waitHandleHiding; // An object that is used to specify a delay.

    // Executed when you click on any icon which is not disabled.
    $(".icon").on("click", function (e) {

        // Make sure that tooltips will not be showed anymore by clearing the showing timeout.
        clearTimeout(waitHandleShowing);
        
        // Hide all the tooltip's.
        $('.tooltip').each(function(index) {
            $(this).hide();
        });

        if (!$(this).hasClass("OfficeUI_disabled")) { // Check if the icon is not disabled. This is needed because items can be disabled on the fly.
            if ($(this).HoldsMenu()) { // Check if it's a menu.
                e.stopPropagation();
                EnableMenu(OfficeUIConstants.menuTransition, $(".menu", this).first());
            }
        }
    });

    // When we enter the area of an icon, check if there is a tooltip defined.
    // If that's the case, start the function to show it.
    $('.icon').on("mouseenter", function(e) {
        var tooltipElement;

        // Make sure that the timing for hiding or displaying is disabled.
        clearTimeout(waitHandleShowing);
        clearTimeout(waitHandleHiding);

        // If the icon has a defined tooltip, show it when the mouse is hovering on it for 1 second.
        if ($(this).next().attr("class") == "tooltip") {

            tooltipElement = $(this).next()

            // When the tooltip needs to be showed for a small icon, we need to manually calculate the top position.
            // Since 3 small icons can be placed under eachother, it's important to know which element is being displayed.
            if ($(this).attr("class").indexOf("smallicon") != -1) {
                var currentElement = $(this);
                var iconGroup = $(this).parent().parents(".icongroup");

                $(".smallicon", iconGroup).each(function(i, element) {
                    if (element == currentElement.get(0)) {
                        // For some strange reason, the display in pixels is different in Chrome, Firefox and Internet Explorer, so for that reason the loop is here.
                        if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
                            if (i == 0) { // The small icon is the first one.
                                $(tooltipElement).css({ top: '65px' });
                            } else if (i == 1) { // The small icon is the second one.
                                $(tooltipElement).css({ top: '41px' });
                            } else if (i == 2) { // The smakk icon is the third one.
                                $(tooltipElement).css({ top: '17px' });
                            }
                        } else if(/windows/.test(navigator.userAgent.toLowerCase())){
                            if (i == 0) { // The small icon is the first one.
                                $(tooltipElement).css({ top: '89px' });
                            } else if (i == 1) { // The small icon is the second one.
                                $(tooltipElement).css({ top: '65px' });
                            } else if (i == 2) { // The smakk icon is the third one.
                                $(tooltipElement).css({ top: '41px' });
                            }
                        } else {
                            if (i == 0) { // The small icon is the first one.
                                $(tooltipElement).css({ top: '78px' });
                            } else if (i == 1) { // The small icon is the second one.
                                $(tooltipElement).css({ top: '54px' });
                            } else if (i == 2) { // The smakk icon is the third one.
                                $(tooltipElement).css({ top: '30px' });
                            }
                        }
                    }
                });
            }

            waitHandleShowing = setTimeout(function() {
                $(tooltipElement).show(); 
            }, 1000);
        }

        // When we leave the icon, hide all the visibile tooltips.
        $(this).on("mouseout", function(e) {
            
                waitHandleHiding = setTimeout(function() { 
                    $('.tooltip').each(function(index) {
                    $(this).hide();
                });
            }, 500);
        });

        //
        
        
    });

    

    // End of section: Experimental - Tooltip handling.

    // End of section : Event Handlers.

    // Section: API Creation.

    // Create an API and return that one.
    return CreateRibbonAPI();

    // Creates the ribbon API.
    function CreateRibbonAPI() {
        return {
            ActivateAction: ActivateAction,
            DeactivateAction: DeactivateAction
        }
    }

    // Actviate an action based on the ic.
    // Parameters:
    //  actionId:   The id of the action that should be enabled.
    function ActivateAction(actionId) {
        var element = $("#" + actionId);
        element.removeClass("OfficeUI_disabled");
    }

    // Deactivate an action based on the ic.
    // Parameters:
    //  actionId:   The id of the action that should be enabled.
    function DeactivateAction(actionId) {
        var element = $("#" + actionId);
        element.addClass("OfficeUI_disabled");
    }

    // End of Section: API Creation.
}

// Provides constants that will be used in here.
var OfficeUIConstants = {
    menuTransition: 100, // Defines the amount of time (milliseconds) that it takes for a menu item in the ribbon to be completely shown.
    subMenuTimeout: 500  // Defines the amount of time (milliseconds) that a cursor must be placed over a certain menu entry in the ribbon before the submenu will open.
};

// Provides internal helpers for the ribbon.
var OfficeUICoreHelpers = {

    // Enables a given tab, based on the id of the tab.
    // Parameters: 
    //    tabId:    The id of the tab that should be showed.
    ActivateTab: function (tabId) {
        $("#" + tabId).Activate();
        $(".contents", $("#" + tabId)).Activate();
    },

    // Deactivates a given tab, based on the id of the tab.
    // Parameters: 
    //    tabId:    The id of the tab element that should be deactivated.
    DeactivateTab: function (tabId) {
        $("#" + tabId).Deactivate();
        $(".contents", $("#" + tabId)).Deactivate();
    },

    // Deactivates all the tab elements which are on the page.
    DeactivateAllTabs: function () {
        $("li[role=tab]").each(function (index) {
            OfficeUICoreHelpers.DeactivateTab($(this).Id());
        });
    }
}