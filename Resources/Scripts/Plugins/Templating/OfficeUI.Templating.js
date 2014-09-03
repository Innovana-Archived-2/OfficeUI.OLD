/*
	OfficeUI Templating Engine.

	Created by: Kevin De Coninck


	Description:

			The OfficeUI templating engine allows us to write templates that contains plain HTML and a simplified syntax for rending properties of an object.

	Specific features list:

			- 	The templates are loaded through an AJAX call and saved in memory, but only on the first request.
				After that, the templates are loaded from the memory.

	Features:

			- 	Variables: 			Include some variables in your template (with a specific syntax) and they are automatticly replaced at runtime.
			-	Linked templates:	Links various files to one big template.
			-	Sequences: 			Create a self-repeating sequence in the template.
*/

// Section: Common Regex variables. 

var emptyLinesRegex = /(<!--)(.)*(-->)/g; // Defines a regex that is used to remove the comments from a template.

var importsRegex = /({{TMPL:Import=).*;( Name=).*}}/g; // Defines a regex that is used to get the imports in a template.
var importTemplateRegex = /(Import=).*;/g // Provides a way to find the template of a template import.
var nameTemplateRegex = /(Name=).*(}})/g // Provides a way to find the name of an included template.

var renderRegex = /({{Render:).*(}})/g // Provides a way to find the sections that needs to be rendered.
var renderNameRegex = /(:).*(;)/g // Provides a way to find the section that needs to be rendered.
var renderObjectRegex = /(=).*(}})/g // Provides a way to find the object to pass to this renderer.

var sequenceRegex = /({{BOS:Sequence}})[.]*?[\s\S]*?({{EOS:Sequence}})/g // Provides a way to detect sequences within a template.

var replaceWithObjectRegex = /({{)(?!TMPL|If|EndIf|[BE]OS|Render).*?(}})/g // Provides a way to find an area where a replacement should be done.

var loadedTemplates = []; // A variables that holds all the templates which has been loaded by the template engine.
						  // That way, we can load templates out of this variable, instead of doing posts all the time to render it.

// End of section: Common regex variables.

