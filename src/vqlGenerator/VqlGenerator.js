class VqlGenerator {    
    static generate(graph) {
        this.graph = graph; 
        var root = graph.getModel().getRoot();
        var firstLayer = root.children[0];    
        var element = `package ${root.value.getAttribute("packageName")}`;
        var result = `${this.wrapperWithSpan("package", root.id, element)} <br><br>`;

        result = result.concat(this.packageImportCode(root));

        var patterns = VwqlUtils.getElements(graph, firstLayer, "pattern");

        for (var i = 0; i < patterns.length; i++) {
            result = result.concat(this.graphPatternCode(firstLayer.children[i])); 
            result = result.concat("<br>");            
        }
         
        return result; 
    }
    
    static packageImportCode(root) {
        var result = '';
        if (root.value.children[0] && root.value.children[0].getAttribute("as") === "emfPackages") {            
            for (var i = 0; i < root.value.children[0].children.length; i++) {
                var emfPackage = root.value.children[0].children[i];
                var element = `import ${emfPackage.getAttribute("value")}`;    
                result = result.concat(this.wrapperWithSpan("package", root.id, element));
                result = result.concat("<br>");                
            }            
        }

        result = result.concat("<br>");  
        return result;
    }

    static graphPatternCode(graphPattern) {
        var name = graphPattern.value.getAttribute("name");

        var bodySeperator = `} or { <br>`;   
        
        var parameterList = this.parameterListCode(graphPattern);

        var bodies = [];
        var patternbodies = VwqlUtils.getElements(this.graph, graphPattern, "patternbody");
        for (var i = 0; i < patternbodies.length; i++) {
            bodies.push(this.patternBodyCode(patternbodies[i]));            
        }        

        var element = `pattern ${name} ( ${parameterList} ){<br>  ${bodies.join(bodySeperator)}}`;

        return this.wrapperWithSpan("pattern", graphPattern.id, element);
    }

    static patternBodyCode(body) {
        var name = body.value.getAttribute("name");   

        var element = `<<<<valami>>>>`;

        return `${this.INDENTATION_START + this.wrapperWithSpan("patternbody", body.id, element)} <br>`;
    }

    static parameterListCode(graphPattern) {
        var parametes = [];

        var parameters = VwqlUtils.getElements(this.graph, graphPattern, "parameter");
        for (var i = 0; i < parameters.length; i++) {
            var type = parameters[i].value.getAttribute("type");
            var name = parameters[i].value.getAttribute("name");        
            var element = `${type}: ${name}`;
            parametes.push(this.wrapperWithSpan("parameter", parameters[i].id, element));                
        }

        return parametes.join(", ");
    }

    static wrapperWithSpan(cls, id, element) {
        return `<span class="${cls}" refId="${id}">${element}</span>`;
    }
}

VqlGenerator.INDENTATION_START = '&emsp;';
