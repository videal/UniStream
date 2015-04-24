'use strict';

angular.module('app')
    .factory('tagStorage', ['localStorageService', function (localStorageService) {
        return new TagStorage(localStorageService);
    }]);

/**
 * @class
 * @param {Object} localStorage
 * @constructor
 */
function TagStorage(localStorage) {
    /**
     * @private
     * @type {Object}
     */
    this.localStorage = localStorage;

    /**
     * @private
     * @type {Array}
     */
    this.tags = [
        {name: 'love'},
        {name: 'selfie'}
    ];

    this.init();
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
    this.save();
};

/**
 * @public
 * @param {Object} tag
 * @return {undefined}
 */
TagStorage.prototype.remove = function (tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    this.save();
};

/**
 * @private
 * @return {undefined}
 */
TagStorage.prototype.init = function () {
    var savedTags = this.localStorage.get('tags');

    if (savedTags != null) {
        this.tags = savedTags;
    }
};

/**
 * @private
 * @return {undefined}
 */
TagStorage.prototype.save = function () {
    this.localStorage.set('tags', this.tags);
};
