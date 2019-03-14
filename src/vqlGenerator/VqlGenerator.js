class VqlGenerator { 
    constructor() { 
        this.INDENTATION_START = '&emsp;';
    }
    
    generate(graph) { 
        var root = graph.getModel().getRoot().children[0];
        this.graph = graph;
        var element = `package ${root.value.name}`;
        var result = `${this.wrapperWithSpan("package", root.id, element)} <br><br>`;
        if (root.children) {
            for (var i = 0; i < root.children.length; i++) {
                if (this.graph.isSameTamplate(root.children[i], "pattern")) {
                    result = result.concat(this.graphPatternCode(root.children[i])); 
                    result = result.concat("<br>");
                } 
            }
         }
        return result; 
    }    

    graphPatternCode(graphPattern) {
        var name = graphPattern.value.getAttribute("label");

        var bodySeperator = `} or { <br>`;   
        
        var parameterList = `asd, dsa`;

        var bodies = [];
        if (graphPattern.children) {
            for (var i = 0; i < graphPattern.children.length; i++) {
                if (this.graph.isSameTamplate(graphPattern.children[i], "patternbody")) {
                    bodies.push(this.patternBodyCode(graphPattern.children[i]));
                }
            }
        }

        var element = `pattern ${name} ( ${parameterList} ){<br>  ${bodies.join(bodySeperator)}}`;

        return this.wrapperWithSpan("pattern", graphPattern.id, element);
    }

    patternBodyCode(body) {
        var name = body.value.getAttribute("label");   

        var element = `valami`;

        return `${this.INDENTATION_START + this.wrapperWithSpan("pattern", body.id, element)} <br>`;
    }

    packageImportCode(ePackage) {
        return ePackage;
    }

    wrapperWithSpan(cls, id, element){
        return '<span class="' + cls + '" refId="' + id + '">' + element + '</span>'
    }
}