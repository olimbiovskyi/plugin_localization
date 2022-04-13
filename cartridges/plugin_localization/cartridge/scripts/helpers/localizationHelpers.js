'use strict';

/**
 * @param {Object} params - params object
 * @param {Object} params.countryConfig - country configuration
 * @param {string} params.locale - locale
 */
function applyPreferences(params) {
    var countryConfig = params.countryConfig;

    if (!countryConfig) {
        return;
    }

    var Site = require('dw/system/Site');
    var Currency = require('dw/util/Currency');
    var PriceBookMgr = require('dw/catalog/PriceBookMgr');

    request.setLocale(params.locale);

    var priceBooks = countryConfig.priceBooks.reduce(function (result, priceBookID) {
        var pricebook = PriceBookMgr.getPriceBook(priceBookID);
        if (pricebook) {
            result.push(pricebook);
        }
        return result;
    }, []);

    PriceBookMgr.setApplicablePriceBooks.apply(PriceBookMgr, priceBooks);

    var siteCurrencies = Site.current.allowedCurrencies;

    if (siteCurrencies.indexOf(countryConfig.currencyCode) !== -1) {
        session.setCurrency(Currency.getCurrency(countryConfig.currencyCode));
    }
}

/**
 * @description session attrbites help to create dynamic customer groups
 *
 * @param {Object} params - params object
 * @param {string} params.country - country
 * @param {string} params.locale - locale
 * @param {string} params.siteID - site ID
 */
function saveLocalizationConfigs(params) {
    var cookie = require('*/cartridge/scripts/util/cookie');

    if (params.country) {
        session.custom.countryCode = params.country;

        cookie.setCookie('selectedCountry', params.country);
    }

    if (params.locale) {
        session.custom.selectedLocale = params.locale;

        cookie.setCookie('selectedLocale', params.locale);
    }

    if (params.siteID) {
        session.custom.selectedSite = params.siteID;
    }
}

/**
 * @description apply localization settings for site
 */
function setLocalizationPreferences() {
    var LocaleModel = require('*/cartridge/models/locale');
    var localeModel = new LocaleModel();

    applyPreferences({
        countryConfig: localeModel.countryConfig,
        locale: request.locale
    });

    saveLocalizationConfigs({
        country: localeModel.locale.countryCode,
        locale: localeModel.locale.id,
        siteID: localeModel.locale.siteID
    });
}

/**
 * @description populate localization form
 * @param {Oject} form - localization form
 */
function fillCountriesOptions(form) {
    var Locale = require('dw/util/Locale');
    var Resource = require('dw/web/Resource');
    var ArrayList = require('dw/util/ArrayList');
    var countriesConfig = require('*/cartridge/config/countries');

    var countryField = form.country;
    var languageField = form.language;
    var allLanguagesField = form.allLanguages;

    var countryOptions = new ArrayList();
    var localeOptions = new ArrayList();
    var currentLocaleOptions = new ArrayList();

    for (var i = 0; i < countriesConfig.length; i++) {
        var countryConfig = countriesConfig[i];
        var isSessionCountry = countryConfig.countryCode === session.custom.countryCode;

        // eslint-disable-next-line no-loop-func
        countryConfig.locales.forEach(function (locale) {
            var countryLocale = Locale.getLocale(locale);
            var localeOption = {
                ID: locale,
                name: Resource.msg('localization.locale.language.' + countryLocale.language, 'locale', null),
                value: locale,
                id: countryConfig.countryCode
            };

            localeOptions.push(localeOption);

            if (isSessionCountry) {
                currentLocaleOptions.push(localeOption);

                if (locale === session.custom.selectedLocale) {
                    languageField.setValue(locale);
                }
            }
        });

        if (isSessionCountry) {
            countryField.setValue(countryConfig.countryCode);
        }

        countryOptions.push({
            ID: countryConfig.countryCode,
            name: countryConfig.name,
            value: countryConfig.countryCode
        });
    }

    countryField.setOptions(countryOptions.iterator());
    allLanguagesField.setOptions(localeOptions.iterator());
    languageField.setOptions(currentLocaleOptions.iterator());
}

module.exports = {
    fillCountriesOptions: fillCountriesOptions,
    setLocalizationPreferences: setLocalizationPreferences
};
