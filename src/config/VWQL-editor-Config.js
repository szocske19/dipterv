class VWQLEditorConfig {
    static onInit() {
        // Disables removing cells from parents
        this.graph.graphHandler.setRemoveCellsFromParent(false);
        this.showTasks();

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

        var oisValidDropTarget = this.graph.isValidDropTarget;
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
            return oisValidDropTarget.apply(this, arguments);            
        };

        PortConfig.onInit(this);
    }

    static isProperParent(cell, parent) {
        var cellName = this.getCellName(cell);
        var parentName = this.getCellName(parent);
        switch (cellName) {
            case "symbol":
                //return parentName === "swimlane" || parentName === "task" || parentName === "process";
                return true;
            default:
                return false;
        }
    }

    static getCellName(cell) {
        return cell.value.nodeName.toLowerCase();
    }

    static isAutoSizeCell(cell) {
        return this.isSwimlane(cell);
    }

    static open(editor) {
        editor.open(mxUtils.prompt('Enter filename', 'workflow.xml'));
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
}
