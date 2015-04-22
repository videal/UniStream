/**
 * @interface
 */
function ContentProvider() {}

/**
 * @public
 * @param {String} tag
 * @param {Boolean} isInitial
 * @param {Number} count
 * @return {Promise}
 */
ContentProvider.prototype.consumeNewItems = function (tag, isInitial, count) {};

/**
 * @public
 * @param {String} tag
 * @param {Number} count
 * @return {Promise}
 */
ContentProvider.prototype.consumeOldItems = function (tag, count) {};
