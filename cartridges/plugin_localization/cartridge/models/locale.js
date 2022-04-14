'use strict';

/**
 * Represents current locale information in plain object
 * @param {dw.util.Locale} locale - locale
 * @constructor
 */
function LocaleModel(locale) {
    var Site = require('dw/system/Site');
    var Locale = require('dw/util/Locale');
    var currentLocale = locale || Locale.getLocale(request.locale);

    this.locale = {
        id: currentLocale.ID,
        siteID: Site.current.ID,
        language: currentLocale.language,
        countryCode: currentLocale.country,
        displayName: currentLocale.displayName,
        displayCountry: currentLocale.displayCountry,
        displayLanguage: currentLocale.displayLanguage
    };

    this.countryConfig = LocaleModel.getCountryConfig(currentLocale.country);
}

/**
 * Get country configuration bases on country code
 * @param {string} countryCode - country code
 * @returns {Object} country configuration
 * @static
 */
LocaleModel.getCountryConfig = function (countryCode) {
    var countriesConfig = require('*/cartridge/config/countries');
    var array = require('*/cartridge/scripts/util/array');

    return array.find(countriesConfig, function (countryConfig) {
        return countryConfig.countryCode === countryCode;
    });
};

module.exports = LocaleModel;
