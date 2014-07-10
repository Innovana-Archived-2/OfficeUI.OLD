// Makes a grid out of an element.
$.fn.Grid = function(options) { 
	// Specify the default options for the menu plugin.
	var options = $.extend({});

	// Get the object on which this is called.
    var object = $(this);

    // Initialize the ribbon.
    Initialize();

    // Section: Functions.
	    
	    // Initialize the whole grid. This is done by placing classes on the various elements that together form the grid.
    	// This is done to keep the HTML less cluthered.
	    function Initialize() {
	    	$(object).addClass("gridHolder OfficeUI_v-scroll");
	    	$("> div:first-child", object).addClass("header");
	    	$("> div:not(:first-child)", object).addClass("row");

	    	// Loop over all the columns in each row.
	    	$("> div div", object).each(function(index) {
				
				// Mark all the elements in a row as inline.
				$(this).addClass("OfficeUI_inline");

				// Make sure to keep the 2 first elements in the grid on the left side and all the other ones on the right side.
				if ($(this).index() != 0 && $(this).index() != 1)
				{ $(this).addClass("fixed OfficeUI_right");}
	    	});

	    	// Selected the first row in the index.
	    	CreateGridAPI().Select(0);
	    }

	// End of Section: Functions.


    // Section: Event Handlers.

        // Selects the correct row when we click on the row.
        $(".row").on("click", function(e) {
            // Remove the 'selected' class from all the entries in the grid.
            $("> div", object).each(function(index) {
                $(this).removeClass("selected");
            });

            // Add's the 'selected' class on the row that we've selected.
            $(this).addClass("selected");       
        });

    // End of Section: Event Handlers.


	// Section: API Creation.

        // Create an API and return that one.
        return CreateGridAPI();

        // Creates the ribbon API.
        function CreateGridAPI() {
            return {
                Select: Select
            }
        }

        // Selects a given row based on it's index. Since we're selecting index-based, it means that the first row will have index 0.
        // Parameters:
        //		rowIndex: 		The index of the row that should be activated.
        function Select(rowIndex) {
        	$("> div", object).each(function(index) {
        		if ((index - 1) == rowIndex) {
        			$(this).addClass("selected");
        		}
        	});
        }

    // End of Section: API Creation.
}