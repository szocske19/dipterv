var ecore_Module_Factory = function () {
  var ecore = {
    name: 'ecore',
    defaultElementNamespaceURI: 'http:\/\/www.eclipse.org\/emf\/2002\/Ecore',
    typeInfos: [{
        localName: 'EParameter',
        baseTypeInfo: '.ETypedElement'
      }, {
        localName: 'EEnumLiteral',
        baseTypeInfo: '.ENamedElement',
        propertyInfos: [{
            name: 'value',
            attributeName: {
              localPart: 'value'
            },
            type: 'attribute'
          }, {
            name: 'instance',
            attributeName: {
              localPart: 'instance'
            },
            type: 'attribute'
          }, {
            name: 'literal',
            attributeName: {
              localPart: 'literal'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EStringToStringMapEntry',
        propertyInfos: [{
            name: 'key',
            attributeName: {
              localPart: 'key'
            },
            type: 'attribute'
          }, {
            name: 'value',
            attributeName: {
              localPart: 'value'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EAnnotation',
        baseTypeInfo: '.EModelElement',
        propertyInfos: [{
            name: 'details',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'details'
            },
            typeInfo: '.EStringToStringMapEntry'
          }, {
            name: 'contents',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'contents'
            },
            typeInfo: 'AnyType'
          }, {
            name: 'source',
            attributeName: {
              localPart: 'source'
            },
            type: 'attribute'
          }, {
            name: 'references',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'references'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EGenericType',
        propertyInfos: [{
            name: 'eUpperBound',
            elementName: {
              localPart: 'eUpperBound'
            },
            typeInfo: '.EGenericType'
          }, {
            name: 'eTypeArguments',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eTypeArguments'
            },
            typeInfo: '.EGenericType'
          }, {
            name: 'eLowerBound',
            elementName: {
              localPart: 'eLowerBound'
            },
            typeInfo: '.EGenericType'
          }, {
            name: 'eRawType',
            attributeName: {
              localPart: 'eRawType'
            },
            type: 'attribute'
          }, {
            name: 'eTypeParameter',
            typeInfo: 'IDREF',
            attributeName: {
              localPart: 'eTypeParameter'
            },
            type: 'attribute'
          }, {
            name: 'eClassifier',
            attributeName: {
              localPart: 'eClassifier'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EClassifier',
        baseTypeInfo: '.ENamedElement',
        propertyInfos: [{
            name: 'eTypeParameters',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eTypeParameters'
            },
            typeInfo: '.ETypeParameter'
          }, {
            name: 'instanceClassName',
            attributeName: {
              localPart: 'instanceClassName'
            },
            type: 'attribute'
          }, {
            name: 'instanceClass',
            attributeName: {
              localPart: 'instanceClass'
            },
            type: 'attribute'
          }, {
            name: 'defaultValue',
            attributeName: {
              localPart: 'defaultValue'
            },
            type: 'attribute'
          }, {
            name: 'instanceTypeName',
            attributeName: {
              localPart: 'instanceTypeName'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EStructuralFeature',
        baseTypeInfo: '.ETypedElement',
        propertyInfos: [{
            name: 'changeable',
            attributeName: {
              localPart: 'changeable'
            },
            type: 'attribute'
          }, {
            name: '_volatile',
            attributeName: {
              localPart: 'volatile'
            },
            type: 'attribute'
          }, {
            name: '_transient',
            attributeName: {
              localPart: 'transient'
            },
            type: 'attribute'
          }, {
            name: 'defaultValueLiteral',
            attributeName: {
              localPart: 'defaultValueLiteral'
            },
            type: 'attribute'
          }, {
            name: 'defaultValue',
            attributeName: {
              localPart: 'defaultValue'
            },
            type: 'attribute'
          }, {
            name: 'unsettable',
            attributeName: {
              localPart: 'unsettable'
            },
            type: 'attribute'
          }, {
            name: 'derived',
            attributeName: {
              localPart: 'derived'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EClass',
        baseTypeInfo: '.EClassifier',
        propertyInfos: [{
            name: 'eOperations',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eOperations'
            },
            typeInfo: '.EOperation'
          }, {
            name: 'eStructuralFeatures',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eStructuralFeatures'
            },
            typeInfo: '.EStructuralFeature'
          }, {
            name: 'eGenericSuperTypes',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eGenericSuperTypes'
            },
            typeInfo: '.EGenericType'
          }, {
            name: '_abstract',
            attributeName: {
              localPart: 'abstract'
            },
            type: 'attribute'
          }, {
            name: '_interface',
            attributeName: {
              localPart: 'interface'
            },
            type: 'attribute'
          }, {
            name: 'eSuperTypes',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eSuperTypes'
            },
            type: 'attribute'
          }, {
            name: 'eAllAttributes',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllAttributes'
            },
            type: 'attribute'
          }, {
            name: 'eAllReferences',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllReferences'
            },
            type: 'attribute'
          }, {
            name: 'eReferences',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eReferences'
            },
            type: 'attribute'
          }, {
            name: 'eAttributes',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAttributes'
            },
            type: 'attribute'
          }, {
            name: 'eAllContainments',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllContainments'
            },
            type: 'attribute'
          }, {
            name: 'eAllOperations',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllOperations'
            },
            type: 'attribute'
          }, {
            name: 'eAllStructuralFeatures',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllStructuralFeatures'
            },
            type: 'attribute'
          }, {
            name: 'eAllSuperTypes',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllSuperTypes'
            },
            type: 'attribute'
          }, {
            name: 'eidAttribute',
            typeInfo: 'IDREF',
            attributeName: {
              localPart: 'eIDAttribute'
            },
            type: 'attribute'
          }, {
            name: 'eAllGenericSuperTypes',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eAllGenericSuperTypes'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EFactory',
        baseTypeInfo: '.EModelElement',
        propertyInfos: [{
            name: 'ePackage',
            typeInfo: 'IDREF',
            attributeName: {
              localPart: 'ePackage'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EReference',
        baseTypeInfo: '.EStructuralFeature',
        propertyInfos: [{
            name: 'containment',
            attributeName: {
              localPart: 'containment'
            },
            type: 'attribute'
          }, {
            name: 'container',
            attributeName: {
              localPart: 'container'
            },
            type: 'attribute'
          }, {
            name: 'resolveProxies',
            attributeName: {
              localPart: 'resolveProxies'
            },
            type: 'attribute'
          }, {
            name: 'eOpposite',
            attributeName: {
              localPart: 'eOpposite'
            },
            type: 'attribute'
          }, {
            name: 'eReferenceType',
            attributeName: {
              localPart: 'eReferenceType'
            },
            type: 'attribute'
          }, {
            name: 'eKeys',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eKeys'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EAttribute',
        baseTypeInfo: '.EStructuralFeature',
        propertyInfos: [{
            name: 'id',
            attributeName: {
              localPart: 'iD'
            },
            type: 'attribute'
          }, {
            name: 'eAttributeType',
            attributeName: {
              localPart: 'eAttributeType'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ETypeParameter',
        baseTypeInfo: '.ENamedElement',
        propertyInfos: [{
            name: 'eBounds',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eBounds'
            },
            typeInfo: '.EGenericType'
          }]
      }, {
        localName: 'EDataType',
        baseTypeInfo: '.EClassifier',
        propertyInfos: [{
            name: 'serializable',
            attributeName: {
              localPart: 'serializable'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EModelElement',
        propertyInfos: [{
            name: 'eAnnotations',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eAnnotations'
            },
            typeInfo: '.EAnnotation'
          }]
      }, {
        localName: 'EPackage',
        baseTypeInfo: '.ENamedElement',
        propertyInfos: [{
            name: 'eClassifiers',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eClassifiers'
            },
            typeInfo: '.EClassifier'
          }, {
            name: 'eSubpackages',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eSubpackages'
            },
            typeInfo: '.EPackage'
          }, {
            name: 'nsURI',
            attributeName: {
              localPart: 'nsURI'
            },
            type: 'attribute'
          }, {
            name: 'nsPrefix',
            attributeName: {
              localPart: 'nsPrefix'
            },
            type: 'attribute'
          }, {
            name: 'eFactoryInstance',
            typeInfo: 'IDREF',
            attributeName: {
              localPart: 'eFactoryInstance'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EObject'
      }, {
        localName: 'ENamedElement',
        baseTypeInfo: '.EModelElement',
        propertyInfos: [{
            name: 'name',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ETypedElement',
        baseTypeInfo: '.ENamedElement',
        propertyInfos: [{
            name: 'eGenericType',
            elementName: {
              localPart: 'eGenericType'
            },
            typeInfo: '.EGenericType'
          }, {
            name: 'ordered',
            attributeName: {
              localPart: 'ordered'
            },
            type: 'attribute'
          }, {
            name: 'unique',
            attributeName: {
              localPart: 'unique'
            },
            type: 'attribute'
          }, {
            name: 'lowerBound',
            attributeName: {
              localPart: 'lowerBound'
            },
            type: 'attribute'
          }, {
            name: 'upperBound',
            attributeName: {
              localPart: 'upperBound'
            },
            type: 'attribute'
          }, {
            name: 'many',
            attributeName: {
              localPart: 'many'
            },
            type: 'attribute'
          }, {
            name: 'required',
            attributeName: {
              localPart: 'required'
            },
            type: 'attribute'
          }, {
            name: 'eType',
            attributeName: {
              localPart: 'eType'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EEnum',
        baseTypeInfo: '.EDataType',
        propertyInfos: [{
            name: 'eLiterals',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eLiterals'
            },
            typeInfo: '.EEnumLiteral'
          }]
      }, {
        localName: 'EOperation',
        baseTypeInfo: '.ETypedElement',
        propertyInfos: [{
            name: 'eTypeParameters',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eTypeParameters'
            },
            typeInfo: '.ETypeParameter'
          }, {
            name: 'eParameters',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eParameters'
            },
            typeInfo: '.EParameter'
          }, {
            name: 'eGenericExceptions',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'eGenericExceptions'
            },
            typeInfo: '.EGenericType'
          }, {
            name: 'eExceptions',
            typeInfo: {
              type: 'list'
            },
            attributeName: {
              localPart: 'eExceptions'
            },
            type: 'attribute'
          }]
      }],
    elementInfos: [{
        elementName: 'EStringToStringMapEntry',
        typeInfo: '.EStringToStringMapEntry'
      }, {
        elementName: 'EFactory',
        typeInfo: '.EFactory'
      }, {
        elementName: 'EParameter',
        typeInfo: '.EParameter'
      }, {
        elementName: 'EOperation',
        typeInfo: '.EOperation'
      }, {
        elementName: 'EEnumLiteral',
        typeInfo: '.EEnumLiteral'
      }, {
        elementName: 'ENamedElement',
        typeInfo: '.ENamedElement'
      }, {
        elementName: 'EStructuralFeature',
        typeInfo: '.EStructuralFeature'
      }, {
        elementName: 'ETypedElement',
        typeInfo: '.ETypedElement'
      }, {
        elementName: 'EClass',
        typeInfo: '.EClass'
      }, {
        elementName: 'EDataType',
        typeInfo: '.EDataType'
      }, {
        elementName: 'EObject',
        typeInfo: 'AnyType'
      }, {
        elementName: 'EAnnotation',
        typeInfo: '.EAnnotation'
      }, {
        elementName: 'EPackage',
        typeInfo: '.EPackage'
      }, {
        elementName: 'EGenericType',
        typeInfo: '.EGenericType'
      }, {
        elementName: 'ETypeParameter',
        typeInfo: '.ETypeParameter'
      }, {
        elementName: 'EClassifier',
        typeInfo: '.EClassifier'
      }, {
        elementName: 'EReference',
        typeInfo: '.EReference'
      }, {
        elementName: 'EModelElement',
        typeInfo: '.EModelElement'
      }, {
        elementName: 'EEnum',
        typeInfo: '.EEnum'
      }, {
        elementName: 'EAttribute',
        typeInfo: '.EAttribute'
      }]
  };
  return {
    ecore: ecore
  };
};
if (typeof define === 'function' && define.amd) {
  define([], ecore_Module_Factory);
}
else {
  var ecore_Module = ecore_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.ecore = ecore_Module.ecore;
  }
  else {
    var ecore = ecore_Module.ecore;
  }
}