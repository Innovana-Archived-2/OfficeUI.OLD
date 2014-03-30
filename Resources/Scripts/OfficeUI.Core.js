// Extend the jQuery FN so that new methods can be called.
jQuery.fn.extend({
  
  // Enable the tab contents for a given tab element.
  EnableTabContents: function() {
    
    // Start by deactiving every tab element on the page.
    $("li[role=tab]").each(function(index) {
      $(this).removeClass("active");
      $(".contents", this).removeClass("active");
    });

    // Activate the tab which is requested.
    $(this).addClass("active");
    $(".contents", this).addClass("active");

    // Return the "tab" element.
    return $(this);
  },

  // Enable the menu for a given icon.
  //  Parameters:
  //    Timekey: The duration it takes to slide down the element., 
  //    Elementkey: The element on which the "active" class should be set. 
  EnableMenu: function(time, element) {
    // Check if the menu is closed. If that's the case, we should show it.
    if(!$(this).data("state") || $(this).data("state") == 0) { 
      $(this).show("slide", { direction: "up" }, time);
      $(element).addClass("active");

      // Update the current state.
      $(this).data("state", 1);
    // Menu is visible, so let's close it.
    } else if ($(this).data("state") == 1) { 
      $(this).hide();
      $(element).removeClass("active");
      
      // Update the state.
      $(this).data("state", 0);
    }
  }

});

// Make sure the document is loaded and jQuery is available.
$(document).ready(function() {

  // Events handlers are placed here.

    // When you click anywhere on the document, execute the following code.
    $(document).click(function() {
      // Make sure that all dropdowns are closed.
       $(".menu").each(function() {
         $(this).hide().parent().removeClass("active");
       });
    });

    // When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
    $("li[role=tab]:not(.application)").click(function() {
      $(this).EnableTabContents();
    });

    // When you click on an icon execute the code below.
    $(".icon").click(function(e) {

      // When the icon holds a menu, show the menu.
      if ($(this).children(".menu").length > 0) {

        $(".menu").each(function() {
          // Hide the element and update the state.
          $(this).hide().parent().removeClass("active");
          $(this).data("state", 0);
        });

        e.stopPropagation();

        $(".menu", this).EnableMenu(50, $(this));
      }
    });
});