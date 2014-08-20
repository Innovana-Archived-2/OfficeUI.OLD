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
$.fn.RibbonFromJson = function(jsonUrl, options) {

    // Specify the default options for the Ribbon plugin.
    settings = $.extend({
        AutoGenerateTabId: false, // Defines a boolean that indicates wether id of tab elements should be automatticle generated or not.
        RibbonTemplateFile: "", // The template file (.tmpl) that defines the template for the ribbon.
        MenuArrowTemplateFile: "", // The template file (.tmpl) that defines the template for the menu arrow.
        MenuTemplateFile: "", // The template file (.tmpl) that defines the template for the menu itself.
        Plugins: [] // Defines the plugins for the ribbon.
    }, options);

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
        async: false,
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
                    OfficeUIMenuPlugin.Initialize(pluginOptions);
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
    function CreateUniqueId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
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
        $('.menucontents ul li.line').after('<li style="height: 1px; background-color: #D4D4D4; margin-left: 25px; "></li>');

        // Enable the first tab which is not an application tab.
        EnableTab($("li[role='tab']:not(.application)").first().Id());

        // When you click on a tab element (not the application tab), make sure that that tab element becomes active.
        $("li[role=tab]:not(.application)").click(function() {
            EnableTab($(this).Id());
        });

        // When you scroll when you're mousecursor is somewhere in the Ribbon, make sure that either the next or the previous tab is selected,
        // based on the direction of the scroll.
        // Note: We're binding 2 events here ('DOMMouseScroll' & 'mousewheel'). This is needed to make it work in Internet Explorer, Google Chrome & Mozilla Firefox.
        $(".ribbon").on('DOMMouseScroll mousewheel', function(e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                EnableNextTab($(this));
            } else {
                EnablePreviousTab($(this));
            }

            // Prevent the page from scrolling.
            return false;
        });
    }

    // Disables a given action by specifying it's id.
    // Parameters:
    //    actionId:     The id of the action to disable.
    function DisableAction(actionId) {
        $("#" + actionId).addClass("OfficeUI_disabled");
    }

    // Enables a given action by specifying it's id.
    // Parameters:
    //    actionId:     The id of the action to enable.
    function EnableAction(actionId) {
        $("#" + actionId).removeClass("OfficeUI_disabled");
    }

    // Enables a given action by specifying it's id and add a function to execute when the action if selected.
    // Parameters:
    //      actionId:   The id of the action to enable.
    //      action:     The action ot execute.
    function EnableActionWithLink(actionId, action) { 
        $("#" + actionId).removeClass("OfficeUI_disabled");

        $("#" + actionId).on("click", function() {
            action();
        });
    }

    // Enables a given tab, based on the id of the tab.
    // Parameters: 
    //    tabId:    The id of the tab that should be showed.
    function EnableTab(tabId) {
        // Chech if the tab with the id can be found and if not, write a message to the log.
        if ($("#" + tabId).LogWhenNotFound("[OfficeUI Ribbon]: Tab with id '" + tabId + "' not found.")) {
            // Check if the tab is an application tab. If that's the case, an error must be throwed, since activating this tab isn't permitted.
            if ($("#" + tabId).hasClass("application")) {
                console.log("%c [OfficeUI Ribbon]: An application tab cannot be enabled.", "color: red;");
            } else {
                // Start by deactiving every tab element on the page.
                OfficeUICoreHelpers.DeactivateAllTabs();

                // Marks the tab as the active one and display the contents for the tab.
                OfficeUICoreHelpers.ActivateTab(tabId);
            }
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

    // Creates the ribbon API.
    // The API for the ribbon (without any plugins has the following methods that are exposed);
    //      - EnableTab(id)             Enables a given tab by it's id.
    //      - EnableNextTab             Enables the next tab (if there's any).
    //      - EnablePreviousTab         Enables the previous tab (if there's any).
    function CreateRibbonAPI() {
        return {
            EnableTab: EnableTab,
            EnableNextTab: EnableNextTab,
            EnablePreviousTab: EnablePreviousTab,
            DisableAction: DisableAction,
            EnableAction: EnableAction,
            EnableActionWithLink: EnableActionWithLink // ToDo: Add to github, not part of the OfficeUI yet.
        }
    }

    // Create the API for the ribbon and return it.
    return CreateRibbonAPI();
}

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