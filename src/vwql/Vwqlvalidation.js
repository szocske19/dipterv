class Vwqlvalidation {
    static validate(graph) {
        this.graph = graph; 
        var root = graph.getModel().getRoot();
        var firstLayer = root.children[0];

        var patterns = VwqlUtils.getElements(graph, firstLayer, "pattern");

        for (var i = 0; i < patterns.length; i++) {
            Vwqlvalidation.patternValidation(patterns[i]);
        }
    }

    static createOverlay(image, tooltip)
    {
        var overlay = new mxCellOverlay(image, tooltip);

        // Installs a handler for clicks on the overlay
        overlay.addListener(mxEvent.CLICK, (sender, evt) => {
            mxUtils.alert(`${tooltip}\nLast update: ${new Date()}`);
        });
        
        return overlay;
    }

    static patternValidation(pattern) {
        if (pattern.value.name === undefined || pattern.value.name === "") {
            this.graph.addCellOverlay(pattern, this.createOverlay(this.graph.errorImage, `State: `));    
        }
    }
}
