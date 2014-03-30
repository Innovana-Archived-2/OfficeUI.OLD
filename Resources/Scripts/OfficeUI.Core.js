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
  EnableMenu: function(time) {
      $(this).slideDown({
        duration: time
      });
  }

});

// Make sure the document is loaded and jQuery is available.
$(document).ready(function() {

  // Events handlers are placed here.

    // When you click anywhere on the document, execute the following code.
    $(document).click(function() {
      // Make sure that all dropdowns are closed and that the toggle state is updated.
        $(".menu").each(function() {
          $(this).hide();
        });
    });

    // When you click on a tab element (not the first element, since that's the application), make sure the contents are coming available.
    $("li[role=tab]:not(.application)").click(function() {
      $(this).EnableTabContents();
    });

    // When you click on an icon execute the code below.
    $(".icon").click(function(e) {

      // When the icon holds a menu, show the mnu.
      if ($(this).children(".menu").length > 0) {
        e.stopPropagation();

        $(".menu", this).EnableMenu(75);
      }
    });
});