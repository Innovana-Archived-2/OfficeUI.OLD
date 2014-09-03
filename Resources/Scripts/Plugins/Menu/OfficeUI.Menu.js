// Makes a menu out of the element on which it's called.
// Options can be passed to this function aswell.
//      Animate (default - true):                   A boolean that indicates wether the menu should be displayed using an animation;
//      AnimateDirection (default - up):            When animate is enabled, this is the direction in which the menu should be animated.
//      AnimateDirectionSubMenu (default - left):   When animate is enabled, this is the difrection in which the submenu should be animated.
//      DelayTime (default - 500):                  When there's a submenu item, this is the delay that it would take before the submenu opens.
//      TransitionTime (default - 100):             The time it takes before the animation of the menu is completed.
$.fn.Menu = function(options) {
    
    // Specify the default options for the menu plugin.
    var options = $.extend({
        Animate: true,
        AnimateDirection: "up",
        AnimateDirectionSubMenu: "left",
        DelayTime: 500,
        TransitionTime: 100
    }, options );

    // Get the object on which this is called.
    var object = $(this);

    Initialize();

    // Section: Functions.

        // Initialize the menu. This is done by placing classes on the various elements that together form the menu.
        // This is done to keep the HTML less cluthered.
        function Initialize() {
            $(".menucontents UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin");
            $(".menu").addClass("OfficeUI_absolute"); 
        }

    // End of section: Functions.


    // Section: Event Handlers

        var waitHandle; // An object that is used to specify a delay. 

        // Executed when you click on a menu entry.
        $("LI.menuEntry:not(.OfficeUI_disabled)").on("click", function(e) {
            e.stopPropagation();
            
            // Make sure to clear the timeout on the waithandle, otherwise, the menuitem might be showed twice.
            clearTimeout(waitHandle);

            // Check if the menuitem holds a submenu.
            if ($(".subMenuHolder", this).length > 0) {
                var element = $(this);

                transitionDirection = options.AnimateDirectionSubMenu;

                // Hide all the other open submenus.
                $(".menu", $(element).parent()).each(function() {
                    $(this).hide().parent().Deactivate();
                });

                // When the menu should be animated (specified in the options, animate it, otherwise just show it.)
                if (options.Animate) { $(".menu", element).first().show("slide", { direction: transitionDirection }, options.TransitionTime).Activate(); 
                } else { $(".menu", element).first().show(); }
            }
        });

        // Shows the submenu of a menuitem that's not disabled when hovering over it.
        $("LI.menuEntry:not(.OfficeUI_disabled)").on("mouseenter", function(e) {
            // Prevents the page from further execution.
            e.stopPropagation();

            // Sets the current transition direction. This variable is needed because it changes depending if it's a submenu or not.
            var transitionDirection = options.AnimateDirection;

            // Check if the menuitem holds a submenu.
            if ($(".subMenuHolder", this).length > 0) {
                var element = $(this);

                // Sets the direction of the transition.
                transitionDirection = options.AnimateDirectionSubMenu;
                
                // Specifies the function that should occur after the delay time has been passed.
                waitHandle = setTimeout(function() {
                    
                    // Hide all the other open submenus.
                    $(".menu", $(element).parent()).each(function() {
                        $(this).hide().parent().Deactivate();
                    });

                    // When the menu should be animated (specified in the options, animate it, otherwise just show it.)
                    if (options.Animate) { $(".menu", element).first().show("slide", { direction: transitionDirection }, options.TransitionTime).Activate(); 
                    } else { $(".menu", element).first().show(); }

                }, options.DelayTime);
            } else {
                // The menuitem does not hold a submenu, which means that we can close all the other submenu items.
                $(".menu", $(this).parent()).each(function() {
                    $(this).hide().parent().Deactivate();
                });
            }
        });

        // When the cursor moves away from the menuitem, make sure to clear the timeout, otherwise, the menu on which your cursor was placed will still open.
        $("LI.menuEntry").on("mouseout", function(e) {
            clearTimeout(waitHandle);
        });

        // When you click anywhere on the document, make sure that all the menu's are hidden.
        $(document).on("click", function (e) {
            $(".menu").each(function() {
                $(this).hide().parent().Deactivate();
                $(this).data("state", 0);
            });
        });

    // End of section: Event Handlers.


    // Section: API Creation.

        // Create an API and return that one.
        return CreateMenuAPI();

        // Creates the ribbon API.
        function CreateMenuAPI() {
            return {
                Show: Show,
                Hide: Hide,
                OpenContextMenu : OpenContextMenu
            }
        }

        // Shows the menu entry on which it it called.
        function Show() {
            if (options.Animate) { object.show("slide", { direction: options.AnimateDirection }, options.TransitionTime).Activate(); } // Always shows the menu. Never hide it on a hover.
            else { object.show(); }
        }

        // Hides the menu on which it is called.
        function Hide() {
            object.hide();
        }

        // Open a context menu.
        // Parameters:
        //      e:      The page event.
        function OpenContextMenu(e) {
            // Prevent the page from further execution.
            e.preventDefault();

            //getting height and width of the message box
            var height = $(".contextMenuInArea").height();
            var width = $(".contextMenuInArea").width();
            
            //calculating offset for displaying popup message
            leftVal = e.pageX - (width / 2) + "px";
            topVal = e.pageY - (height / 2) + "px";
            
            //show the popup message and hide with fading effect
            if (options.Animate) { object.css({left:leftVal,top:topVal}).show("slide", { direction: options.AnimateDirection }, options.TransitionTime).Activate(); } // Always shows the menu. Never hide it on a hover.
            else { object.css({left:leftVal,top:topVal}).show(); }

            return false;
        }

    // End of section: API Creation.
}