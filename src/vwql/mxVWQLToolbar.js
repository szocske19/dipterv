function mxVWQLToolbar(container, editor) {
	mxDefaultToolbar.call(this, container, editor);
};

/**
 * Extends mxGeometry.
 */
mxVWQLToolbar.prototype = new mxDefaultToolbar();
mxVWQLToolbar.prototype.constructor = mxVWQLToolbar;
