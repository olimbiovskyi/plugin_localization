'use strict';

var server = require('server');

/**
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function locale(req, res, next) {
    var LocaleModel = require('*/cartridge/models/locale');
    var localeModel = new LocaleModel();

    var template = req.querystring.mobile
        ? '/components/header/mobileCountrySelector'
        : '/components/header/countrySelector';

    res.render(template, {
        locale: localeModel.locale
    });

    return next();
}

/**
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function setLocale(req, res, next) {
    var LocaleModel = require('*/cartridge/models/locale');

    var localizationForm = server.forms.getForm('localization');
    var countryCode = localizationForm.country.value;
    var locale = localizationForm.language.value;
    var countryConfig = LocaleModel.getCountryConfig(countryCode);

    if (countryConfig.redirectURL) {
        res.json({
            success: true,
            redirectUrl: countryConfig.redirectURL
        });

        return next();
    }

    if (!locale || countryConfig.locales.indexOf(locale) === -1) {
        locale = countryConfig.locales[0];
    }

    var requestHelpers = require('*/cartridge/scripts/helpers/requestHelpers');

    var redirectURL = requestHelpers.getRedirectUrl({
        action: req.form.action,
        siteID: countryConfig.siteID,
        hostName: countryConfig.hostName,
        locale: locale,
        queryString: req.form.queryString
    });

    res.json({
        success: true,
        redirectUrl: redirectURL.toString()
    });

    return next();
}

/**
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next call in the middleware chain
 * @returns {void}
 */
function getLocalizationForm(req, res, next) {
    var localizationHelpers = require('*/cartridge/scripts/helpers/localizationHelpers');

    localizationHelpers.fillCountriesOptions(session.forms.localization);

    res.render('components/localization/countryChangeModalForm', {
        forms: {
            localization: server.forms.getForm('localization')
        }
    });

    return next();
}

module.exports = {
    locale: locale,
    setLocale: setLocale,
    getLocalizationForm: getLocalizationForm
};
