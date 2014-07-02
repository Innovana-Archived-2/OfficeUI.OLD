// Extend the jQuery FN so that new methods can be called.
// Those new methods are needed in the API.
jQuery.fn.extend({
  
  // Activates the element on which this function is called by adding the class "active" on it.
  Activate: function() {
    $(this).addClass("active");
  }
});

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

    // Initialization logic.
    $(".menucontents UL").addClass("OfficeUI_nowrap OfficeUI_nopadding OfficeUI_nomargin");
    $(".menu").addClass("OfficeUI_absolute"); 

	// Initialization logic for the menu is done here.
	$(this).addClass("menu");

	// Different event handlers are placed here.

        var waitHandle; // A waiter that wait's for a specific time to be passed.

        // When you hover on a menu entry that's not disabled, open up the menu underneath.
        $("LI.menuEntry:not(.OfficeUI_disabled)").on("mouseenter", function(e) {
            
            // Prevents the page from further execution.
            e.stopPropagation();

            // Sets the current transition direction. This variable is needed because it changes depending if it's a submenu or not.
            var transitionDirection = options.AnimateDirection;
            
            // Check if the item holds a submenu.
            if ($(".subMenuHolder", this).length > 0) {
                var element = $(this);

                // Sets the direction of the transition.
                transitionDirection = options.AnimateDirectionSubMenu;
                
                // Specifies the function that should occur after the delay time has been passed.
                waitHandle = setTimeout(function() {
            
                    $(".menu", $(element).parent()).each(function() {
                        $(this).hide().parent().Deactivate();
                    });

                    // When the menu should be animated, animate it.
                    if (options.Animate) { $(".menu", element).first().show("slide", { direction: transitionDirection }, options.TransitionTime).Activate(); // Always shows the menu. Never hide it on a hover.
                    } else { $(".menu", element).first().show(); }

                }, options.DelayTime);

          } else { // The item is not holding any submenu, so we can hide every open submenu.
            $(".menu", $(this).parent()).each(function() {
              $(this).hide().parent().Deactivate();
            });
          }
        });

        // When the menu entry is left, make sure that the wait handler is cleared, otherwise some old menu items might become visible.
        $("LI.menuEntry").on("mouseout", function(e) {
          clearTimeout(waitHandle);
        });

    // Create an API and return that one.
    return CreateMenuAPI();

    // Creates the ribbon API.
    function CreateMenuAPI() {
        return {
            Show: Show,
            Hide: Hide
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


// Context menu demo.

        //$(".contextMenu").on("contextmenu", function(e) {
        //    e.preventDefault();

            //getting height and width of the message box
        //    var height = $(".contextMenuInArea").height();
        //    var width = $(".contextMenuInArea").width();
            
            //calculating offset for displaying popup message
        //    leftVal = e.pageX - (width / 2) + "px";
        //    topVal = e.pageY - (height / 2) + "px";
            
            //show the popup message and hide with fading effect
        //    $("#contextMenuInArea").css({left:leftVal,top:topVal}).show("slide", { direction: "up" }, OfficeUIConstants.menuTransition);
        //  return false;
        //});

// End of the context menu.
}