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
     * @type {NaN}
     */
    this.currentPage = 0;

    /**
     * @private
     * @type {Number}
     */
    this.itemsPerPage = 8;
}

/**
 * @override
 */
GoogleNews.prototype.consumeNewItems = function (tag, is_initial) {
    if (is_initial) {
        this.currentPage = 0;
        return this.getItems(tag, false);
    }

    var deferred = this.$q.defer();
    deferred.resolve([]);
    return deferred.promise;
};

/**
 * @override
 */
GoogleNews.prototype.consumeOldItems = function (tag) {
    return this.getItems(tag, true);
};

/**
 * @private
 */
GoogleNews.prototype.getItems = function (tag, increment_page) {
    if (increment_page) {
        this.currentPage++;
    }

    var deferred = this.$q.defer();
    var start = this.currentPage * this.itemsPerPage;
    var self = this;

    var url = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&scoring=d&callback=JSON_CALLBACK&q=' +
        tag + '&rsz=' + this.itemsPerPage + '&start=' + start;

    this.$http.jsonp(url).success(function (response) {
        var items = [];

        if (response.responseStatus == 200 &&
            response.responseData.results.length != 0 &&
            self.currentPage == response.responseData.cursor.currentPageIndex
        ) {
            var results = response.responseData.results;

            for (var i in results) {
                items.push({
                    header: results[i].title,
                    body: results[i].content,
                    img: (results[i].image == undefined) ? null : results[i].image.url,
                    creation_date: new Date(results[i].publishedDate)
                });
            }
        } else {
            if (increment_page) {
                self.currentPage--;
            }
        }

        deferred.resolve(items);
    });

    return deferred.promise;
};
