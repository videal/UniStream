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
}

/**
 * @override
 */
Instagram.prototype.getItems = function (tag, startDate) {
    var deferred = this.$q.defer();
    var url = 'https://api.instagram.com/v1/tags/' + tag +
        '/media/recent?count=10&client_id=' + this.clientId + '&callback=JSON_CALLBACK';
    this.$http.jsonp(url).success(function (response) {
        var items = [];

        for (var i in response.data) {
            if (response.data[i].type != 'image') {
                continue;
            }

            items.push({
                header: response.data[i].caption.text,
                body: '',
                img: response.data[i].images.standard_resolution.url,
            });
        }
        
        deferred.resolve(items);
    });
    return deferred.promise;
};
