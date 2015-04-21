/**
 * @interface
 */
function ContentProvider() {}

/**
 * @public
 * @param {String} tag
 * @return {Promise}
 */
ContentProvider.prototype.consumeNewItems = function (tag) {};

/**
 * @public
 * @param {String} tag
 * @return {Promise}
 */
ContentProvider.prototype.consumeOldItems = function (tag) {};
