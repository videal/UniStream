'use strict';

angular.module('app')
    .factory('instagram', ['$q', '$http', 'instagramClientId', function ($q, $http, clientId) {
        return new Instagram($q, $http, clientId);
    }]);

/**
 * @class
 * @implements {ContentProvider}
 * @param {Object} $q
 * @param {Object} $http
 * @param {String} clientId
 * @constructor
 */
function Instagram($q, $http, clientId) {
    /**
     * @private
     * @type {Object}
     */
    this.$q = $q;

    /**
     * @private
     * @type {Object}
     */
    this.$http = $http;

    /**
     * @private
     * @type {String}
     */
    this.clientId = clientId;

    /**
     * @private
     * @type {String}
     */
    this.minTagId = '0';

    /**
     * @private
     * @type {String}
     */
    this.nextMaxTagId;

    /**
     * @private
     * @type {String}
     */
    this.lastTag;
    
    /**
     * @private
     * @type {Number}
     */
    this.itemsPerPage = 10;
}

/**
 * @override
 */
Instagram.prototype.consumeNewItems = function (tag, isInitial) {
    this.resetPaginationDataIfNeeded(tag);
    var self = this;
    var deferred = this.$q.defer();
    var url = this.getRequestUrl(tag) + '&min_tag_id=' + this.minTagId;
    this.$http.jsonp(url).success(function (response) {
        if (response.meta.code != 200) {
            deferred.reject();
            return;
        }
        
        var items = [];

        if (response.data.length > 0) {
            self.minTagId = response.pagination.min_tag_id;

            if (self.nextMaxTagId == null) {
                self.nextMaxTagId = response.pagination.next_max_tag_id;
            }

            self.fillItems(response, items);
        }
        
        deferred.resolve(items);
    });
    return deferred.promise;
};

/**
 * @override
 */
Instagram.prototype.consumeOldItems = function (tag) {
    this.resetPaginationDataIfNeeded(tag);
    var deferred = this.$q.defer();
    
    if (this.nextMaxTagId == null) {
        deferred.resolve([]);
        return deferred.promise;
    }
    
    var self = this;
    var url = this.getRequestUrl(tag) + '&max_tag_id=' + this.nextMaxTagId;
    this.$http.jsonp(url).success(function (response) {
        if (response.meta.code != 200) {
            deferred.reject();
            return;
        }
        
        var items = [];

        if (response.data.length > 0) {
            self.nextMaxTagId = response.pagination.next_max_tag_id;
            self.fillItems(response, items);
        }
        
        deferred.resolve(items);
    });
    return deferred.promise;
};

/**
 * @private
 * @param {String} tag
 * @return {String}
 */
Instagram.prototype.getRequestUrl = function (tag) {
    return 'https://api.instagram.com/v1/tags/' + encodeURIComponent(tag) +
        '/media/recent?count=' + this.itemsPerPage + '&client_id=' +
        encodeURIComponent(this.clientId) + '&callback=JSON_CALLBACK';
};

/**
 * @private
 * @param {String} tag
 * @return {undefined}
 */
Instagram.prototype.resetPaginationDataIfNeeded = function (tag) {
    if (this.lastTag === tag) {
        return;
    }

    this.lastTag = tag;
    this.minTagId = '0';
    this.nextMaxTagId = null;
};

/**
 * @private
 * @param {Object} response
 * @param {Array} items
 * @return {undefined}
 */
Instagram.prototype.fillItems = function (response, items) {
    for (var i in response.data) {
        if (response.data[i].type != 'image') {
            continue;
        }

        items.push({
            header: response.data[i].caption.text,
            body: '',
            img: response.data[i].images.standard_resolution.url,
            creation_date: new Date(
                response.data[i].created_time * 1000)
        });
    }
};
