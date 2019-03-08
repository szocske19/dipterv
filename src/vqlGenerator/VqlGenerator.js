class VqlGenerator { 
    constructor() { 
        this.INDENTATION_START = '<br />';
        this.INDENTATION_END = '';  
    }
    
    generate(graph) { 
        var root = graph.getRoot().children[0]; 
        var result = '';
        if (root.children == null) { 
            return result; 
        }

        for (var i = 0; i < root.children.length; i++) { 
            result = result.concat(this.graphPatternCode(root.children[i])); 
            result = result.concat("<br>"); 
        }
        return result; 
    }
    

    graphPatternCode(graphPattern) {
        var name = graphPattern.value.getAttribute("label");

        var bodySeperator = `<br> } or { <br>`;   
        
        var parameterList = `asd, dsa`;

        var bodies = [];
        for (var i = 0; i < graphPattern.children.length; i++) {
            bodies.push(this.patternBodyCode(graphPattern.children[i]));
        }

        var element = `pattern ${name} ( ${parameterList} ){<br>  ${bodies.join(bodySeperator)} <br>}`;

        return this.wrapperWithSpan("pattern", graphPattern.id, element);
    }

    patternBodyCode(body) {
        var name = body.value.getAttribute("label");   

        var element = `valami`;

        return this.INDENTATION_START + this.wrapperWithSpan("pattern", body.id, element);
    }

    packageImportCode(ePackage) {
        return ePackage;
    }

    wrapperWithSpan(cls, id, element){
        return '<span class="' + cls + '" refId="' + id + '">' + element + '</span>'
    }
}