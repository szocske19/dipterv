class VwqlUtils {
    static getElements(graph, graphNode, template) {
        if (!graphNode) {
            return [];
        }
        var elements = [];
        if (graphNode.children) {
            for (var i = 0; i < graphNode.children.length; i++) {
                if (graph.isSameTamplate(graphNode.children[i], template)) {
                    elements.push(graphNode.children[i]);
                }
            }
        }
        return elements;
    }

    static getElementByID(graph, ID) {
        var cells = Object.values(graph.getModel().cells);
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].getId() === ID) {
                return cells[i];
            }
        }        
        return null;
    }
}
