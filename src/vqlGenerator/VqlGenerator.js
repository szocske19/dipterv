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
        var i;
        var element;
        
        var variablesCode = [];
        var variables = VwqlUtils.getElements(this.graph, body, "variable");
        for (i = 0; i < variables.length; i++) {
            var type = this.getTypeCode(variables[i]);
            element = `${type}(${this.expressionCode(variables[i])});`;
            variablesCode.push(this.wrapperWithSpan("variable", variables[i].id, element));
        }

        var pathexpressionCode = [];
        var pathexpressions = VwqlUtils.getElements(this.graph, body, "pathexpression");
        for (i = 0; i < pathexpressions.length; i++) {
            element = this.pathexpressionCode(pathexpressions[i]);
            pathexpressionCode.push(this.wrapperWithSpan("pathexpression", pathexpressions[i].id, element));
        }
        
        var bodyContent = variablesCode.join(`<br>${this.INDENTATION_START}`);
        bodyContent = bodyContent.concat(`<br>${this.INDENTATION_START}`);
        bodyContent = bodyContent.concat(pathexpressionCode.join(`<br>${this.INDENTATION_START}`));

        return `${this.INDENTATION_START + this.wrapperWithSpan("patternbody", body.id, bodyContent)} <br>`;
    }

    static parameterListCode(graphPattern) {
        var parametersCode = [];

        var parameters = VwqlUtils.getElements(this.graph, graphPattern, "parameter");
        for (var i = 0; i < parameters.length; i++) {
            var type = this.getTypeCode(parameters[i]);
            var name = parameters[i].value.getAttribute("name");        
            var element = `${type}: ${name}`;
            parametersCode.push(this.wrapperWithSpan("parameter", parameters[i].id, element));                
        }

        return parametersCode.join(", ");
    }

    static wrapperWithSpan(cls, id, element) {
        return `<span class="${cls}" refId="${id}">${element}</span>`;
    }

    static expressionCode(exp) {
        if (exp === null) {
            return `${this.errorCode("Undeclared expression")}`;
        }
        var template = exp.value.nodeName.toLowerCase();
        switch (template) {
            case "variable": return `${exp.value.getAttribute("name")}`;
            default: return `${this.errorCode("Undeclared expression")}`;
        }
    }

    static errorCode(description) {
        return `[[[[${description}]]]]`;
    }

    static getTypeCode(cell) {
        var invalidCellCode = this.getInvalidCellCode(cell);
        if (invalidCellCode.length !== 0) {
            return invalidCellCode;
        }
        var type = cell.value.getAttribute("type");
        var eClassifier = eCoreHandler.getEClassifierByName(type);
        if (eClassifier.package.value.nsPrefix === "ecore") {
            return `java ${eClassifier.name}`;
        }
        return `${type}`;
    }

    static constraintCode(constraint) {
        var invalidCellCode = this.getInvalidCellCode();
        if (invalidCellCode.length !== 0) {
            return invalidCellCode;
        }

        switch (template) {
            case "pathexpression":
           
            element = this.pathexpressionCode(constraint); break;
            default: 
            element = "asd";
        }

        return this.wrapperWithSpan(template, constraint.id, element);
    }

    static pathexpressionCode(pathexpression) {
        var invalidCellCode = this.getInvalidCellCode(pathexpression);
        if (invalidCellCode.length !== 0) {
            return invalidCellCode;
        }
        var sourceType = pathexpression.source.value.getAttribute("type");
        var sourceClassifier = eCoreHandler.getEClassifierByName(sourceType);
        var allReferences = eCoreHandler.getAllEStructuralFeaturesOfClassifier(sourceClassifier);
        var edgeTypeName = pathexpression.value.getAttribute("edgeType");
        var reference = allReferences.find(reference => eCoreHandler.getEReferenceFullName(reference) === edgeTypeName);
        var source = pathexpression.source.value.getAttribute("name");
        var target = pathexpression.target.value.getAttribute("name");
        return `${sourceType}.${reference.name}(${source},${target});`;
    }

    static getInvalidCellCode(cell) {
        var template = cell.value.nodeName.toLowerCase();
        if (!Vwqlvalidation.isValideCell(cell)) {
            var element = `${this.errorCode("Invalid element")}`;
            return this.wrapperWithSpan(template, cell.id, element);
        }

        return "";
    }
}

VqlGenerator.INDENTATION_START = '&emsp;';
