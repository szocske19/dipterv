var eCoreHandler = 
{

    eCores: [],


    getECores: function() {
        return eCoreHandler.eCores;
    },
 
    addECore: function(eCore) {
        eCoreHandler.eCores.push(eCore);
    },

    getEClassifiers: function() {
        var allECoreNames = [];

        // getNames = function(eClassifier, nsURI) {
        //     return nsURI + eClassifier.name;
        // };

        for (var i = 0; i < eCoreHandler.eCores.length; i++) {
            var nsPrefix = eCoreHandler.eCores[i].value.nsPrefix;
            var eCoreNames = eCoreHandler.eCores[i].value.eClassifiers.map(function(eClassifier) {
                return nsPrefix + "::" + eClassifier.name;
            });
            allECoreNames = allECoreNames.concat(eCoreNames);
        }
        return allECoreNames;
    }    
}