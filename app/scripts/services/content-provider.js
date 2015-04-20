/**
 * @interface
 */
function ContentProvider() {}

/**
 * @public
 * @param {String} tag
 * @param {Date} startDate
 * @return {Promise}
 */
ContentProvider.prototype.getItems = function (tag, startDate) {};
