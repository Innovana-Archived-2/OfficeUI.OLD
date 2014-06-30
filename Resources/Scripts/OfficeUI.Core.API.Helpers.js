// Extend the jQuery FN so that new methods can be called.
// Those new methods are needed in the API.
jQuery.fn.extend({
  
  // Gets the value of the id attribute of the called element.
  // Returns:
  //    A string that matches the id of the element.
  Id: function() {
    return $(this).attr('id');
  },

  // Activates the element on which this function is called by adding the class "active" on it.
  Activate: function() {
    $(this).addClass("active");
  },

  // Deactivate the element on which this function is called by removing the class "active" from it.
  Deactivate: function() {
    $(this).removeClass("active");
  },

  // Enable the element on which this function is called by removing the class "disabled" from it.
  Enable: function() {
    $(this).removeClass("OfficeUI_disabled");
  },

  // Disable the element on which this function is called by adding the class "disabled" on it.
  Disable: function() {
    $(this).addClass("OfficeUI_disabled");
  },

  // Enables an anchor element by removing the "click" event handler.
  EnableAnchor: function() {
    $(this).unbind("click");
  },

  DisableAnchor: function() {
    $(this).on("click", function(e) {
      e.preventDefalut();
      return false;
    })
  },

  // Checks if the element holds a menu.
  HoldsMenu: function() {
    return ($(this).children(".menu").length > 0);
  },

  // Log a message when an element is not found.
  // Parameters:
  //    message:    The message to write to the console.
  // Returns:
  //    True if the object has been found, otherwise false.
  LogWhenNotFound: function(message) {
    if ($(this).length == 0) {
      console.log(message);

      return false;
    }

    return true;
  },

  // Flash a section of the page with a given time.
  // Parameters:
  //    Time:     The time of a single flash in the application. In total, there are 4 flashes.
  //    Callback: A function that should be called after the flash animation is totally completed (this means after the 4 flashes).
  Flash: function(time, callback)
  {
    $(this).animate({
          backgroundColor: "#75B3E0"
    }, time);

    $(this).animate({
          backgroundColor: "#0072C6"
    }, time);

    $(this).animate({
          backgroundColor: "#75B3E0"
    }, time);

    $(this).animate({
          backgroundColor: "#0072C6"
    }, time, function() {
        callback();
    });
  }
});

// Provides internal helpers for the OfficeUICoreAPI functions.
var OfficeUICoreHelpers = {

  // Enables a given tab, based on the id of the tab.
  // Parameters: 
  //    tabId:    The id of the tab that should be showed.
  ActivateTab: function(tabId) {
    $("#" + tabId).Activate();
    $(".contents", $("#" + tabId)).Activate();
  },

  // Deactivates a given tab, based on the id of the tab.
  // Parameters: 
  //    tabId:    The id of the tab element that should be deactivated.
  DeactivateTab: function(tabId) {
    $("#" + tabId).Deactivate();
    $(".contents", $("#" + tabId)).Deactivate();
  },

  // Deactivates all the tab elements which are on the page.
  DeactivateAllTabs: function() {
    $("li[role=tab]").each(function(index) {
      OfficeUICoreHelpers.DeactivateTab($(this).Id());
    });
  },

  // Checks if a ribbon action is an icon.
  // Parameters: 
  //    ribbonAction:     The action of the ribbon for which to test.
  // Returns:
  //    True if the ribbon action is an icon, otherwise false.
  IsRibbonActionAnIcon: function(ribbonAction) {
    if ($(ribbonAction).parent().attr("class").indexOf("icon") > -1) {
      return true;
    }

    return false;
  },

  // Enables a ribbon action.
  // Parameters: 
  //    ribbonAction:     The element that needs to be enabled.
  EnableRibbonAction: function(ribbonAction) {
    $(ribbonAction).parent().Enable();
    $(ribbonAction).closest("a").EnableAnchor();
  },

  // Disables a ribbon action.
  // Parameters: 
  //    ribbonAction:     The element that needs to be disabled.
  DisableRibbonAction: function(ribbonAction) {
    $(ribbonAction).parent().Disable();
    $(ribbonAction).closest("a").DisableAnchor();
  }
}