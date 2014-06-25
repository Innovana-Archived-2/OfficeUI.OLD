// Extend the jQuery FN so that new methods can be called.
// Those new methods are needed in the API.
jQuery.fn.extend({
  
  // Activates the element on which this function is called by adding the class "active" on it.
  Activate: function() {
    $(this).addClass("active");
  },

  // Deactivate the element on which this function is called by removing the class "active" from it.
  Decativate: function() {
    $(this).removeClass("active");
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
    $("#" + tabId).Decativate();
    $(".contents", $("#" + tabId)).Decativate();
  }
}

// Defines the API that can be used to perform some actions ont he OfficeWebControls.
var OfficeUICoreAPI = {

  // Enables a given tab, based on the id of the tab.
  // Parameters: 
  //    tabId:    The id of the tab that should be showed.
  EnableTab: function(tabId) {

    // Chech if the tab with the id can be found and if not, write a message to the log.
    if ($("#" + tabId).LogWhenNotFound("Tab with id '" + tabId + "' not found."))
    {   
      // Start by deactiving every tab element on the page.
      $("li[role=tab]").each(function(index) {
        OfficeUICoreHelpers.DeactivateTab($(this).attr("id"))
      });

      // Marks the tab as the active one and display the contents for the tab.
      OfficeUICoreHelpers.ActivateTab(tabId);
    }
  },

  // Enables a given tab, based on the index of the tab.
  // Remarks: 
  //      The index starts at 0. The element at position 0 is the first tab which is not the application tab.
  // Parameters:
  //      tabIndex:     The index of the tab (0-based). See remarks for more information.
  EnableTabIndex : function(tabIndex) {
    // Gets the tab, based on the index.
    var tabToEnable = $("li[role=tab]:not(.application):eq(" + tabIndex + ")");

    // Enables the tab.
    OfficeUICoreAPI.EnableTab($(tabToEnable));
  }, 

  // Enables a given icon on the ribbon.
  // Parameters:
  //    ribbonActionId:     The id of the image that holds the action that you want to enable.
  EnableRibbonAction: function(ribbonActionId) {
    if ($("#" + ribbonActionId).length == 0) { 
      console.log("Element with id '" + ribbonActionId + "' not found.");
    } else if ($("#" + ribbonActionId).parent().attr("class").indexOf("icon") > -1) {
      $("#" + ribbonActionId).parent().removeClass("disabled");
      $("#" + ribbonActionId).closest("a").unbind("click");
    } else {
      console.log("The function 'DisableRibbonIcon' is only supported on icons.");
    }
  },

  // Disables a given icon on the ribbon.
  // Parameters:
  //    ribbonActionId:     The id of the image that holds the action that you want to disable.
  DisableRibbonAction: function(ribbonActionId) {
    if ($("#" + ribbonActionId).length == 0) { 
      console.log("Element with id '" + ribbonActionId + "' not found.");
    } else if ($("#" + ribbonActionId).parent().attr("class").indexOf("icon") > -1) {
      $("#" + ribbonActionId).parent().addClass("disabled");
      $("#" + ribbonActionId).closest("a").on("click", function(e) {
        e.preventDefault();
        return false;
      })
    } else {
      console.log("The function 'DisableRibbonIcon' is only supported on icons.");
    }
  }
}