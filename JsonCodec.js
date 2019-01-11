/******************************************************************
Core
******************************************************************/

class JsonCodec extends mxObjectCodec {
    constructor() {
      super((value)=>{});
    }
    encode(value) {
        const xmlDoc = mxUtils.createXmlDocument();
        const newObject = xmlDoc.createElement("Object");
        for(let prop in value) {
          newObject.setAttribute(prop, value[prop]);
        }
        return newObject;
    }
    decode(model) {
      return Object.keys(model.cells).map(
        (iCell)=>{
          const currentCell = model.getCell(iCell);
          return (currentCell.value !== undefined)? currentCell : null;
        }
      ).filter((item)=> (item !== null));
    }
}

class GraphX {
  constructor(container){
			if (!mxClient.isBrowserSupported()) {
				  return mxUtils.error('Browser is not supported!', 200, false);
			}
      mxEvent.disableContextMenu(container);
      this._graph = new mxGraph(container);
      this._graph.setConnectable(true);
      this._graph.setAllowDanglingEdges(false);
      new mxRubberband(this._graph); // Enables rubberband selection

      this.labelDisplayOveride();
      this.styling();
  }

  labelDisplayOveride() { // Overrides method to provide a cell label in the display
    this._graph.convertValueToString = (cell)=> {
      if (mxUtils.isNode(cell.value)) {
        if (cell.value.nodeName.toLowerCase() === 'object') {
          const name = cell.getAttribute('name', '');
          return name;
        }
      }
      return '';
    };
  }

  styling() {
    // Creates the default style for vertices
    let style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FILLCOLOR] = '#EEEEEE';
    style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    this._graph.getStylesheet().putDefaultVertexStyle(style);

    // Creates the default style for edges
    style = this._graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_STROKECOLOR] = '#0C0C0C';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '10';
    this._graph.getStylesheet().putDefaultEdgeStyle(style);
  }

  getJsonModel(){
      const encoder = new JsonCodec();
      const jsonModel = encoder.decode(this._graph.getModel());
      return {
        "graph": jsonModel
      }
  }

  render(dataModel) {
        const jsonEncoder = new JsonCodec();

        this._vertices = {};
        this._dataModel = dataModel;

				const parent = this._graph.getDefaultParent();
				this._graph.getModel().beginUpdate(); // Adds cells to the model in a single step
				try {

          this._dataModel.graph.map(
            (node)=> {
                if(node.value) {
                  if(typeof node.value === "object") {
                       const xmlNode = jsonEncoder.encode(node.value);
                       this._vertices[node.id] = this._graph.insertVertex(parent, null, xmlNode, node.geometry.x, node.geometry.y, node.geometry.width, node.geometry.height);
                  } else if(node.value === "Edge") {
                       this._graph.insertEdge(parent, null, 'Edge', this._vertices[node.source],  this._vertices[node.target])
                  }
                }
            }
          );

				} finally {
					this._graph.getModel().endUpdate(); // Updates the display
        }
  }
}

/******************************************
Utils
********************************************/

function stringifyWithoutCircular(json){
  return JSON.stringify(
      json,
      ( key, value) => {
        if((key === 'parent' || key == 'source' || key == 'target') && value !== null) {
          return value.id;
        } else if(key === 'value' && value !== null && value.localName) {
          let results = {};
          Object.keys(value.attributes).forEach(
            (attrKey)=>{
              const attribute = value.attributes[attrKey];
              results[attribute.nodeName] = attribute.nodeValue;
            }
          )
          return results;
        }
        return value;
      },
      4
  );
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
