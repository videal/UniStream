'use strict';

angular.module('app')
    .factory('userSettings', [function () {
        return new UserSettings();
    }]);

/**
 * @class
 * @constructor
 */
function UserSettings() {
    /**
     * @private
     * @type {String}
     */
    this.contentProvider = 'instagram';
}

/**
 * @public
 * @param {String} provider
 * @return {undefined}
 */
UserSettings.prototype.setContentProvider = function (provider) {
    this.contentProvider = provider;
};

/**
 * @public
 * @return {String}
 */
UserSettings.prototype.getContentProvider = function () {
    return this.contentProvider;
};
