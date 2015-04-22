'use strict';

angular.module('app')
    .factory('googlenews', ['$q', '$http', function ($q, $http) {
        return new GoogleNews($q, $http);
    }]);

/**
 * @class
 * @implements {ContentProvider}
 * @param {Object} $q
 * @param {Object} $http
 * @constructor
 */
function GoogleNews($q, $http) {
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
     * @type {Number}
     */
    this.currentPage = 0;
}

/**
 * @override
 */
GoogleNews.prototype.consumeNewItems = function (tag, isInitial, count) {
    if (isInitial) {
        this.currentPage = 0;
        return this.getItems(tag, false, count);
    }

    var deferred = this.$q.defer();
    deferred.resolve([]);
    return deferred.promise;
};

/**
 * @override
 */
GoogleNews.prototype.consumeOldItems = function (tag, count) {
    return this.getItems(tag, true, count);
};

/**
 * @private
 * @param {String} tag
 * @param {Number} incrementPage
 * @param {Number} count
 * @return {Promise}
 */
GoogleNews.prototype.getItems = function (tag, incrementPage, count) {
    if (incrementPage) {
        this.currentPage++;
    }

    var deferred = this.$q.defer();
    var start = this.currentPage * count;
    var self = this;

    var url = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&scoring=d&callback=JSON_CALLBACK&q=' +
        encodeURIComponent(tag) + '&rsz=' + count + '&start=' + start;

    this.$http.jsonp(url).success(function (response) {
        var items = [];

        if (response.responseStatus == 200 &&
            response.responseData.results.length != 0 &&
            self.currentPage == response.responseData.cursor.currentPageIndex
        ) {
            var results = response.responseData.results;

            for (var i in results) {
                var itemUrl = results[i].content +
                    ' <a target="_blank" href="' +
                    decodeURIComponent(results[i].url) + '">more</a>';

                items.push({
                    header: results[i].title,
                    body: itemUrl,
                    img: (results[i].image == undefined) ? null : results[i].image.url,
                    creation_date: new Date(results[i].publishedDate),
                    provider: 'googlenews'
                });
            }
        } else {
            if (incrementPage) {
                self.currentPage--;
            }
        }

        deferred.resolve(items);
    });

    return deferred.promise;
};
