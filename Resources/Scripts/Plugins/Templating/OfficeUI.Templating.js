// Section: Common Regex variables. 

var emptyLinesRegex = /(<!--)(.)*(-->)/g; // Defines a regex that is used to remove the comments from a template.

var importsRegex = /({{TMPL:Import=).*;( Name=).*}}/g; // Defines a regex that is used to get the imports in a template.
var importTemplateRegex = /(Import=).*;/g // Provides a way to find the template of a template import.
var nameTemplateRegex = /(Name=).*(}})/g // Provides a way to find the name of an included template.

var renderRegex = /({{Render:).*(}})/g // Provides a way to find the sections that needs to be rendered.
var renderNameRegex = /(:).*(;)/g // Provides a way to find the section that needs to be rendered.
var renderObjectRegex = /(=).*(}})/g // Provides a way to find the object to pass to this renderer.

var sequenceRegex = /({{BOS:Sequence}})[.]*?[\s\S]*?({{EOS:Sequence}})/g // Provides a way to detect sequences within a template.

var replaceWithObjectRegex = /({{)(?!TMPL|[BE]OS|Render).*?(}})/g // Provides a way to find an area where a replacement should be done.

// End of section: Common regex variables.

// Defines the namespace which is used for the OfficeUI Templating system.
var OfficeUITemplating = {

	// Loads up a given template.
	// Parameters:
	//		template: 				The contents that define the template.
	//		data: 					The data which the template will be using to render it.
	LoadTemplate: function(template, data) {
		// Load the template in a variable.
		var loadedTemplate = template;

		// Provide the logic for the templates.
		loadedTemplate = OfficeUITemplating.RemoveComments(loadedTemplate);

		var renderedTemplate = OfficeUITemplating.Process(loadedTemplate, data);

		// Return the loaded template object.
		return renderedTemplate;
	},

	// Remove all the comments (<!-- -->) which might be in the template.
	// Parameters:
	//		data: 				The template itself for which the comments needs to be removed.
	RemoveComments: function(data) {
		return data.replace(emptyLinesRegex, "");
	},

	// Get all the imports that belongs to the template.
	// Parameters:
	//		data: 				The template itself which needs to be processed.
	//		templateData: 		The data which is used to render the template.
	Process: function(data, templateData) {
		var imports = data.match(importsRegex); // Get all the imports for this template.
		var sequences = data.match(sequenceRegex); // Get all the sequences which are in the template.
		var renders;
		var replaces;

		var importedTemplates = []; // Defines all the templates that are required.
		var requiredRenders = []; // Defines all the render sections that are required.

		// Loop over all the imports that are included in this template.
		$(imports).each(function(index, template) {
			var requiredTemplate = { TemplateName: "", Name: "" }; // Defines the object that will holds a template.

			requiredTemplate.TemplateName = template.match(importTemplateRegex)[0].replace(/Import=/g, "").replace(/;/g, ""); // Gets the name of the template.
			requiredTemplate.Name = template.match(nameTemplateRegex)[0].replace(/(Name=)/g, "").replace(/(}})/g, ""); // Gets the value of the template.

			importedTemplates.push(requiredTemplate); // Push the template up onto the array.
		});

		// Check if we have sequences specified in our template.
		// It's important to render the sequences first.
		if (sequences != null) {
			var renderedDataForSequence = "";

			// Loop over all the sequences.
			$(sequences).each(function(index, sequence) {
				var sequenceDataTemplate = sequence.replace(/({{BOS:Sequence}})/g, "").replace(/({{EOS:Sequence}})/g, ""); // Defines the template of the sequence.
				var renderedSequenceData = ""; // Defines the fully rendered sequence.

				renders = data.match(renderRegex); // Get all the renders for this template.
				replaces = data.match(replaceWithObjectRegex); // Get all the areas where something needs to be replaced.

				// Loop over the amount of items which are stored in the data as this defines how much time the sequence should be repeated.
				$(templateData).each(function(index, sequenceData) {
					
					var tempRenderedData = sequenceDataTemplate;

					// Replace all the parameters that can be replaced.
					$(replaces).each(function(index, replace) {
						var replaceAttribute = replace.replace(/({{)/g, "").replace(/(}})/g, "");
						tempRenderedData = tempRenderedData.replace(replace, sequenceData[replaceAttribute]);
					});

					// Here we need to render the render actions for the sequence.
					$(renders).each(function(index, render) {
						var requiredRender = { RenderName: "", RenderObject: "" }; // Defines the object that will hold all the renderers.
						
						requiredRender.RenderName = render.match(renderNameRegex)[0].replace(/(:)/g, "").replace(/(;)/g, "");
						requiredRender.RenderObject = render.match(renderObjectRegex)[0].replace(/(=")/g, "").replace(/("}})/g, "");;

						requiredRenders.push(requiredRender); // Push the rendered onto the array.
					});

					// Validate if for each render section, an import has been defined.
					$(requiredRenders).each(function(index, render) {
						var foundTemplate = jQuery.grep(importedTemplates, function(template) {
							return template.Name == render.RenderName
						});

						// When no import statement has been found for a render section, write an error message to the log.
						if (foundTemplate == ""){
							console.log("%c The render section with name '" + render + "' does not correspond with a given import statement. Are you missing an import statement?", "color: red;");
						}
					});

					// Load in all the templates that are defined through an import statement in this template.
					$(requiredRenders).each(function(index, renderer) {
						var matchingTemplate = ""; // Define the template that needs to be used for the renderer.

						jQuery.grep(importedTemplates, function(template) {
							if (template.Name == renderer.RenderName) {
								matchingTemplate = template;
							}
						});

						var requiredTemplateData = sequenceData[renderer.RenderObject]; // Creates the data that is required for the template.
						var rendered = OfficeUITemplating.LoadChildTemplate(matchingTemplate.TemplateName, requiredTemplateData); // Get the rendered data of the template.

						// Now we need to replace the render section with the contents retrieved.
						tempRenderedData = tempRenderedData.replace(/({{Render:).*(}})/g, rendered);
					});


					// The render of an element of the sequence has been completed so add it to the output.
					renderedSequenceData += tempRenderedData;
				});

				data = data.replace(sequence, renderedSequenceData);
			});
		}

		renders = data.match(renderRegex); // Get all the renders for this template.
		replaces = data.match(replaceWithObjectRegex); // Get all the areas where something needs to be replaced.

		// Loop over all the defined renders in the template.
		$(renders).each(function(index, render) {
			var requiredRender = { RenderName: "", RenderObject: "" }; // Defines the object that will hold all the renderers.
			
			requiredRender.RenderName = render.match(renderNameRegex)[0].replace(/(:)/g, "").replace(/(;)/g, "");
			requiredRender.RenderObject = render.match(renderObjectRegex)[0].replace(/(=")/g, "").replace(/("}})/g, "");;

			requiredRenders.push(requiredRender); // Push the rendered onto the array.
		});

		// Validate if for each render section, an import has been defined.
		$(requiredRenders).each(function(index, render) {
			var foundTemplate = jQuery.grep(importedTemplates, function(template) {
				return template.Name == render.RenderName
			});

			// When no import statement has been found for a render section, write an error message to the log.
			if (foundTemplate == ""){
				console.log("%c The render section with name '" + render + "' does not correspond with a given import statement. Are you missing an import statement?", "color: red;");
			}
		});

		// Replace all the parameters that can be replaced.
		$(replaces).each(function(index, replace) {
			var replaceAttribute = replace.replace(/({{)/g, "").replace(/(}})/g, "");
			data = data.replace(replace, templateData[replaceAttribute]);
		});

		// Remove the imports statements since it's not needed in the rendering of the template.
		data = data.replace(importsRegex, "");

		// Load in all the templates that are defined through an import statement in this template.
		$(requiredRenders).each(function(index, renderer) {
			var matchingTemplate = ""; // Define the template that needs to be used for the renderer.

			jQuery.grep(importedTemplates, function(template) {
				if (template.Name == renderer.RenderName) {
					matchingTemplate = template;
				}
			});

			var requiredTemplateData = templateData[renderer.RenderObject]; // Creates the data that is required for the template.
			var rendered = OfficeUITemplating.LoadChildTemplate(matchingTemplate.TemplateName, requiredTemplateData); // Get the rendered data of the template.

			// Now we need to replace the render section with the contents retrieved.
			data = data.replace(/({{Render:).*(}})/g, rendered);
		});

		return data;
	},

	// Load a template by specifying it's location.
	// Parameters:
	//		template: 			The location where to load the template from.
	//		data: 				The data to render in the template.
	LoadChildTemplate: function(template, data) {
		var renderedTemplate = "";

		// Get the template to build the ribbon.
        $.ajax({
        	async: false,
            dataType: "text",
            url: template,
            success: function(loadedTemplate) {
                // I need to pass this data to the templating engine at first.
                renderedTemplate = OfficeUITemplating.LoadTemplate(loadedTemplate, data);
            },

            // When there's an error while consuming the Json, render it here.
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });

        return renderedTemplate; // Return the data which has been templated.
	}
}

