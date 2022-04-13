'use strict';

/**
 * On sessiom hook
 *
 * @returns {dw.system.Status} Status
 */
function onSession() {
    var Site = require('dw/system/Site');
    var Status = require('dw/system/Status');

    if (!Site.current.getCustomPreferenceValue('isRedirectToCustomerLocale')) {
        return new Status(Status.OK);
    }

    var requestHelpers = require('*/cartridge/scripts/helpers/requestHelpers');
    var httpAction = requestHelpers.getHttpAction();

    if (Site.current.getCustomPreferenceValue('inboundRequestWhitelist').indexOf(httpAction) > -1) {
        request.custom.onRequestIgnore = true;

        return new Status(Status.OK);
    }

    var LocaleModel = require('*/cartridge/models/locale');
    var cookie = require('*/cartridge/scripts/util/cookie');

    var countryCode = cookie.getCookie('selectedCountry');

    if (!countryCode) {
        countryCode = request.geolocation.countryCode;
    }

    var countryConfig = LocaleModel.getCountryConfig(countryCode);

    if (!countryConfig || countryConfig.redirectURL) {
        return new Status(Status.OK);
    }

    var siteID = Site.current.ID;
    var locale = cookie.getCookie('selectedLocale') || countryConfig.locales[0];

    if ((request.locale !== locale) || (siteID !== countryConfig.siteID)) {
        var redirectURL = requestHelpers.getRedirectUrl({
            siteID: countryConfig.siteID,
            hostName: countryConfig.hostName,
            locale: locale
        });

        response.redirect(redirectURL);

        request.custom.onRequestIgnore = true;
    }

    return new Status(Status.OK);
}

exports.onSession = onSession;
