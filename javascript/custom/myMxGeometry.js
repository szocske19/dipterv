function myMxGeometry(x, y, width, height)
{
	mxGeometry.call(this, x, y, width, height);
};

/**
 * Extends mxGeometry.
 */
myMxGeometry.prototype = new mxGeometry();
myMxGeometry.prototype.constructor = myMxGeometry;
