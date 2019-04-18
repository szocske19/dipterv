var eCoreHandler = {

    eCores: [],


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
                            console.log("Can't find reference");
                        }
                    }
                }
            }
        }
        this.calulateSubtypeLeafs();
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
        if (typeof eClassifier1 === "string" || typeof eClassifier2 === "string") {
            return false;
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
        // TODO handle cross reference
        var nsPrefix = eClassifier.package.value.nsPrefix;
        var stringTags = stringRef.split('#//');

        if (stringTags.length === 2) {
            if (this.isPrimitivType(stringTags[1])) {
                return stringTags[1];
            }
            for (var i = 0; i < eCoreHandler.eCores.length; i++) {
                if (nsPrefix === eCoreHandler.eCores[i].value.nsPrefix) {
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
            
            //TODO examine whether this is all variables (ecore.ecore)
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
        var allEReferences = [];
        var eClassifiers = eClassifier.superTypeRef.slice();
        eClassifiers.push(eClassifier);
        if (eClassifiers) {
            for (var i = 0; i < eClassifiers.length; i++) {
                if (eClassifiers[i]) {
                    var eReferences = getFunction(eClassifiers[i]);
                    allEReferences = allEReferences.concat(eReferences);
                }
            }
        }

        return allEReferences;
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
        return `${eClassifier.package.value.nsPrefix}::${eClassifier.name}`;
    }

};
