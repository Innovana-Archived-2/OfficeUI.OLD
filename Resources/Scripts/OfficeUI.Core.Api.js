// OffficeWebControls API.
//    Created by: Kevin De Coninck.
//    Version: 1.0
//    Release date: 26/06/2014
//
// The OfficeWebControls API contains a set of functions that makes it very easy to work with all the different elements which are included in the OfficeWebControls.
// The following functions are provided:
//    - EnableTab:              Enables a given tab by it's id.
//    - EnableTabIndex:         Enables a given tab by it's index.
//    - EnableRibbonAction:     Enables a specific action on the ribbon by it's id.
//    - DisableRibbonAction:    Disables a specific action on the ribbon by it's id.


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
      OfficeUICoreHelpers.DeactivateAllTabs();

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
    OfficeUICoreAPI.EnableTab($(tabToEnable).attr('id'));
  }, 

  // Enables a given icon on the ribbon.
  // Parameters:
  //    ribbonActionId:     The id of the image that holds the action that you want to enable.
  EnableRibbonAction: function(ribbonActionId) {
    var ribbonElement = $("#" + ribbonActionId);
    if ($(ribbonElement).LogWhenNotFound("Element with id '" + ribbonActionId + "' not found.")) {
      if (OfficeUICoreHelpers.IsRibbonActionAnIcon($(ribbonElement))) {
        OfficeUICoreHelpers.EnableRibbonAction($(ribbonElement));
      } else {
        console.log("The function 'EnableRibbonIcon' is only supported on icons.");
      }
    }
  },

  // Disables a given icon on the ribbon.
  // Parameters:
  //    ribbonActionId:     The id of the image that holds the action that you want to disable.
  DisableRibbonAction: function(ribbonActionId) {
    var ribbonElement = $("#" + ribbonActionId);
    if ($(ribbonElement).LogWhenNotFound("Element with id '" + ribbonActionId + "' not found.")) {
      if (OfficeUICoreHelpers.IsRibbonActionAnIcon($(ribbonElement))) {
        OfficeUICoreHelpers.DisableRibbonAction($(ribbonElement));
      } else {
        console.log("The function 'DisableRibbonIcon' is only supported on icons.");
      }
    }
  },

  // Disable a menu entry.
  // Parameters:
  //    menuEntryId:    The id of the menu entry that should be disabled.
  DisableMenuEntry: function(menuEntryId) {
    var menuEntryElement = $("#" + menuEntryId);
    if ($(menuEntryElement).LogWhenNotFound("Element with id '" + menuEntryId + "' not found.")) {
      $(menuEntryElement).Disable();
    }
  },

  // Sends a notification to the user by showing it in the statusbar of the application.
  // Parameters:
  //    message:      The message that you want to send to the user.
  //    options:      The options than can be specified for this function.
  //                  When not specified, the defaults are used (see NotifyDefault variable).
  // Remarks:
  //    The options have various parameters which are listed below:
  //    - Time: The time that a single animation will take. The notify will have 4 animations (fade-out, fade-in, fade-out and fade-in again).
  //    - Flash: A boolean that indicates if a flash needs to occur.
  //             Set to true to get attention of the user.
  //             Set to false when you just want to change the text, without notifying the user.
  //    - OnComplete: An event which is executed when the animation is completed.
  Notify: function(message, options) {
    // Sets the options to the default ones when not specified.
    options = $.extend({}, NotifyDefault, options);

    $("#notificationArea").html(message);
    if (options.Flash) { 
      $("#notificationArea").Flash(options.Time, options.OnComplete);
    }
  },

  NotifyAlert: function(message, options) {
    // Sets the options to the default ones when not specified.
    options = $.extend({}, NotifyDefault, options);

    $("#notificationArea").html(message);
    if (options.Flash) { 
      $("#notificationArea").FlashAsError(options.Time, options.OnComplete);
    }
  }
}

// Section: Needed variables for the functions in the API.

  // Default options that are used when notifying a user through the 'Notify(message, options)' function.
  var NotifyDefault = {
    Time: 75,
    Flash: true,
    OnComplete: function() { }
  }

// End - Section: Needed variables for the functions in the API.