class VWQLEditorConfig {
    static onInit(editor) {
        // Disables removing cells from parents
        this.graph.graphHandler.setRemoveCellsFromParent(false);
        this.showTasks();
        var graph = this["graph"];
        var model = graph.getModel();

        this.graph.graphHandler.moveCells = function(cells, dx, dy, clone, target, evt) {
            if (clone)
            {
                cells = this.graph.getCloneableCells(cells);
            }
            
            // Checking cells can be removed from parent
            if (target !== null 
                && this.shouldRemoveCellsFromParent(target, cells, evt))
            {
                target = null;
            }
            
            // Cloning into locked cells is not allowed
            clone = clone && !this.graph.isCellLocked(target || this.graph.getDefaultParent());
            
            // Passes all selected cells in order to correctly clone or move into
            // the target cell. The method checks for each cell if its movable.
            cells = this.graph.moveCells(cells, dx - this.graph.panDx / this.graph.view.scale,
                    dy - this.graph.panDy / this.graph.view.scale, clone, target, evt);
            
            if (this.isSelectEnabled() && this.scrollOnMove)
            {
                this.graph.scrollCellToVisible(cells[0]);
            }
                    
            // Selects the new cells if cells have been cloned
            if (clone)
            {
                this.graph.setSelectionCells(cells);
            }
        };

        this.graph.isValidDropTarget = function(cell, cells, evt)
        {            
            cells = cells != null ? cells : [];
            if (cells.length > 0 && cells[0].getParent() !== null) {
                return false;
            }
            for (var i = 0; i < cells.length; i++)
            {
                if (!VWQLEditorConfig.isProperParent(cells[i], cell)) {
                    return false;
                }        
            }

            return cell != null && ((this.isSplitEnabled() 
                && this.isSplitTarget(cell, cells, evt)) 
                || !this.model.isEdge(cell));          
        };

        // Adds new method for identifying a pool
        this.graph.isPool = function(cell)
        {            
            var parent = model.getParent(cell);
        
            return parent != null && model.getParent(parent) == model.getRoot();
        };

        // Applies size changes to siblings and parents
        new mxSwimlaneManager(graph);

        // Creates a stack depending on the orientation of the swimlane
        var layout = new mxStackLayout(graph, false);
        
        // Makes sure all children fit into the parent swimlane
        layout.resizeParent = true;
                    
        // Applies the size to children if parent size changes
        layout.fill = true;

        layout.horizontal = true;

        // Only update the size of swimlanes
        layout.isVertexIgnored = function(vertex)
        {
            var cellName = VWQLEditorConfig.getCellName(vertex);
            return !VWQLEditorConfig.isInTheList(["patternbody"], cellName);
            // return !graph.isSameTamplate(vertex, "patternbody");
        }
        
        // Keeps the lanes and pools stacked
        var layoutMgr = new mxLayoutManager(graph);

        layoutMgr.getLayout = function(cell)
        {
            // if (!model.isEdge(cell) && graph.getModel().getChildCount(cell) > 0 &&
            //     (model.getParent(cell) == model.getRoot() || graph.isPool(cell)))
            // {
                // layout.fill = graph.isPool(cell);
                // layout.fill = true;
                
                return layout;
            // }
            
            // return null;
        };

        // Keeps widths on collapse/expand					
        var foldingHandler = function(sender, evt)
        {
            var cells = evt.getProperty('cells');
            
            for (var i = 0; i < cells.length; i++)
            {
                var geo = graph.model.getGeometry(cells[i]);

                if (geo.alternateBounds != null)
                {
                    geo.width = geo.alternateBounds.width;
                }
            }
        };

        graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);

        
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        graph.getStylesheet().putCellStyle('pattern', style);

        PortConfig.onInit(this);

        // graph.isCellEditable = function(cell)
        // {
        //     return !this.model.isEdge(cell);
        // };

        var oldIsCellMovable = graph.isCellMovable;
        graph.isCellMovable = function(cell)
        {
            return oldIsCellMovable.apply(this, arguments) 
                && !this.model.isEdge(cell);
        };

        var oldValidateConnection = graph.connectionHandler.validateConnection;
        graph.connectionHandler.validateConnection = function(source, target)
        {
            // TODO make validation
            // return '';
            return oldValidateConnection.apply(this, arguments);
        };

        graph.setAllowDanglingEdges(false);

