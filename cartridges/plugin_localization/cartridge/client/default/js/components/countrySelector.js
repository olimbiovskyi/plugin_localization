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
                    var $countryChangeModal = $('.js-country-change-modal');

                    if ($countryChangeModal.length) {
                        $countryChangeModal.remove();
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
        $(document).on('click', '.js-country-change-modal button.close', function () {
            $(this).parents('.js-country-change-modal').addClass('d-none');
        });
    },

    handleCountryChange: function () {
        $(document).on('change', '.js-country-select', function () {
            var $this = $(this);
            var $modal = $this.parents('.js-country-change-modal');
            var $languageSelect = $modal.find('.js-language-select');
            var $allLanguagesSelect = $modal.find('.js-all-languages-select');
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
