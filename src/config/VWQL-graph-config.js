class VWQLGraphConfig {
    static isAutoSizeCell(cell) {
        return this.isSwimlane(cell);
    }

    static isSwimlane(cell) {
        return cell !== null && cell.isSwimlane !== undefined && cell.isSwimlane === 1;
    }

    static isSameTamplate(cell, template) {
        return mxUtils.isNode(this.model.getValue(cell), template);
    }

    static isAllowOverlapParent(cell) {
        return !this.isSwimlane(cell.parent);
    }

    static isValidRoot(cell) {
        return !this.isSwimlane(cell);
    }

    static isCellFoldable(cell, collapse) {
        return !this.isSwimlane(cell)
            && cell.getChildCount() > 0;
    }

    static getTooltipForCell(cell) {
        var href = cell.getAttribute('href');
        href = (href != null && href.length > 0) ?
            `<br>${href}` : '';
        var maxlen = 30;
        var desc = cell.getAttribute('description');
        if (desc == null || desc.length == 0) {
            desc = '';
        }
        else if (desc.length < maxlen) {
            desc = '<br>' + desc;
        }
        else {
            desc = '<br>' + desc.substring(0, maxlen) + '...';
        }
        return `<b>${cell.getAttribute('label')
            }</b> (${cell.getId()})${href}${desc
            }<br>Edges: ${cell.getEdgeCount()
            }<br>Children: ${cell.getChildCount()}`;
    }

    static convertValueToString(cell) {
        var template = cell.value.nodeName.toLowerCase();
        var label; 
        var nameTags;
        var type; 
        if (VWQLEditorConfig.isInTheList(["booleanliteral", "numberliteral"], template)) {
            return cell.value.getAttribute('value');
        }
        if (template === "enumliteral") {
            label = cell.value.getAttribute('value');
            nameTags = eCoreHandler.separatedNameTags(label);
            if (nameTags.length === 2) {
                return `${nameTags[1]}::${nameTags[2]}`;
            } 
            return "";            
        } 
        if (template === "stringliteral") {
            label = cell.value.getAttribute('value');
            return `"${label}"`;
        } 
        if (template === "pathexpression") {
            label = cell.value.getAttribute('edgeType');
            nameTags = eCoreHandler.separatedNameTags(label);
            if (nameTags.length === 2) {
                return `${nameTags[1]}`;
            }
            return "";
        }
        if (template === "variable") {
            label = cell.value.getAttribute('name');
            type = cell.value.getAttribute('type');
            nameTags = eCoreHandler.separatedNameTags(type);
            if (nameTags.length === 2) {
                return `${nameTags[1]}\n${label}`;
            }
            return `${label}`;
        }
        if (template !== "edge") {
            return cell.value.getAttribute('name');
        }
        return "";
    }

    static valueForCellChanged(cell, value) {
        var previous = null;
        
        if (isNaN(value.nodeType))
        {
            previous = cell.getAttribute('name');
            cell.setAttribute('name', value);
        }
        else
        {
            previous = cell.value;
            cell.value = value;
        }
        
        return previous;
    }

    static getFirstUnusedName(name, list) {
        var i = 0;
        var occupied = true;
        while (occupied) {
            occupied = list.indexOf(name + ++i) > -1;
        }
    
        var nameWithIndex = name + i;
        return nameWithIndex;
    }
}