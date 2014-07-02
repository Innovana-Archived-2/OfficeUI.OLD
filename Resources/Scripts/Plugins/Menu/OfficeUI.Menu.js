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
//      Animate (default - true):               A boolean that indicates wether the menu should be displayed using an animation;
//      AnimateDirection (default - left):      When animate is enabled, this is the direction in which the menu should be animated.
//      DelayTime (default - 500):              When there's a submenu item, this is the delay that it would take before the submenu opens.
//      TransitionTime (default - 100):         The time it takes before the animation of the menu is completed.
$.fn.Menu = function(options) {
	
    // Specify the default options for the menu plugin.
	var options = $.extend({
        Animate: true,
        AnimateDirection: "left",
        DelayTime: 500,
        TransitionTime: 100
    }, options );

    var object = $(this);

	// Initialization logic for the menu is done here.
	$(this).addClass("menu");

	// Different event handlers are placed here.

        var waitHandle;

        // When you hover on a menu entry that's not disabled, open up the menu underneath.
        $("LI.menuEntry:not(.OfficeUI_disabled)").on("mouseenter", function(e) {
            
            e.stopPropagation();
            
            // Check if the item holds a submenu.
            if ($(".subMenuHolder", this).length > 0) {
                var element = $(this);
                waitHandle = setTimeout(function() {
            
                $(".menu", $(element).parent()).each(function() {
                    $(this).hide().parent().Deactivate();
                });

                // When the menu should be animated, animate it.
                if (options.Animate) {
                    $(".menu", element).first().show("slide", { direction: options.AnimateDirection }, options.TransitionTime).Activate(); // Always shows the menu. Never hide it on a hover.
                } else {
                    $(".menu", element).first().show();
                }

            }, options.DelayTime);

          } else { // The item is not holding any submenu, so we can hide every open submenu.
            $(".menu", $(this).parent()).each(function() {
              $(this).hide().parent().Deactivate();
            });
          }
        });

// Executed when the menuentry is left.
        $("LI.menuEntry").on("mouseout", function(e) {
          clearTimeout(waitHandle);
        });


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



    // Create an API and return that one.
    return CreateMenuAPI();

    // Creates the ribbon API.
    function CreateMenuAPI() {
        return {
            Show: Show
        }
    }

    var currentMousePos = { x: -1, y: -1 };


    // Shows the menu entry on which it it called.
    function Show() {

        if (options.Animate) {
                    object.show("slide", { direction: options.AnimateDirection }, options.TransitionTime).Activate(); // Always shows the menu. Never hide it on a hover.
                } else {
                    object.show();
                }
    }

    // Hides the menu on which it is called.
    function Hide() {
        console.log("Menu should be hided here.");
    }
}