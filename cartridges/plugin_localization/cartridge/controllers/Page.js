'use strict';

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var localization = require('*/cartridge/scripts/middleware/localization');

server.get(
    'GetLocalizationForm',
    csrfProtection.generateToken,
    localization.getLocalizationForm
);

server.replace(
    'Locale',
    server.middleware.include,
    localization.locale
);

server.replace(
    'SetLocale',
    csrfProtection.validateAjaxRequest,
    localization.setLocale
);

module.exports = server.exports();
