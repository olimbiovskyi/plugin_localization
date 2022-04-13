const path = require('path');

/**
 * Allows to configure aliases for you require loading
 */
module.exports.aliasConfig = {
    // enter all aliases to configure
    alias: {
        base: path.resolve(
            process.cwd(), // eslint-disable-next-line max-len
            './cartridges/app_storefront_base/cartridge/client/default/'
        ),
        base_localization: path.resolve(
            process.cwd(), // eslint-disable-next-line max-len
            './cartridges/plugin_localization/cartridge/client/default'
        )
    }
};

/**
 * Exposes cartridges included in the project
 */
module.exports.cartridges = [
    './cartridges/app_storefront_base',
    './cartridges/plugin_localization'
];
