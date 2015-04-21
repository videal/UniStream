'use strict';

angular.module('app')
    .factory('tagStorage', [function () {
        return new TagStorage();
    }]);

/**
 * @class
 * @constructor
 */
function TagStorage() {
    /**
     * @private
     * @type {Array}
     */
    this.tags = [
        {name: 'love'},
        {name: 'GabeNewell'},
        {name: 'RickAstley'}
    ];
}

/**
 * @public
 * @return {Array}
 */
TagStorage.prototype.findAll = function () {
    return this.tags;
};

/**
 * @public
 * @param {String} name
 * @return {Objec|null}
 */
TagStorage.prototype.findOne = function (name) {
    for (var i in this.tags) {
        if (this.tags[i].name == name) {
            return this.tags[i];
        }
    }
    
    return null;
};

/**
 * @public
 * @param {Object} tag
 * @return {undefined}
 */
TagStorage.prototype.add = function (tag) {
    this.tags.push(tag);
};

/**
 * @public
 * @param {Object} tag
 * @return {undefined}
 */
TagStorage.prototype.remove = function (tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
};
