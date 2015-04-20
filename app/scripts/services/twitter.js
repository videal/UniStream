'use strict';

angular.module('app')
    .factory('twitter', ['$q', function ($q) {
        return new Twitter($q);
    }]);

/**
 * @class
 * @param {Object} $q
 * @constructor
 */
function Twitter($q) {
    /**
     * @private
     * @type {Object}
     */
    this.$q = $q;
}

/**
 * @public
 * @param {String} tag
 * @param {Date} startDate
 * @return {Promise}
 */
Twitter.prototype.getTweets = function (tag, startDate) {
    var deferred = this.$q.defer();
    deferred.resolve([{content: 'Tweet 1'}, {content: 'Tweet 2'}]);
    return deferred.promise;
};
