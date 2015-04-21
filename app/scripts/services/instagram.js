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
     * @type {Number}
     */
    this.itemsPerPage = 10;
}

/**
 * @override
 */
Instagram.prototype.consumeNewItems = function (tag) {
    var self = this;
    var deferred = this.$q.defer();
    var url = 'https://api.instagram.com/v1/tags/' + tag +
        '/media/recent?count=' + this.itemsPerPage + '&min_tag_id=' +
        this.minTagId + '&client_id=' + this.clientId +
        '&callback=JSON_CALLBACK';
    this.$http.jsonp(url).success(function (response) {
        var items = [];

        if (response.data.length > 0) {
            self.minTagId = response.pagination.min_tag_id;

            if (self.nextMaxTagId == null) {
                self.nextMaxTagId = response.pagination.next_max_tag_id;
            }

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
        }
        
        deferred.resolve(items);
    });
    return deferred.promise;
};

/**
 * @override
 */
Instagram.prototype.consumeOldItems = function (tag) {
    var deferred = this.$q.defer();
    
    if (this.nextMaxTagId == null) {
        deferred.resolve([]);
        return deferred.promise;
    }
    
    var self = this;
    var url = 'https://api.instagram.com/v1/tags/' + tag +
        '/media/recent?count=' + this.itemsPerPage + '&max_tag_id=' +
        this.nextMaxTagId + '&client_id=' + this.clientId +
        '&callback=JSON_CALLBACK';

    this.$http.jsonp(url).success(function (response) {
        var items = [];

        if (response.data.length > 0) {
            self.nextMaxTagId = response.pagination.next_max_tag_id;

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
        }
        
        deferred.resolve(items);
    });
    return deferred.promise;
};
