// Makes a grid out of an element.
$.fn.Grid = function(options) { 
    // Specify the default options for the menu plugin.
    var options = $.extend({
        OnSelectedRow: null,
        OnDoubleClick: null
    }, options);

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
        }

    // End of Section: Functions.


    // Section: Event Handlers.

        var selectedItem = null;

        // If an action is specified to execute when you select a row, that execute the function stored in the 'OnSelectedRow'.
        if (options.OnSelectedRow != null) {
            $(".row").on("click contextmenu", function (e) {
                // Inside a grid, the id of the selected row is always in the first element.
                // The type of the selected row is always stored in the 2nd hidden field.
                var selectedRowId = $(":hidden", this).eq(0).val();
                var selectedType = $(":hidden", this).eq(1).val();

                options.OnSelectedRow(selectedRowId, selectedType);
            });
        }

        // If an double click is defined, execute the action.
        if (options.OnDoubleClick != null) {
            $(".row").on("dblclick", function (e) {
                // Inside a grid, the id of the selected row is always in the first element.
                // The type of the selected row is always stored in the 2nd hidden field.
                var selectedRowId = $(":hidden", this).eq(0).val();
                var selectedType = $(":hidden", this).eq(1).val();

                if (selectedType == "folder") {
                    options.OnDoubleClick(selectedRowId, selectedType);
                } else {
                    options.OnDoubleClick(selectedRowId, selectedType);
                }
            });
        }

        // Selects the correct row when we click on the row.
        $(".row").on("click contextmenu", function(e) {
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
        //      rowIndex:       The index of the row that should be activated.
        function Select(rowIndex) {
            $("> div", object).each(function(index) {
                if ((index - 1) == rowIndex) {
                    $(this).addClass("selected");
                }
            });
        }

    // End of Section: API Creation.
}