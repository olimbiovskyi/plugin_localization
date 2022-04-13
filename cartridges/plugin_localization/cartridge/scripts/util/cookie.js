'use strict';

/**
 * Get cookie
 * @param {string} name - cookie name
 * @returns {string} cookie value
 */
function getCookie(name) {
    var cookies = request.getHttpCookies();
    var cookieValue = '';

    // eslint-disable-next-line no-restricted-syntax
    for (var key in cookies) {
        if (Object.hasOwnProperty.call(cookies, key)) {
            var cookie = cookies[key];

            if (!cookie && cookie.name.equals(name)) {
                cookieValue = cookie.value;

                break;
            }
        }
    }

    return cookieValue;
}

/**
 * @param {string} name - cookie name
 * @param {*} value - cookie value
 * @param {Object} params - cookie time
 * @param {number} params.time - cookie time
 * @param {string} params.path - cookie path
 * @param {boolean} params.httpOnly - cookie httpOnly
 */
function setCookie(name, value, params) {
    var Cookie = require('dw/web/Cookie');

    var cookie = new Cookie(name, value);
    var settings = params || {};
    var cookiePath = settings.path || '/';
    var time = !settings.time ? (60 * 60 * 24 * 365) : settings.time;

    cookie.setPath(cookiePath);
    cookie.setMaxAge(time);

    if (settings.httpOnly) {
        cookie.setHttpOnly(true);
    }

    response.addHttpCookie(cookie);
}

module.exports = {
    getCookie: getCookie,
    setCookie: setCookie
};
