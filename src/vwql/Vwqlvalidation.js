class Vwqlvalidation {
	static validate(graph) {
		this.graph = graph;
		var root = graph.getModel().getRoot();
		var firstLayer = root.children[0];

		this.removeValidationOverlay();

		var patterns = VwqlUtils.getElements(graph, firstLayer, "pattern");

		this.uniquePatternName(patterns);
		for (var i = 0; i < patterns.length; i++) {
			this.patternValidation(patterns[i]);
		}
	}

	static createValidationOverlay(cell, image, tooltip, validationType) {
		var overlay = new mxCellOverlay(image, tooltip);
		overlay.validation = true;
		overlay.validationType = validationType;
		// Installs a handler for clicks on the overlay
		overlay.addListener(mxEvent.CLICK, (sender, evt) => {
			mxUtils.alert(`${tooltip}`);
		});

		this.graph.addCellOverlay(cell, overlay);
	}

	static isValideCell(cell) {
		if (cell.overlays) {
			for (var i = 0; i < cell.overlays.length; i++) {
				if (cell.overlays[i].validationType === `error`) {
					return false;
				}
			}
		}
		return true;
	}

	static removeValidationOverlay() {
		var cells = this.graph.getModel().cells;
		for (var cell in cells) {
			var overlays = cells[cell].overlays;
			if (overlays) {
				cells[cell].overlays.forEach((overlay) => {
					if (overlay.validation === true) {
						this.graph.removeCellOverlay(cells[cell], overlay);
					}
				});
			}
		}
	}

	static patternValidation(pattern) {
		var name = pattern.value.getAttribute("name");
		if (name === undefined || name === "") {
			this.createValidationOverlay(
				pattern,
				this.graph.errorImage,
				`Pattern has no name.``error`
			);
			}
		
		var i;
		var parameters = VwqlUtils.getElements(this.graph, pattern, "parameter");
		for (i = 0; i < parameters.length; i++) {
			this.parameterValidation(parameters[i]);
		}

		var edges = VwqlUtils.getElements(this.graph, pattern, "edge");
		for (i = 0; i < edges.length; i++) {
			this.edgeValidation(edges[i]);
		}

		var patternbodies = VwqlUtils.getElements(this.graph, pattern, "patternbody");
		for (var j = 0; j < patternbodies.length; j++) {
			edges = VwqlUtils.getElements(this.graph, patternbodies[j], "edge");
			for (i = 0; i < edges.length; i++) {
				this.edgeValidation(edges[i]);
			}
			var pathExpressions = VwqlUtils.getElements(this.graph, patternbodies[j], "pathexpression");
			for (i = 0; i < pathExpressions.length; i++) {
				this.pathExpressionValidation(pathExpressions[i]);
			}
			var variables = VwqlUtils.getElements(this.graph, patternbodies[j], "variable");
			for (i = 0; i < variables.length; i++) {
				this.variableValidation(variables[i]);
			}
		}
	}

	static uniquePatternName(patterns) {
		var patternNames = patterns.map(pattern => pattern.value.getAttribute("name"));

		var sortedArr = patternNames.slice().sort();

		var notUnique = [];
		for (var i = 0; i < sortedArr.length - 1; i++) {
			if (sortedArr[i + 1] === sortedArr[i]) {
				notUnique.push(sortedArr[i]);
			}
		}

		for (var j = 0; j < patterns.length; j++) {
			if (notUnique.includes(patterns[j].value.getAttribute("name"))) {
				this.createValidationOverlay(
					patterns[j],
					this.graph.errorImage,
					`Pattern's name is not unique.`,
					`error`
				);
			}
		}
	}

	static parameterValidation(parameter) {
		var type = parameter.value.getAttribute("type");
		if (type === undefined || type === "") {
			this.createValidationOverlay(
				parameter,
				this.graph.errorImage,
				`Parameter's type is undefined.`,
				`error`
			);
		}
		var Classifier = eCoreHandler.getEClassifierByName(type);
		if (!Classifier) {
			this.createValidationOverlay(
				parameter,
				this.graph.errorImage,
				`Parameter's type is invalid.`,
				`error`
			);
		}
	}

	static variableValidation(varibale) {
		var type = varibale.value.getAttribute("type");
		if (type === undefined || type === "") {
			this.createValidationOverlay(
				varibale,
				this.graph.errorImage,
				`Varibale's type is undefined.`,
				`error`
			);
		}
		var Classifier = eCoreHandler.getEClassifierByName(type);
		if (!Classifier) {
			this.createValidationOverlay(
				varibale,
				this.graph.errorImage,
				`Varibale's type is invalid.`,
				`error`
			);
		}
	}

	static edgeValidation(edge) {
		var sourceType = edge.source.value.getAttribute("type");
		var targetType = edge.target.value.getAttribute("type");
		if (sourceType && targetType) {
			var targetClassifier = eCoreHandler.getEClassifierByName(targetType);
			var sourceClassifier = eCoreHandler.getEClassifierByName(sourceType);
			if (targetClassifier && sourceClassifier) {
				if (
					!eCoreHandler.haveCommonDescendant(sourceClassifier, targetClassifier)
				) {
					this.createValidationOverlay(
						edge,
						this.graph.errorImage,
						`Types have not got common descendant.`,
						`error`
					);
				}
			}
		}
	}

	static pathExpressionValidation(edge) {
		var template = edge.target.value.nodeName.toLowerCase();
		var sourceType = edge.source.value.getAttribute("type");
		if (this.isValideCell(edge.target) && this.isValideCell(edge.source) && sourceType) {
			var sourceClassifier = eCoreHandler.getEClassifierByName(sourceType);
			var allReferences = eCoreHandler.getAllEStructuralFeaturesOfClassifier(sourceClassifier);
			var edgeTypeName = edge.value.getAttribute("edgeType");
			var reference = allReferences.find(reference => eCoreHandler.getEReferenceFullName(reference) === edgeTypeName);

			if (!reference) {
				this.createValidationOverlay(
					edge,
					this.graph.errorImage,
					`<b>${eCoreHandler.getEClassifierFullName(sourceClassifier)}</b> does not have structuralfeature with "<b>${edgeTypeName}</b>" name.`,
					`error`
				);
			} else if (template === "variable") {
				var targetType = edge.target.value.getAttribute("type");
				if (targetType) {
					var targetClassifier = eCoreHandler.getEClassifierByName(targetType);
					if (!eCoreHandler.haveCommonDescendant(targetClassifier, reference.eTypeRef)) {
						this.createValidationOverlay(
							edge,
							this.graph.errorImage,
							`<b>${eCoreHandler.getEClassifierFullName(targetClassifier)}</b> does not fit as target to the <b>${edgeTypeName}</b> feature .`,
							`error`
						);
					}
				}
			} else if (template === "enumliteral"
				|| template === "stringliteral"
				|| template === "booleanliteral"
				|| template === "numberliteral") {
					if (eCoreHandler.isPrimitivType(reference.eTypeRef)) {
						var isPorperType = false;
						switch (template) {
							case "stringliteral": isPorperType = eCoreHandler.getEStringTypeNames().indexOf(reference.eTypeRef.name) >= 0; break;
							case "booleanliteral": isPorperType = eCoreHandler.getENumberTypeNames().indexOf(reference.eTypeRef.name) >= 0; break;
							case "numberliteral": isPorperType = eCoreHandler.getEBooleanTypeNames().indexOf(reference.eTypeRef.name) >= 0; break;
							
							default: isPorperType = false;
						}
						if (!isPorperType) {
							this.createValidationOverlay(
								edge,
								this.graph.errorImage,
								`The lieteral does not fit as target to the <b>${edgeTypeName}</b> feature .`,
								`error`
							);
						}
					} else {
						this.createValidationOverlay(
							edge,
							this.graph.errorImage,
							`The lieteral does not fit as target to the <b>${edgeTypeName}</b> feature .`,
							`error`
						);
					}
			}
		}
	}
}
