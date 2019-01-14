function unresizableCell(value, geometry, style) {
	mxCell.call(this, value, geometry, style);
};

/**
 * Extends mxGeometry.
 */
unresizableCell.prototype = new mxCell();
unresizableCell.prototype.constructor = resizableCell;


unresizableCell.prototype.resizable = false;
