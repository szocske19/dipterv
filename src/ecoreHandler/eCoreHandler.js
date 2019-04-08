var eCoreHandler = {

    eCores: [],


    getECores() {
        return eCoreHandler.eCores;
    },
 
    addECore(eCore) {        
        eCore.value.eClassifiers.forEach( (eClassifier) => { eClassifier.package = eCore});
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

    getEClassifierNames() {
        var allECoreNames = [];

        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            var nsPrefix = eCoreHandler.eCores[i].value.nsPrefix;
            var eCoreNames = eCoreHandler.eCores[i].value.eClassifiers.map(eClassifier => `${nsPrefix}::${eClassifier.name}`);
            allECoreNames = allECoreNames.concat(eCoreNames);
        }
        return allECoreNames;
    },

    getEClassifierByName(name) {
        if (!name) {
            return undefined;
        }

        var separation = name.search('::');
        var prefix = "";
        var classifier = name;
        if (separation >= 0) {
            prefix = name.substring(0, separation);
            classifier = name.substring(separation + 2, name.length);
        }

        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            if (prefix === eCoreHandler.eCores[i].value.nsPrefix) {
                return eCoreHandler.eCores[i].value.eClassifiers.find(o => o.name === classifier);
            }
        }
        return undefined;
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

    getAllEReferencesOfClassifier(eClassifier) {
        var allEReferences = [];
        var eClassifiers = eCoreHandler.getAllSuperTypes(eClassifier);
        eClassifiers.push(eClassifier);
        if (eClassifiers) {
            for (var i = 0; i < eClassifiers.length; i++) {
                if (eClassifiers[i]) {
                    var eReferences = eCoreHandler.getEReferences(eClassifiers[i]);
                    allEReferences = allEReferences.concat(eReferences);
                }
            }
        }

        return allEReferences;
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
        return eReferences.map(eReference => `${eReference.source.package.value.nsPrefix}::${eReference.name}`);
    },

};
