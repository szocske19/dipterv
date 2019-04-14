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

	static createValidationOverlay(cell, image, tooltip) {
		var overlay = new mxCellOverlay(image, tooltip);
		overlay.validation = true;
		// Installs a handler for clicks on the overlay
		overlay.addListener(mxEvent.CLICK, (sender, evt) => {
			mxUtils.alert(`${tooltip}`);
		});

		this.graph.addCellOverlay(cell, overlay);
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
				`Pattern has no name.`
			);
		}
		var parameters = VwqlUtils.getElements(this.graph, pattern, "parameter");
		var i;
		for (i = 0; i < parameters.length; i++) {
			this.parameterValidation(parameters[i]);
		}
		var edges = VwqlUtils.getElements(this.graph, pattern, "edge");
		for (i = 0; i < edges.length; i++) {
			this.edgeValidation(edges[i]);
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
					`Pattern's name is not unique.`
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
				`Parameter's type is undefined.`
			);
		}
	}

	static edgeValidation(edge) {
		var sourceType = edge.source.value.getAttribute("type");
		var targetType = edge.target.value.getAttribute("type");
		if (sourceType && targetType) {
			var targetClassifier = eCoreHandler.getEClassifierByName(sourceType);
			var sourceClassifier = eCoreHandler.getEClassifierByName(targetType);
			if (
				!eCoreHandler.haveCommonDescendant(sourceClassifier, targetClassifier)
			) {
				this.createValidationOverlay(
					edge,
					this.graph.errorImage,
					`Types have not got common descendant.`
				);
			}
		}
	}
}
