'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var localization = require('*/cartridge/scripts/middleware/localization');

server.extend(module.superModule);

server.get(
    'GetLocalizationForm',
    csrfProtection.generateToken,
    localization.getLocalizationForm
);

server.replace(
    'Locale',
    server.middleware.include,
    localization.getlocale
);

server.replace(
    'SetLocale',
    csrfProtection.validateAjaxRequest,
    localization.setLocale
);

module.exports = server.exports();
