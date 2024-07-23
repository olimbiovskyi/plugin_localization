'use strict';

/**
 * Get current http action
 * @returns {string} http action
 */
function getHttpAction() {
    var httpPathParts = request.httpPath.split('/');
    var httpAction = httpPathParts[httpPathParts.length - 1];

    return httpAction;
}

/**
 * Get a redirection URL
 * @param {Object} params - params object
 * @param {string} params.action - action
 * @param {string} params.siteID - site ID
 * @param {string} params.locale - locle
 * @param {string} params.hostName - host name
 * @param {string} params.queryString - query string
 * @returns {string} url
 */
function getRedirectUrl(params) {
    var Site = require('dw/system/Site');
    var URLUtils = require('dw/web/URLUtils');
    var URLAction = require('dw/web/URLAction');
    var Encoding = require('dw/crypto/Encoding');
    var URLParameter = require('dw/web/URLParameter');

    var locale = params.locale;
    var action = params.action || getHttpAction();
    var siteID = params.siteID || Site.current.ID;
    var hostName = params.hostName || request.httpHost;
    var queryString = params.queryString || request.httpQueryString;
    var urlAction = new URLAction(action, siteID, locale, hostName);
    var urlParams = [];

    urlParams.push(urlAction);

    var parametersToRemove = Site.current.getCustomPreferenceValue('csRemoveParameterNames');

    (queryString || '').split('&').forEach(function (pair) {
        var parts = pair.split('=');

        if (parametersToRemove.indexOf(parts[0]) === -1) {
            urlParams.push(new URLParameter(parts[0], Encoding.fromURI(parts[1])));
        }
    });

    var redirectURL = URLUtils.abs.apply(URLUtils, urlParams);
    var isDifferentHostName = request.httpHost !== hostName;
    var isSameSite = siteID === session.custom.selectedSite;

    if (isDifferentHostName && isSameSite) {
        redirectURL = URLUtils.sessionRedirect(hostName, redirectURL);
    }

    return redirectURL;
}

module.exports = {
    getHttpAction: getHttpAction,
    getRedirectUrl: getRedirectUrl
};
