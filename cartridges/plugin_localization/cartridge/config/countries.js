'use strict';

var CacheMgr = require('dw/system/CacheMgr');
var cache = CacheMgr.getCache('countriesData');
var countriesConfig = cache.get('countries', getCountriesConfig);

/**
 * @description build country configurations based on custom objects
 * @returns {Array} configurations
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
            currencyCode: country.custom.currencyCode,
            locales: [].slice.apply(country.custom.locales),
            priceBooks: [].slice.apply(country.custom.priceBooks),
            hostName: country.custom.hostName || '',
            redirectURL: country.custom.redirectURL || ''
        });
    }

    return configurations;
}

module.exports = countriesConfig;