// Defines the namespace which is used for the OfficeUI Templating system.
var OfficeUITemplating = {

	// Loads up a given template.
	// Parameters:
	//		template: 				The contents that define the template.
	//		data: 					The data which the template will be using to render it.
	//		name: 					The name of the template which is being loaded.
	LoadTemplate: function(name, template, data) {

		console.log("[OfficeUI Templating]: The template with name '" + name + "' is being executed.");	

		// Load the template in a variable.
		var loadedTemplate = template;

		// Provide the logic for the templates.
		loadedTemplate = OfficeUITemplating.RemoveComments(loadedTemplate);

		var renderedTemplate = OfficeUITemplating.Process(loadedTemplate, data);

		console.log("[OfficeUI Templating]: The template with name '" + name + "' has been executed.");	

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
		var importStatements = data.match(importsRegex); // Get all the imports for this template.
		var sequenceStatements = data.match(sequenceRegex); // Get all the sequences which are in the template.
		var renderStatements; // Get all the renderers which are in the template.
		var replacesStatements; // Get all the areas where a replacements must be done.

		var importedTemplates = []; // Defines all the templates that are required.
		var requiredRenders = []; // Defines all the render sections that are required.

		importedTemplates = OfficeUITemplating.GetAllImports(importStatements); // Create object from every import statement which can be found in the template.

		// Remove the imports statements since it's not needed in the rendering of the template.
		data = data.replace(importsRegex, "");

		// Check if we have sequences specified in our template.
		// It's important to render the sequences first.
		if (sequenceStatements != null) {
			console.log("[OfficeUI Templating]: One or more sequences have been found in the template. Executing the sequences.");

			var renderedDataForSequence = "";

			// Loop over all the sequences.
			$(sequenceStatements).each(function(index, sequence) {
				console.log("[OfficeUI Templating]: Sequence processing have been started.");

				var sequenceDataTemplate = sequence.replace(/({{BOS:Sequence}})/g, "").replace(/({{EOS:Sequence}})/g, ""); // Defines the template of the sequence.
				var renderedSequenceData = ""; // Defines the fully rendered sequence.

				renderStatements = data.match(renderRegex); // Get all the renders for this template.
				replacesStatements = data.match(replaceWithObjectRegex); // Get all the areas where something needs to be replaced.

				// When we render a section, the data passed to the template would be an array that contains all the data in the sequence.
				// So we'll loop over this array right now, since the amount of items that are defined in the array tells us how many times the sequence needs to be repeated.
				$(templateData).each(function(index, sequenceData) {

					var tempRenderedData = sequenceDataTemplate; // Create a temporary object that is a copy of the sequence template. This way a new section can be created.

					// Replace all the parameters that can be replaced.
					console.log("[OfficeUI Templating]: Replace the placeholders with data from objects.");
					$(replacesStatements).each(function(index, replace) {
						tempRenderedData = OfficeUITemplating.ReplacePlaceholdersWithObject(replace, sequenceData, tempRenderedData);
					});

					// Process the if statements.
					OfficeUITemplating.ProcessIfStatements(tempRenderedData);

					// Here we need to render the render actions for the sequence.
					$(renderStatements).each(function(index, render) {
						requiredRenders = OfficeUITemplating.GetAllRenderers(renderStatements);
					});

					// Validate if for each render section, an import has been defined.
					$(requiredRenders).each(function(index, render) {
						OfficeUITemplating.ValidateRenderSections(importedTemplates, render);
					});

					// Load in all the templates that are defined through an import statement in this template.
					$(requiredRenders).each(function(index, renderer) {
						tempRenderedData = OfficeUITemplating.ReplaceRenderSectionWithData(importedTemplates, renderer, sequenceData, tempRenderedData);
					});

					// The render of an element of the sequence has been completed so add it to the output.
					renderedSequenceData += tempRenderedData;
				});

				data = data.replace(sequence, renderedSequenceData);

				console.log("[OfficeUI Templating]: Sequence processing has been finished..");
			});

			console.log("[OfficeUI Templating]: All the sequences has been processed.");
		}

		renderStatements = data.match(renderRegex); // Get all the renders for this template.
		replacesStatements = data.match(replaceWithObjectRegex); // Get all the areas where something needs to be replaced.
		requiredRenders = OfficeUITemplating.GetAllRenderers(renderStatements); // Create objects from every render statement which can be found in the template.

		// Validate if for each render section, an import has been defined.
		$(requiredRenders).each(function(index, render) {
			OfficeUITemplating.ValidateRenderSections(importedTemplates, render);
		});

		// Processing the if statements which are in a template.
		data = OfficeUITemplating.ProcessIfStatements(data);

		// Replace all the parameters that can be replaced.
		console.log("[OfficeUI Templating]: Replace the placeholders with data from objects.");
		$(replacesStatements).each(function(index, replace) {
			data = OfficeUITemplating.ReplacePlaceholdersWithObject(replace, templateData, data);
		});

		// Load in all the templates that are defined through an import statement in this template.
		$(requiredRenders).each(function(index, renderer) {
			data = OfficeUITemplating.ReplaceRenderSectionWithData(importedTemplates, renderer, templateData, data);
		});

		return data;
	},

	// Process all the if statements that are placed in a template.
	// Parameters:
	//		renderedData: 				The current html which is rendered.
	ProcessIfStatements: function(renderedData) {
		// Get the code which is stored between the If statements.
		var ifStatementRegex = /({{If ).*(}})/g; // Defines the regex that can get the conditional expression out of a template.
		var completeConditionRegexBAK = /({{If)[.]*?[\s\S]*?({{EndIf}})/g; // Defines the regex that can get a complete regular expression out of a template.
		var completeConditionRegex = /({{If).*[\s\S]*({{EndIf}})/g;

		var allTemplateConditions = renderedData.match(completeConditionRegex);

		if (renderedData.match(completeConditionRegex) != null) {
			console.log("[OfficeUI Templating]: Processing if statements.");
		}

		$(allTemplateConditions).each(function(index, completeCondition) {

			// Get the condition itself.
			var ifStatementCondition = completeCondition.match(ifStatementRegex)[0];
			var condition = ifStatementCondition.replace(/({{If )/g, "").replace(/(}})/g, "");

			// If the condition does not match, remove the entire section about the condition.
			if (!eval(condition)) {
				console.log("[OfficeUI Templating]: The if statement '" + condition + "' does not match. Skipping this.");

				// Remove the first occurence, since we're capturing this.
				renderedData = renderedData.replace(/({{If)[.]*?[\s\S]*?({{EndIf}})/ ,"");
			} else {
				console.log("[OfficeUI Templating]: The condition '" + condition + "' did match. Rendering the condition.");

				renderedData = renderedData.replace(/({{If ).*(}})/, "").replace(/({{EndIf}})/, "");
			}
		});

		// Check if there is a match for another if statement in this template.
		// If this is not the case, the rendered data is returned.
		if (renderedData.match(ifStatementRegex) == null) {
			return renderedData;
		}

		// If there are still unprocessed if statements, process them.
		if (renderedData.match(ifStatementRegex).length > 0) {
			renderedData = OfficeUITemplating.ProcessIfStatements(renderedData);
		}

		if (renderedData.match(completeConditionRegex) != null) {
			console.log("[OfficeUI Templating]: All the if statements for this template have been processed.");
		}

		return renderedData;
	},

	// Get all the imports that are defined on a template.
	// Parameters:
	// 		importStatemenets: 	The statement in which the import is defined.
	GetAllImports: function(importStatements) {
		console.log("[OfficeUI Templating]: Retrieving the import statements.");

		var importedTemplates = []; // Defines all the templates that are required.

		$(importStatements).each(function(index, template) {
			var requiredTemplate = { TemplateName: "", Name: "" }; // Defines the object that will holds a template.

			requiredTemplate.TemplateName = template.match(importTemplateRegex)[0].replace(/Import=/g, "").replace(/;/g, ""); // Gets the name of the template.
			requiredTemplate.Name = template.match(nameTemplateRegex)[0].replace(/(Name=)/g, "").replace(/(}})/g, ""); // Gets the value of the template.

			importedTemplates.push(requiredTemplate); // Push the template up onto the array.
		});

		return importedTemplates;
	},

	// Get all the render sections that are defined on a template.
	// Parameters:
	// 		renderStatements: 	The statement in which the render is defined.
	GetAllRenderers: function(renderStatements)
	{
		console.log("[OfficeUI Templating]: Get all the render sections in the template.");

		var requiredRenders = []; // Defines all the render sections that are required.

				// Loop over all the defined renders in the template.
		$(renderStatements).each(function(index, render) {
			var requiredRender = { RenderName: "", RenderObject: "" }; // Defines the object that will hold all the renderers.
			
			requiredRender.RenderName = render.match(renderNameRegex)[0].replace(/(:)/g, "").replace(/(;)/g, "");
			requiredRender.RenderObject = render.match(renderObjectRegex)[0].replace(/(=")/g, "").replace(/("}})/g, "");;

			requiredRenders.push(requiredRender); // Push the rendered onto the array.
		});

		return requiredRenders;
	},

	// Validates is each renderer can render itself.
	// This can be validated with the imports. The section to render must match an import statement.
	// Parameters: 
	//		importedTemplates: 	All the templates which are imported.
	//		rendered: 			The renderer that is going to be validated.
	ValidateRenderSections: function(importedTemplates, renderer) {
		console.log("[OfficeUI Templating]: Validating the render statement.");

		var foundTemplate = jQuery.grep(importedTemplates, function(template) {
			return template.Name == renderer.RenderName
		});

		// When no import statement has been found for a render section, write an error message to the log.
		if (foundTemplate == ""){
			console.log("%c [OfficeUI Templating]: The render section with name '" + render + "' does not correspond with a given import statement. Are you missing an import statement?", "color: red;");
		}
	},


	// Replace the render section with the data that should match the render section.
	// Parameters:
	//		importedTemplates: 	All the import statements that are defined for this template.
	//		renderer: 			The renderer that will be rendered.
	//		templateData: 		The data which is passed to the template.
	//		data: 				The current output.
	ReplaceRenderSectionWithData: function(importedTemplates, renderer, templateData, data) {
		console.log("[OfficeUI Templating]: Replacing the render section with data.");

		var matchingTemplate = ""; // Define the template that needs to be used for the renderer.

		jQuery.grep(importedTemplates, function(template) {
			if (template.Name == renderer.RenderName) {
				matchingTemplate = template;
			}
		});

		var requiredTemplateData = templateData[renderer.RenderObject]; // Creates the data that is required for the template.
		var rendered = OfficeUITemplating.LoadChildTemplate(renderer.RenderName, matchingTemplate.TemplateName, requiredTemplateData); // Get the rendered data of the template.

		// Now we need to replace the render section with the contents retrieved.
		return data.replace(/({{Render:).*(}})/g, rendered);
	},

	// Replace the placeholders {{}} which are defined in any template, with the correct object.
	// Parameters:
	//		replace: 			The replace holder that idenfied the section to replace.
	//		templateData: 		The data which has been passed to the template, and out of which the render object should be retrieved.
	//		data: 				The current output.
	ReplacePlaceholdersWithObject: function(replace, templateData, data) {
		var replaceAttribute = replace.replace(/({{)/g, "").replace(/(}})/g, "");
		var attributeRequired = false; // A boolean that indicates wether or not this attribute is required.

		// Check if the attribute is required.
		if (replaceAttribute.indexOf(":") != -1) {
			attributeRequired = true;
			replaceAttribute = replaceAttribute.replace(/Required:/g, "");
		}

		// Only try to do a replace when the object is defined, in all the other cases, write a warning to the log console and 
		// strip outs the replace from the data.
		if (templateData[replaceAttribute] != null	) {
			console.log("[OfficeUI Templating]: The placeholder '" + replaceAttribute + "' will be replaced by: '" + templateData[replaceAttribute] + "'.");

			return data.replace(replace, templateData[replaceAttribute]);
		} else {
			// If the attribute was required, write an entry in the log and return the function.
			if (attributeRequired) {
				console.log("%c [OfficeUI Templating]: The attribute '" + replaceAttribute + "' is a required attribute.", "color: red;");

				return;
			} else {
				console.log("%c [OfficeUI Templating]: The attribute '" + replaceAttribute + "' could not found.", "color: #AD8500");
			}
		}

		return data.replace(replace, "");
	},

	// Load a template by specifying it's location.
	//
	// Note:
	//
	//		Some logic has been included in the loading of the templates.
	//		When a template is being load, that template is saved in memory, which means that if we need to load the same template again (for example in a sequence), we can retrieve this 
	//		template from memory instead of doing a ajax call to retrieve this data. This will speed up the templating engine.
	//
	//
	// Parameters:
	//		template: 			The location where to load the template from.
	//		data: 				The data to render in the template.
	//		name: 				The name of the template.
	LoadChildTemplate: function(name, template, data) {
		var matchingTemplate = "";

		// First check if the template we need to load is in the list that contains all the loaded templates.
		jQuery.grep(loadedTemplates, function(loadedTemplate) {
			if (loadedTemplate["FullyQualifiedName"] == template) {
				matchingTemplate = loadedTemplate.TemplateData;
			}
		});

		var renderedTemplate = ""; // Holds the fully rendered template.

		// When the template has been found, render the template, otherwise do an ajax call first to get the template and then render it.
		if (matchingTemplate != "") { 
			renderedTemplate = OfficeUITemplating.LoadTemplate(name, matchingTemplate, data);
		} else {
			// Get the template to build the ribbon.
	        $.ajax({
	        	async: false,
	            dataType: "text",
	            url: template,
	            success: function(loadedTemplate) {
	            	// Add the template to the template collection since it has been loaded.
	            	var tempLoadedTemplate = { FullyQualifiedName: "", TemplateData: "" };
	            	tempLoadedTemplate.FullyQualifiedName = template;
	            	tempLoadedTemplate.TemplateData = loadedTemplate;

	            	loadedTemplates.push(tempLoadedTemplate);

	                // I need to pass this data to the templating engine at first.
	                renderedTemplate = OfficeUITemplating.LoadTemplate(name, loadedTemplate, data);
	            },

	            // When there's an error while consuming the Json, render it here.
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
	                console.log("%c [OfficeUI Templating]: " + errorThrown, "color: red;");
	            }
	        });
    	}

        return renderedTemplate; // Return the data which has been templated.
	}
}