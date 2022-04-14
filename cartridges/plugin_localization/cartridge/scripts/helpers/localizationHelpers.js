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

    var siteCurrencies = Site.current.allowedCurrencies;
    var currencyCode = params.currencyCode;

    if (siteCurrencies.indexOf(currencyCode) !== -1) {
        session.setCurrency(Currency.getCurrency(currencyCode));
    }

    var priceBooks = countryConfig.priceBooks.reduce(function (result, priceBookID) {
        var priceBook = PriceBookMgr.getPriceBook(priceBookID);

        if (priceBook && priceBook.currencyCode === currencyCode) {
            result.push(priceBook);
        }

        return result;
    }, []);

    PriceBookMgr.setApplicablePriceBooks.apply(PriceBookMgr, priceBooks);
}

/**
 * @description session attrbites help to create dynamic customer groups
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

    if (params.currencyCode) {
        session.custom.selectedCurrency = params.currencyCode;
        cookie.setCookie('selectedCurrency', params.currencyCode);
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
    var countryConfig = localeModel.countryConfig;
    var currencyCode = session.custom.selectedCurrency;

    if (!currencyCode) {
        currencyCode = countryConfig.currencies[0];
    }

    applyPreferences({
        countryConfig: countryConfig,
        locale: request.locale,
        currencyCode: currencyCode
    });

    saveLocalizationConfigs({
        country: localeModel.locale.countryCode,
        locale: localeModel.locale.id,
        siteID: localeModel.locale.siteID,
        currencyCode: currencyCode
    });
}

/**
 * @description populate localization form
 * @param {Oject} form - session form
 */
function fillCountriesOptions(form) {
    var Locale = require('dw/util/Locale');
    var Resource = require('dw/web/Resource');
    var ArrayList = require('dw/util/ArrayList');
    var countriesConfig = require('*/cartridge/config/countries');

    var countryField = form.country;
    var languageField = form.language;
    var currencyField = form.currency;
    var allLanguagesField = form.allLanguages;
    var allCurrenciesField = form.allCurrencies;

    var countryOptions = new ArrayList();
    var localeOptions = new ArrayList();
    var currencyOptions = new ArrayList();
    var currentLocaleOptions = new ArrayList();
    var currentCurrencyOptions = new ArrayList();

    for (var i = 0; i < countriesConfig.length; i++) {
        var countryConfig = countriesConfig[i];
        var isSessionCountry = countryConfig.countryCode === session.custom.countryCode;

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

        countryConfig.currencies.forEach(function (currency) {
            var currencyOption = {
                ID: currency,
                name: currency,
                value: currency,
                id: countryConfig.countryCode
            };

            currencyOptions.push(currencyOption);

            if (isSessionCountry) {
                currentCurrencyOptions.push(currencyOption);

                if (currency === session.custom.selectedCurrency) {
                    currencyField.setValue(currency);
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
    languageField.setOptions(currentLocaleOptions.iterator());
    allLanguagesField.setOptions(localeOptions.iterator());
    currencyField.setOptions(currentCurrencyOptions.iterator());
    allCurrenciesField.setOptions(currencyOptions.iterator());
}

module.exports = {
    fillCountriesOptions: fillCountriesOptions,
    setLocalizationPreferences: setLocalizationPreferences
};
