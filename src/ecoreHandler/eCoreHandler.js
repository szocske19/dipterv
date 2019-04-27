var eCoreHandler = {

    eCores: [],
    knownEcores: {
		"config/ecoreTypes.ecore": "http://www.eclipse.org/emf/2002/Ecore",
		"config/cps.ecore": "http://org.eclipse.viatra/model/cps",
		"config/GraphicalPatternLanguage.ecore": "http://www.eclipse.org/viatra/query/patternlanguage/emf/GraphPatternLanguage",
		"config/XMLType.ecore": "http://www.eclipse.org/emf/2003/XMLType"
    },
    
    updateEcores(graph, root) {
        var elements = root.value.getElementsByTagName("Array");
        if (elements) {
            var emfPackages = [...elements].find(element => element.getAttribute("as") === "emfPackages");
            if (emfPackages) {
                for (var i = 0; i < emfPackages.children.length; i++) {
                    eCoreHandler.generateECoreFromNsURI(graph, emfPackages.children[i].getAttribute("value"));
                }
            }
        }
    },

    generateECoreFromNsURI(graph, nsURI) {
        var eCore = eCoreHandler.getEcoreByNsURI(nsURI);
        if (eCore) {
            eCoreHandler.generateECore(graph, eCore);
        }
    },


	getKnownEcores() {
		return Object.values(eCoreHandler.knownEcores);
    },
    
    getEcoreByNsURI(nsUri) {
        return Object.keys(eCoreHandler.knownEcores).find(key => eCoreHandler.knownEcores[key] === nsUri);
    },
    
    addECoreECore(graph) {
        eCoreHandler.generateECore(graph, Object.keys(eCoreHandler.knownEcores)[0]);
    },

    generateECore(graph, xsd) {       
        // First we construct a Jsonix context - a factory for unmarshaller (parser)
        // and marshaller (serializer)
        var context = new Jsonix.Context([ecore]);

        // Then we create a unmarshaller
        var unmarshaller = context.createUnmarshaller();
        var ready = false;
        unmarshaller.unmarshalURL(xsd,
            // This callback function will be provided with the result
            // of the unmarshalling
            (unmarshalled) => {                    
                    eCoreHandler.addECore(unmarshalled);
                    Vwqlvalidation.validate(graph);
            });     
    },


    getECores() {
        return eCoreHandler.eCores;
    },
 
    addECore(eCore) {
        var eClassifier;
        for (var i = 0; i < eCore.value.eClassifiers.length; i++) {
            eCore.value.eClassifiers[i].package = eCore;
            eClassifier = eCore.value.eClassifiers[i];
            if (eClassifier.eStructuralFeatures) {
                for (var j = 0; j < eClassifier.eStructuralFeatures.length; j++) {
                    eClassifier.eStructuralFeatures[j].source = eClassifier;                    
                }
            }
        }
        eCoreHandler.eCores.push(eCore);
        var k;
        for (k = 0; k < eCore.value.eClassifiers.length; k++) {
            eClassifier = eCore.value.eClassifiers[k];
            eClassifier.superTypeRef = this.getAllSuperTypes(eClassifier);
            if (!eClassifier.subTypesRef) {
                eClassifier.subTypesRef = [];
            }
            var l;
            for (l = 0; l < eClassifier.superTypeRef.length; l++) {
                var superType = eClassifier.superTypeRef[l];
                if (!superType.subTypesRef) {
                    superType.subTypesRef = [];
                }
                superType.subTypesRef.push(eClassifier);
            }

            if (eClassifier.eStructuralFeatures) {
                for (l = 0; l < eClassifier.eStructuralFeatures.length; l++) {
                    var eStructuralFeature = eClassifier.eStructuralFeatures[l];

                    if (eStructuralFeature.eType) {
                        eStructuralFeature.eTypeRef = this.stringRefToRealRef(eClassifier, eStructuralFeature.eType);
                        if (eStructuralFeature.eTypeRef === undefined) {
                            console.log(`Can't find reference. Feature: ${eStructuralFeature.name}, Type: ${eStructuralFeature.eType}`);
                        }
                    }
                }
            }
        }
        this.calulateSubtypeLeafs();
    },

    removeEcores() {
        eCoreHandler.eCores = [];
    },

    calulateSubtypeLeafs() {
        var eCore; var eClassifier;
        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            eCore = eCoreHandler.eCores[i].value;
            for (var j = 0; j < eCore.eClassifiers.length; j++) {
                eClassifier = eCore.eClassifiers[j];
                eClassifier.subTypeLeafs = null;                
            }
        }
        for (var k = 0; k < eCoreHandler.eCores.length; k++) {
            eCore = eCoreHandler.eCores[k].value;
            for (var l = 0; l < eCore.eClassifiers.length; l++) {
                eClassifier = eCore.eClassifiers[l];
                this.getSubtypeLeafs(eClassifier);           
            }
        }
    },

    getSubtypeLeafs(eClassifier) {
        if (eClassifier.subTypeLeafs) {
            return eClassifier.subTypeLeafs;
        }
        if (eClassifier.subTypesRef.length === 0) {
            eClassifier.subTypeLeafs = [eClassifier];
            return eClassifier.subTypeLeafs;      
        }
        var subTypeLeafs = [];
        eClassifier.subTypesRef.forEach((subType) => {
            subTypeLeafs = subTypeLeafs.concat(this.getSubtypeLeafs(subType));
        });
        eClassifier.subTypeLeafs = subTypeLeafs;
        return subTypeLeafs;
    },

    haveCommonDescendant(eClassifier1, eClassifier2) {
        if (!eClassifier1 || !eClassifier2) {
            return false;
        }
        if (typeof eClassifier1 === "string" || typeof eClassifier2 === "string") {
            return eClassifier1 === eClassifier2;
        }
        return eClassifier1.subTypeLeafs.some(subType => eClassifier2.subTypeLeafs.includes(subType));
    },

    getEClassifiers(filterFunction) {
        var allEClassifiers = [];
        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            var eClassifiers = eCoreHandler.eCores[i].value.eClassifiers;
            if (filterFunction && eClassifiers) {
                eClassifiers = eClassifiers.filter(filterFunction);
            }
            if (eClassifiers) {
                allEClassifiers = allEClassifiers.concat(eClassifiers);
            }
        }
        return allEClassifiers;
    },

    getEClassFilter(eClassifier) {
        return eClassifier.TYPE_NAME === "ecore.EClass";
    },

    getEEnumFilter(eClassifier) {
        return eClassifier.TYPE_NAME === "ecore.EEnum";
    },

    getEClassifierNames() {
        var eClassifiers = eCoreHandler.getEClassifiers();
        return eClassifiers.map(eClassifier => eCoreHandler.getEClassifierFullName(eClassifier));
    },

    getEClassNames() {
        var eClassifiers = eCoreHandler.getEClassifiers(eCoreHandler.getEClassFilter);
        return eClassifiers.map(eClassifier => `${eClassifier.package.value.nsPrefix}::${eClassifier.name}`);
    },

    getEEnumNames() {
        var eClassifiers = eCoreHandler.getEClassifiers(eCoreHandler.getEEnumFilter);
        
        return eClassifiers.map(eClassifier => `${eClassifier.package.value.nsPrefix}::${eClassifier.name}`);
    },

    getEEnumLiteralNames() {
        var eClassifiers = eCoreHandler.getEClassifiers(eCoreHandler.getEEnumFilter);
        var eEnumLiteralNames = [];
        if (eClassifiers) {
            eClassifiers.forEach((eClassifier) => {
                if (eClassifier) {
                    eClassifier.eLiterals.forEach((literal) => {
                        eEnumLiteralNames.push(`${eClassifier.package.value.nsPrefix}::${eClassifier.name}::${literal.name}`);
                    });
                }
            });
        }
        return eEnumLiteralNames;
    },

    getEClassifierByName(name) {
        if (!name) {
            return undefined;
        }

        var nameTags = eCoreHandler.separatedNameTags(name);
        if (nameTags.length === 2) {
            for (var i = 0; i < eCoreHandler.eCores.length; i++) {
                if (nameTags[0] === eCoreHandler.eCores[i].value.nsPrefix) {
                    return eCoreHandler.eCores[i].value.eClassifiers.find(o => o.name === nameTags[1]);
                }
            }
        }
                
        return undefined;
    },

    separatedNameTags(name) {
        if (!name) {
            return [];
        }

        return name.split('::');
    },

    getAllSuperTypes(eClassifier) {
        var eClassifiers = [];
        if (eClassifier.eSuperTypes) {
            for (var i = 0; i < eClassifier.eSuperTypes.length; i++) {
                // var superTypeName = eClassifier.eSuperTypes[i].substring(3, eClassifier.eSuperTypes[i].length);
                // var nsPrefix = eClassifier.package.value.nsPrefix;
                // var superType = eCoreHandler.getEClassifierByName(`${nsPrefix}::${superTypeName}`);
                var superType = this.stringRefToRealRef(eClassifier, eClassifier.eSuperTypes[i]);
                
                eClassifiers.push(superType);
            }
        }
        return eClassifiers;
    },

    stringRefToRealRef(eClassifier, stringRef) {
        var stringTags = stringRef.split('#//');

        if (stringTags.length === 2) {
            var nsURIs = stringTags[0].split(" ");
            var nsURI = "";
            if (nsURIs.length === 2) {
                nsURI = nsURIs[1];
            } else if (nsURIs.length === 1) {
                if (nsURIs[0] === "") {
                    nsURI = eClassifier.package.value.nsURI;
                } else {
                    nsURI = nsURIs[0];
                }
            }
            for (var i = 0; i < eCoreHandler.eCores.length; i++) {
                if (nsURI === eCoreHandler.eCores[i].value.nsURI) {
                    var eClassifiers = eCoreHandler.eCores[i].value.eClassifiers;
                    return eClassifiers.find(o => o.name === stringTags[1]);
                }                
            }            
        }

        // if the the compute get here, that means we can't find the Ref. It shoud not happen.
        return undefined;
    },

    isPrimitivType(typeName) {
        switch (typeName) {
            case "EBigDecimal": return true;
            case "EBigInteger": return true;
            case "EByte": return true;
            case "EByteArray": return true;
            case "EDouble": return true;
            case "EString": return true;
            case "EFloat": return true;
            case "ELong": return true;
            case "EShort": return true;
            case "EBoolean": return true;
            case "EBooleanObject": return true;
            case "EByteObject": return true;
            case "ECharacterObject": return true;
            case "EDate": return true;
            case "EDiagnosticChain": return true;
            case "EEList": return true;
            case "EInt": return true;
            case "EEnumLiteral": return true;
            case "EPackage": return true;
            case "EClassifier": return true;
            case "EStructuralFeature": return true;
            case "EFeatureMapEntry": return true;
            case "EDataType": return true;
            case "EStringToStringMapEntry": return true;
            
            // TODO examine whether this is all variables (ecore.ecore)
            default: return false;
        }
    },

    getEStringTypeNames() {
        return ["EString"];
    },

    getENumberTypeNames() {
        return ["EBigDecimal", "EBigInteger", "EDouble", "EFloat", "ELong", "EShort", "EInt"];
    },

    getEBooleanTypeNames() {
        return ["EBooleanObject"];
    },

    getEStructuralFeatures(eClassifier) {
        if (!eClassifier.eStructuralFeatures) {
            return [];
        }
        return eClassifier.eStructuralFeatures;
    },

    getEReferences(eClassifier) {
        if (!eClassifier.eStructuralFeatures) {
            return [];
        }
        return eClassifier.eStructuralFeatures.filter(f => f.TYPE_NAME === "ecore.EReference");
    },

    getEAttributes(eClassifier) {
        if (!eClassifier.eStructuralFeatures) {
            return [];
        }
        return eClassifier.eStructuralFeatures.filter(f => f.TYPE_NAME === "ecore.EAttribute");
    },

    getAllEStructuralFeaturesOfClassifier(eClassifier, getFunction = eCoreHandler.getEStructuralFeatures) {
        if (eClassifier && eClassifier.superTypeRef) {
            var allEReferences = [];
            var superClassifiers = eClassifier.superTypeRef.slice();
            if (superClassifiers) {
                for (var i = 0; i < superClassifiers.length; i++) {
                    if (superClassifiers[i]) {                        
                        var superReferences = this.getAllEStructuralFeaturesOfClassifier(superClassifiers[i], getFunction);
                        allEReferences = allEReferences.concat(superReferences);
                    }
                }
            }
            var eReferences = getFunction(eClassifier);
            allEReferences = allEReferences.concat(eReferences);

            return allEReferences;
        } 
        return [];
    },

    getAllEReferencesOfClassifier(eClassifier) {
        return eCoreHandler.getAllEStructuralFeaturesOfClassifier(eClassifier, eCoreHandler.getEReferences);
    },

    getAllEAttributesOfClassifier(eClassifier) {
        return eCoreHandler.getAllEStructuralFeaturesOfClassifier(eClassifier, eCoreHandler.getEAttributes);
    },
    
    getAllEReferences() {
        var allEReferences = [];        

        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            var eCore = eCoreHandler.eCores[i].value;
            for (var j = 0; j < eCore.eClassifiers.length; j++) {
                var eReferences = eCoreHandler.getEReferences(eCore.eClassifiers[j]);
                allEReferences = allEReferences.concat(eReferences);
            }
        }

        return allEReferences;
    },

    getEReferencesFullName(eReferences) {
        return eReferences.map(reference => eCoreHandler.getEReferenceFullName(reference));
    },

    getEReferenceFullName(eReference) {
        return `${eReference.source.name}::${eReference.name}`;
    },

    getEClassifierFullName(eClassifier) {
        if (!eClassifier) {
            return "";
        }
        if (typeof eClassifier === "string") {
            return eClassifier;
        }
        return `${eClassifier.package.value.nsPrefix}::${eClassifier.name}`;
    }

};
