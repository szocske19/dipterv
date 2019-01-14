function resizableCell(value, geometry, style) {
	mxCell.call(this, value, geometry, style);
};

/**
 * Extends mxGeometry.
 */
resizableCell.prototype = new mxCell();
resizableCell.prototype.constructor = resizableCell;


resizableCell.prototype.resizable = true;