        graph.dblClick = function(evt, cell) {
            // Do not fire a DOUBLE_CLICK event here as mxEditor will
            // consume the event and start the in-place editor.

            if (this.isEnabled() 
                && !mxEvent.isConsumed(evt) 
                && cell != null 
                && this.isCellEditable(cell)) {              
                    editor.showProperties(cell);             
            }
        };
    }

    static isProperParent(cell, parent) {
        var cellName = this.getCellName(cell);
        var parentName = this.getCellName(parent);
        switch (cellName) {
            case "symbol":
                return this.isInTheList(["pattern"], parentName);
            
            case "pattern":
                return this.isInTheList(["pattern"], parentName);
            case "parameter":
                return this.isInTheList(["pattern"], parentName);
            case "patternbody":
                return this.isInTheList(["pattern"], parentName);
            

            case "pathexpression":
                return this.isInTheList(["patternbody"], parentName);
            case "compare":
                return this.isInTheList(["patternbody"], parentName);
            case "check":
                return this.isInTheList(["patternbody"], parentName);
            case "patterncomposition":
                return this.isInTheList(["patternbody"], parentName);

            default:
                return true;
        }
    }

    static isInTheList(array, str) {
        return array.indexOf(str) >= 0;
    }

    static getCellName(cell) {
        return cell.value.nodeName.toLowerCase();
    }

    static isAutoSizeCell(cell) {
        return this.isSwimlane(cell);
    }

    static saveGraph(editor) {
        if (editor.graph.isEditing())
        {
            editor.graph.stopEditing();
        }

        var encoder = new mxCodec();
        var node = encoder.encode(editor.graph.getModel());

        var vwql = VwqlUtils.getElementByID(editor.graph, "0");
        var vwqlName = "vwqlGraph";
        if (vwql != null) {
            vwqlName = vwql.getAttribute("name") || vwqlName;
        }
        vwqlName = vwqlName.concat(".xml");

        var xml = mxUtils.getPrettyXml(node);

        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xml));
        pom.setAttribute('download', vwqlName);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }        
    }

    static open(editor) {
        editor.createImportFile();
    }

    static openHref(editor, cell) {
        cell = cell || editor.graph.getSelectionCell();

        if (cell == null) {
            cell = editor.graph.getCurrentRoot();

            if (cell == null) {
                cell = editor.graph.getModel().getRoot();
            }
        }

        if (cell != null) {
            var href = cell.getAttribute('href');

            if (href != null && href.length > 0) {
                window.open(href);
            }
            else {
                mxUtils.alert('No URL defined. Showing properties...');
                editor.execute('showProperties', cell);
            }
        }
    }

    static editStyle(editor) {
        var cell = editor.graph.getSelectionCell();

        if (cell != null) {
            var model = editor.graph.getModel();
            var style = mxUtils.prompt(mxResources.get('enterStyle'), model.getStyle(cell) || '');

            if (style != null) {
                model.setStyle(cell, style);
            }
        }
    }

    static fillColor(editor) {
        var color = mxUtils.prompt(mxResources.get('enterColorname'), 'red');

        if (color != null) {
            editor.graph.model.beginUpdate();
            try {
                editor.graph.setCellStyles("strokeColor", color);
                editor.graph.setCellStyles("fillColor", color);
            }
            finally {
                editor.graph.model.endUpdate();
            }
        }
    }

    static gradientColor(editor) {
        var color = mxUtils.prompt(mxResources.get('enterColorname'), 'white');

        if (color != null) {
            editor.graph.setCellStyles("gradientColor", color);
        }
    }

    static strokeColor(editor) {
        var color = mxUtils.prompt(mxResources.get('enterColorname'), 'red');

        if (color != null) {
            editor.graph.setCellStyles("strokeColor", color);
        }
    }

    static fontColor(editor) {
        var color = mxUtils.prompt(mxResources.get('enterColorname'), 'red');

        if (color != null) {
            editor.graph.setCellStyles("fontColor", color);
        }
    }

    static fontFamily(editor) {
        var family = mxUtils.prompt(mxResources.get('enterFontfamily'), 'Arial');

        if (family != null && family.length > 0) {
            editor.graph.setCellStyles("fontFamily", family);
        }
    }

    static fontSize(editor) {
        var size = mxUtils.prompt(mxResources.get('enterFontsize'), '10');

        if (size != null && size > 0 && size < 999) {
            editor.graph.setCellStyles("fontSize", size);
        }
    }

    static image(editor) {
        var image = mxUtils.prompt(mxResources.get('enterImageUrl'),
            'examples/images/image.gif');

        if (image != null) {
            editor.graph.setCellStyles("image", image);
        }
    }

    static opacity(editor) {
        var opacity = mxUtils.prompt(mxResources.get('enterOpacity'), '100');

        if (opacity != null && opacity >= 0 && opacity <= 100) {
            editor.graph.setCellStyles("opacity", opacity);
        }
    }

    static straightConnector(editor) {
        editor.graph.setCellStyle("straightEdge");
    }

    static elbowConnector(editor) {
        editor.graph.setCellStyle("");
    }

    static arrowConnector(editor) {
        editor.graph.setCellStyle("arrowEdge");
    }

    static toggleOrientation(editor, cell) {
        editor.graph.toggleCellStyles(mxConstants.STYLE_HORIZONTAL, true);
    }

    static toggleRounded(editor) {
        editor.graph.toggleCellStyles(mxConstants.STYLE_ROUNDED);
    }

    static toggleShadow(editor) {
        editor.graph.toggleCellStyles(mxConstants.STYLE_SHADOW);
    }

    static horizontalTree(editor, cell) {
        cell = cell || editor.graph.getSelectionCell();

        if (cell == null) {
            cell = editor.graph.getDefaultParent();
        }

        editor.treeLayout(cell, true);
    }

    static verticalTree(editor, cell) {
        cell = cell || editor.graph.getSelectionCell();

        if (cell == null) {
            cell = editor.graph.getDefaultParent();
        }

        editor.treeLayout(cell, false);
    }

    static defaultConnect(editor) {
        editor.defaultEdge = editor.templates["edge"];
        
        if (editor.defaultEdge != null) {
            editor.defaultEdge.style = null;
        }
    }

    static straightConnect(editor) {
        editor.defaultEdge = editor.templates["edge"];

        if (editor.defaultEdge != null) {
            editor.defaultEdge.style = 'straightEdge';
        }
    }

    static pathExpressionConnect(editor) {
        editor.defaultEdge = editor.templates["pathexpression"];
    }

    static createTasks(div) {
        var off = 30;
        
        if (this.graph != null)
        {
            var layer = this.graph.model.root.getChildAt(0);
            mxUtils.para(div,  mxResources.get('examples'));
            mxUtils.linkInvoke(div, mxResources.get('newDiagram'), this,
                'open', 'diagrams/empty.xml', off);
            mxUtils.br(div);
            mxUtils.linkInvoke(div, mxResources.get('swimlanes'), this,
                'open', 'diagrams/FirstVWQL.xml', off);
            mxUtils.br(div);
            
            if (!this.graph.isSelectionEmpty())
            {
                var cell = this.graph.getSelectionCell();
                if (this.graph.getSelectionCount() == 1 &&
                    (this.graph.model.isVertex(cell) &&
                    cell.getEdgeCount() > 0) || this.graph.isSwimlane(cell))
                {
                    mxUtils.para(div, 'Layout');
                    mxUtils.linkAction(div, mxResources.get('verticalTree'),
                        this, 'verticalTree', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('horizontalTree'),
                        this, 'horizontalTree', off);
                    mxUtils.br(div);
                }
                
                mxUtils.para(div, 'Format');
                
                if (mxUtils.isNode(cell.value, 'Symbol'))
                {
                    mxUtils.linkAction(div, mxResources.get('image'),
                        this, 'image', off);
                    mxUtils.br(div);
                }
                else
                {
                    mxUtils.linkAction(div, mxResources.get('opacity'),
                        this, 'opacity', off);
                    mxUtils.br(div);
                    if (this.graph.model.isVertex(cell) ||
                        (cell.style != null && 
                        cell.style.indexOf("arrowEdge") >= 0))
                    {
                        mxUtils.linkAction(div, mxResources.get('gradientColor'),
                            this, 'gradientColor', off);
                        mxUtils.br(div);
                    }
                    if (this.graph.model.isEdge(cell))
                    {
                        mxUtils.linkAction(div, 'Straight Connector', this, 'straightConnector', off);
                        mxUtils.br(div);
                        mxUtils.linkAction(div, 'Elbow Connector', this, 'elbowConnector', off);
                        mxUtils.br(div);
                        mxUtils.linkAction(div, 'Arrow Connector', this, 'arrowConnector', off);
                        mxUtils.br(div);
                    }
                }
                
                mxUtils.linkAction(div, 'Rounded', this, 'toggleRounded', off);
                mxUtils.br(div);
                if (this.graph.isSwimlane(cell) || this.graph.model.isEdge(cell))
                {
                    mxUtils.linkAction(div, 'Orientation', this, 'toggleOrientation', off);
                    mxUtils.br(div);
                }
                
                if (this.graph.getSelectionCount() > 1)
                {
                    mxUtils.para(div, mxResources.get('align'));
                    mxUtils.linkAction(div, mxResources.get('left'),
                        this, 'alignCellsLeft', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('center'),
                        this, 'alignCellsCenter', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('right'),
                        this, 'alignCellsRight', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('top'),
                        this, 'alignCellsTop', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('middle'),
                        this, 'alignCellsMiddle', off);
                    mxUtils.br(div);
                    mxUtils.linkAction(div, mxResources.get('bottom'),
                        this, 'alignCellsBottom', off);
                    mxUtils.br(div);
                }
                
                mxUtils.para(div, mxResources.get('selection'));
                mxUtils.linkAction(div, mxResources.get('clearSelection'),
                    this, 'selectNone', off);
                mxUtils.br(div);
            }
            else if (layer.getChildCount() > 0)
            {
                mxUtils.para(div, mxResources.get('selection'));
                mxUtils.linkAction(div, mxResources.get('selectAll'),
                    this, 'selectAll', off);
                mxUtils.br(div);
            }
            
            mxUtils.br(div);
        }
    }
}
