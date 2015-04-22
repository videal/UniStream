/**
 * @interface
 */
function ContentProvider() {}

/**
 * @public
 * @param {String} tag
 * @param {Boolean} isInitial
 * @return {Promise}
 */
ContentProvider.prototype.consumeNewItems = function (tag, isInitial) {};

/**
 * @public
 * @param {String} tag
 * @return {Promise}
 */
ContentProvider.prototype.consumeOldItems = function (tag) {};
