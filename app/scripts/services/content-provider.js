/**
 * @interface
 */
function ContentProvider() {}

/**
 * @public
 * @param {String} tag
 * @param {Boolean} is_initial
 * @return {Promise}
 */
ContentProvider.prototype.consumeNewItems = function (tag, is_initial) {};

/**
 * @public
 * @param {String} tag
 * @return {Promise}
 */
ContentProvider.prototype.consumeOldItems = function (tag) {};
