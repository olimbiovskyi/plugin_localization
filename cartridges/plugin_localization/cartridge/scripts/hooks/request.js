'use strict';

/**
 * @returns {boolean} is system request
 */
function isSystemRequest() {
    var systemReqRegex = /__Analytics|__SYSTEM__|CQRecomm/;

    return request.httpRequest && systemReqRegex.test(request.httpURL.toString());
}

/**
 * On request hook
 *
 * @returns {dw.system.Status} Status
 */
function onRequest() {
    var Status = require('dw/system/Status');

    if (request.includeRequest || isSystemRequest() || request.custom.onRequestIgnore) {
        return new Status(Status.OK);
    }

    var localizationHelpers = require('*/cartridge/scripts/helpers/localizationHelpers');

    localizationHelpers.setLocalizationPreferences();

    return new Status(Status.OK);
}

module.exports = {
    onRequest: onRequest
};
