'use strict';

module.exports = {
    showLocalizationModal: function () {
        $(document).on('click', '.js-change-country', function (e) {
            e.preventDefault();

            $.spinner().start();

            var $this = $(this);

            $.ajax({
                url: $this.data('url'),
                method: 'GET',
                success: function (response) {
                    var $countryChangeWrapper = $('.js-country-change-wrapper');

                    if ($countryChangeWrapper.length) {
                        $countryChangeWrapper.remove();
                    }

                    $('body').append(response);
                },
                complete: function () {
                    $.spinner().stop();
                }
            });
        });
    },

    hideLocalizationModal: function () {
        $(document).on('click', '.js-country-change-wrapper button.close', function () {
            $(this).parents('.js-country-change-wrapper').addClass('d-none');
        });
    },

    handleCountryChange: function () {
        $(document).on('change', '.js-country-select', function () {
            var $this = $(this);
            var $wrapper = $this.parents('.js-country-change-wrapper');
            var $languageSelect = $wrapper.find('.js-language-select');
            var $allLanguagesSelect = $wrapper.find('.js-all-languages-select');

            var countryCode = $this.val();
            var $languageOptions = $allLanguagesSelect.find('option[data-country=' + countryCode + ']');

            $languageSelect.html($languageOptions.clone());
        });
    },

    hangeFormSubmit: function () {
        $(document).on('submit', '.js-localization-form', function (e) {
            e.preventDefault();

            var $form = $(this);
            var $page = $('.page');
            var data = $form.serializeArray();

            data.push({
                name: 'action',
                value: $page.data('action')
            });

            data.push({
                name: 'queryString',
                value: $page.data('querystring')
            });

            $.spinner().start();

            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: data,
                success: function (response) {
                    if (response.success) {
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
