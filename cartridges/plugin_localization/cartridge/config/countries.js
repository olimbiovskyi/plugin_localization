'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cache = CacheMgr.getCache('countriesData');
var countriesConfig = cache.get('countries', getCountriesConfig);

/**
 * Get normalized array based on custom objects
 * @returns {Array} normalized countries array
 */
function getCountriesConfig() {
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var countries = CustomObjectMgr.getAllCustomObjects('CountryConfig');
    var configurations = [];

    while (countries.hasNext()) {
        var country = countries.next();

        configurations.push({
            countryCode: country.custom.countryCode,
            name: country.custom.name,
            siteID: country.custom.siteID,
            currencies: [].slice.apply(country.custom.currencies),
            locales: [].slice.apply(country.custom.locales),
            priceBooks: [].slice.apply(country.custom.priceBooks),
            hostName: country.custom.hostName || '',
            redirectURL: country.custom.redirectURL || ''
        });
    }

    return configurations;
}

module.exports = countriesConfig;
