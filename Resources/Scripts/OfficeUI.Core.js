// Extend the jQuery FN so that new methods can be called.
// Those new methods are needed in the API.
jQuery.fn.extend({

    // This must be applied to a form (or an object inside a form).
    addHidden: function (name, value) {
        return this.each(function () {
            var input = $("<input>").attr("type", "hidden").attr("name", name).val(value);
            $(this).append($(input));
        });
    },

    // Gets the value of the id attribute of the called element.
    // Returns:
    //    A string that matches the id of the element.
    Id: function () {
        return $(this).attr('id');
    },

    // Activates the element on which this function is called by adding the class "active" on it.
    Activate: function () {
        $(this).addClass("active");
    },

    // Deactivate the element on which this function is called by removing the class "active" from it.
    Deactivate: function () {
        $(this).removeClass("active");
    },

    // Checks if the element holds a menu.
    HoldsMenu: function () {
        return ($(this).children(".menu").length > 0);
    },

    // Log a message when an element is not found.
    // Parameters:
    //    message:    The message to write to the console.
    // Returns:
    //    True if the object has been found, otherwise false.
    LogWhenNotFound: function (message) {
        if ($(this).length == 0) {
            console.log('%c' + message, 'color: red;');

            return false;
        }

        return true;
    }
});

var OfficeUICore = {

    Init: function () {
        var windowHeight = $(window).height();
        $("#main_contents_area").height(windowHeight - 189);
    }
}

// Initialize the application.
OfficeUICore.Init();

// Make sure that some re-initialization is done everytime the window is resized.
$(window).resize(function() {
    OfficeUICore.Init();
});