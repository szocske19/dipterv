function connectableCell(value, geometry, style) {
	mxCell.call(this, value, geometry, style);
};

/**
 * Extends mxGeometry.
 */
connectableCell.prototype = new mxCell();
connectableCell.prototype.constructor = connectableCell;


connectableCell.prototype.connectable = true;
