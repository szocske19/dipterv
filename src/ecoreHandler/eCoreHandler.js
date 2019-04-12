var eCoreHandler = {

    eCores: [],


    getECores() {
        return eCoreHandler.eCores;
    },
 
    addECore(eCore) {
        for (var i = 0; i < eCore.value.eClassifiers.length; i++) {
            eCore.value.eClassifiers[i].package = eCore;
            var eClassifier = eCore.value.eClassifiers[i];
            if (eClassifier.eStructuralFeatures) {
                for (var j = 0; j < eClassifier.eStructuralFeatures.length; j++) {
                    eClassifier.eStructuralFeatures[j].source = eClassifier;
                }
            }
        }
        eCoreHandler.eCores.push(eCore);
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
        return eClassifiers.map(eClassifier => `${eClassifier.package.value.nsPrefix}::${eClassifier.name}`);
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
                var superTypeName = eClassifier.eSuperTypes[i].substring(3, eClassifier.eSuperTypes[i].length);
                var nsPrefix = eClassifier.package.value.nsPrefix;
                var superType = eCoreHandler.getEClassifierByName(`${nsPrefix}::${superTypeName}`);
                eClassifiers.push(superType);
            }
        }
        return eClassifiers;
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
        var eClassifiers = eCoreHandler.getAllSuperTypes(eClassifier);
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
        return eReferences.map(eReference => `${eReference.source.name}::${eReference.name}`);
    },

};
