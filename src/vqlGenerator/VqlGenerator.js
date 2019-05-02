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
         
        return `<pre>${result}</pre>`; 
    }
    
    static packageImportCode(root) {
        var result = '';
        if (root.value.children[0] && root.value.children[0].getAttribute("as") === "emfPackages") {            
            for (var i = 0; i < root.value.children[0].children.length; i++) {
                var emfPackage = root.value.children[0].children[i];
                var nsURI = emfPackage.getAttribute("value");
                var element = `import "${nsURI}"`;  
                if (this.usingPrefixes) {
                    var ecore = eCoreHandler.getECoreByNsURI(nsURI);
                    element += ` as ${ecore.value.nsPrefix}`;
                }  
                result = result.concat(this.wrapperWithSpan("package", root.id, element));
                result = result.concat("<br>");                
            }            
        }

        result = result.concat("<br>");  
        return result;
    }

    static graphPatternCode(graphPattern) {
        var name = graphPattern.value.getAttribute("name");
        var description = graphPattern.value.getAttribute("description");

        var bodySeperator = `} or {<br>`;   
        
        var parameterList = this.parameterListCode(graphPattern);

        var bodies = [];
        var patternbodies = VwqlUtils.getElements(this.graph, graphPattern, "patternbody");
        for (var i = 0; i < patternbodies.length; i++) {
            bodies.push(this.patternBodyCode(patternbodies[i]));            
        }        

        var element = `// ${description}<br>pattern ${name} ( ${parameterList}){<br>${bodies.join(bodySeperator)}}`;

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

        var constraintCode = [];
        var pathexpressions = VwqlUtils.getElements(this.graph, body, "pathexpression");
        for (i = 0; i < pathexpressions.length; i++) {
            element = this.pathexpressionCode(pathexpressions[i]);
            constraintCode.push(this.wrapperWithSpan("pathexpression", pathexpressions[i].id, element));
        }

        var compare = VwqlUtils.getElements(this.graph, body, "compare");
        for (i = 0; i < compare.length; i++) {
            element = this.compareCode(compare[i]);
            constraintCode.push(this.wrapperWithSpan("pathexpression", compare[i].id, element));
        }
        
        var bodyContent = variablesCode.join(`<br>${this.INDENTATION_START}`);
        bodyContent = bodyContent.concat(`<br>${this.INDENTATION_START}`);
        bodyContent = bodyContent.concat(constraintCode.join(`<br>${this.INDENTATION_START}`));

        return `${this.INDENTATION_START + this.wrapperWithSpan("patternbody", body.id, bodyContent)} <br>`;
    }

    static parameterListCode(graphPattern) {
        var parametersCode = [];

        var parameters = VwqlUtils.getElements(this.graph, graphPattern, "parameter");
        for (var i = 0; i < parameters.length; i++) {
            var type = this.getTypeCode(parameters[i]);
            var name = parameters[i].value.getAttribute("name");        
            var element = `${name}: ${type}`;
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
        if (!Vwqlvalidation.isValideCell(cell)) {
            return `${this.errorCode("Invalid element")}`;
        }
        var type = cell.value.getAttribute("type");
        var eClassifier = eCoreHandler.getEClassifierByName(type);
        if (eClassifier.package.value.nsPrefix === "ecore") {
            return `java ${eCoreHandler.getJavaName(eClassifier.name)}`;
        } 
        if (this.usingPrefixes) {
            return `${type}`;
        }
        return `${eClassifier.name}`;            
    }

    static pathexpressionCode(pathexpression) {
        var invalidCellCode = this.getInvalidCellCode(pathexpression);
        if (invalidCellCode.length !== 0) {
            return invalidCellCode;
        }
        var sourceName = pathexpression.source.value.getAttribute("type");
        var sourceType = this.getTypeCode(pathexpression.source);
        var sourceClassifier = eCoreHandler.getEClassifierByName(sourceName);
        var allReferences = eCoreHandler.getAllEStructuralFeaturesOfClassifier(sourceClassifier);
        var edgeTypeName = pathexpression.value.getAttribute("edgeType");
        var reference = allReferences.find(reference => eCoreHandler.getEReferenceFullName(reference) === edgeTypeName);
        var source = pathexpression.source.value.getAttribute("name");
        var target = pathexpression.target.value.getAttribute("name");
        
        var element;
        var template = pathexpression.value.nodeName.toLowerCase();        
        if (reference) {
            element = `${sourceType}.${reference.name}(${source},${target});`;
        } else {
            element = `${this.errorCode("Invalid element")}`;
        }        
        return this.wrapperWithSpan(template, pathexpression.id, element);
    }

    static compareCode(compare) {
        var invalidCellCode = this.getInvalidCellCode(compare);
        if (invalidCellCode.length !== 0) {
            return invalidCellCode;
        }
        var source = compare.source.value.getAttribute("name");
        var target = compare.target.value.getAttribute("name");
        var equality = compare.value.getAttribute("equality");
        var symbol = equality === "true" ? "==" : "!="; 
        var element = `${source} ${symbol} ${target};`;
        var template = compare.value.nodeName.toLowerCase();
        return this.wrapperWithSpan(template, compare.id, element);
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

VqlGenerator.INDENTATION_START = '	';
VqlGenerator.usingPrefixes = true;
