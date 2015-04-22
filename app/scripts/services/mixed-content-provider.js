'use strict';

angular.module('app')
    .factory('mixedContentProvider', ['$q', '$injector', function ($q, $injector) {
        var providers = [];
        var providerServiceNames = $injector.get('contentProviderServices');
        
        for (var i in providerServiceNames) {
            if (providerServiceNames[i] == 'mixedContentProvider') {
                continue;
            }
            
            providers.push($injector.get(providerServiceNames[i]));
        }
        
        return new MixedContentProvider($q, providers);
    }]);

/**
 * @class
 * @implements {ContentProvider}
 * @param {Object} $q
 * @param {Array} providers
 * @constructor
 */
function MixedContentProvider($q, providers) {
    /**
     * @private
     * @type {Object}
     */
    this.$q = $q;

    /**
     * @private
     * @type {Array}
     */
    this.providers = providers;
}

/**
 * @override
 */
MixedContentProvider.prototype.consumeNewItems = function (
    tag, isInitial, count) {
    var deferred = this.$q.defer();
    var resultPromises = [];
    
    for (var i in this.providers) {
        resultPromises.push(
            this.providers[i].consumeNewItems(tag, isInitial, count));
    }
    
    return this.combineResults(resultPromises, deferred);
};

/**
 * @override
 */
MixedContentProvider.prototype.consumeOldItems = function (tag, count) {
    var deferred = this.$q.defer();
    var resultPromises = [];
    
    for (var i in this.providers) {
        resultPromises.push(this.providers[i].consumeOldItems(tag, count));
    }

    return this.combineResults(resultPromises, deferred);
};

/**
 * @private
 * @param {Array} resultPromises
 * @param {Deferred} deferred
 * @return {Promise}
 */
MixedContentProvider.prototype.combineResults = function (
    resultPromises, deferred) {
    this.$q.all(resultPromises).then(function (results) {
        var items = [];

        for (var i in results) {
            items = items.concat(results[i]);
        }
        
        deferred.resolve(items);
    });
    
    return deferred.promise;
};
