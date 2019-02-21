class VWQLGraphConfig {
    static isAutoSizeCell(cell) {
        return this.isSwimlane(cell);
    }

    static isSwimlane(cell) {
        return this.isSameTamplate(cell, 'swimlane');
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
        return cell.getAttribute('label');
    }

}