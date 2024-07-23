'use strict';

var focusHelper = require('base/components/focus');

module.exports = {
    showLocalizationModal: function () {
        $('body').on('shown.bs.modal', '.js-country-change-modal', function () {
            $(this).siblings().attr('aria-hidden', 'true');
        });

        $('body').on('hidden.bs.modal', '.js-country-change-modal', function () {
            $(this).siblings().attr('aria-hidden', 'false');
            $('.modal-backdrop').remove();
        });

        $('body').on('keydown', '.js-country-change-modal', function (e) {
            var focusParams = {
                event: e,
                containerSelector: '.js-country-change-modal',
                firstElementSelector: '.close',
                lastElementSelector: '.modal-body .btn'
            };

            focusHelper.setTabNextFocus(focusParams);
        });

        $('body').on('click', '.js-change-country', function (e) {
            e.preventDefault();
            $.spinner().start();

            var $this = $(this);

            $.ajax({
                url: $this.data('url'),
                method: 'GET',
                success: function (response) {
                    var $countryChangeModal = $('.js-country-change-modal');

                    if ($countryChangeModal.length) {
                        $countryChangeModal.remove();
                    }

                    $('body').append(response);
                    $('.js-country-change-modal').modal('show');
                },
                complete: function () {
                    $.spinner().stop();
                }
            });
        });
    },

    handleCountryChange: function () {
        $('body').on('change', '.js-country-select', function () {
            var $this = $(this);
            var $modal = $this.parents('.js-country-change-modal');
            var $languageSelect = $modal.find('.js-language-select');
            var $currencySelect = $modal.find('.js-currency-select');
            var $allLanguagesSelect = $modal.find('.js-all-languages-select');
            var $allCurrenciesSelect = $modal.find('.js-all-currencies-select');
            var countryCode = $this.val();
            var $languageOptions = $allLanguagesSelect.find('option[data-country=' + countryCode + ']');
            var $currencyOptions = $allCurrenciesSelect.find('option[data-country=' + countryCode + ']');

            $languageSelect.html($languageOptions.clone())
                .attr('disabled', $languageOptions.length === 1);

            $currencySelect.html($currencyOptions.clone())
                .attr('disabled', $currencyOptions.length === 1);
        });
    },

    hangeFormSubmit: function () {
        $('body').on('submit', '.js-localization-form', function (e) {
            e.preventDefault();

            var $form = $(this);
            var $page = $('.page');
            var data = $form.serializeArray();

            data.push({
                name: 'action',
                value: $page.data('action')
            }, {
                name: 'queryString',
                value: $page.data('querystring')
            });

            $.spinner().start();

            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: data,
                success: function (response) {
                    if (response.redirectUrl) {
                        window.location.href = response.redirectUrl;
                    }
                },
                complete: function () {
                    $.spinner().stop();
                }
            });
        });
    }
};
