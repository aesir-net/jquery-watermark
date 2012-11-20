/*
    ==============================
    jQuery watermark plugin
    ==============================
    
    @version: 1.1
    @authors: Dmitriy Nosenko, Sergey Ignatiev    
    @last_updated: 2012-11-16

    Options description:
    * watermarkClass: default class for watermark (defautlValue: 'watermark')
    * text: default watermark text (defautlValue: 'watermark')
    * useAttribute: shows if watermark  plugin must get watermark text from input attribute (defautlValue: true)
    * attributeName: attribute name where watermark plugin gets watermark text (defautlValue: 'data-watermark')

*/

(function ($) {
    var methods = {
        init: function (options) {
            return this.filter(':input[type="text"],:input[type="password"]').each(function () {
                /* Check if watermark already set */
                if ($(this).data('watermark-object')) {
                    return;
                }

                var settings = $.extend({
                    watermarkClass: 'watermark', /* default watermark class */
                    text: 'watermark', /* default watermark text */
                    useAttribute: true, /* if true, use specified attribute for watermark text */
                    attributeName: 'data-watermark' /* alternative source for watermark text */
                }, options);

                /* Get target input */
                var input = $(this);
                
                /* Manage watermark location */
                var inputHeight = input.outerHeight();
                var inputFontSize = parseFloat(input.css('font-size'));

                /* Top corner */
                var inputPaddingTop = parseFloat(input.css('padding-top'));
                var inputPaddingBottom = parseFloat(input.css('padding-bottom'));
                var inputMarginTop = parseFloat(input.css('margin-top'));                
                
                /* Left corner */
                var inputPaddingLeft = parseFloat(input.css('padding-left'));
                var inputMarginLeft = parseFloat(input.css('margin-left'));
                var inputTextIndent = parseFloat(input.css('text-indent'));

                var watermarkLeft = inputPaddingLeft + inputMarginLeft + inputTextIndent;                
                
                /* Fix text location in input */
                var inputPadding = (inputPaddingTop + inputPaddingBottom) / 2;
                input.css({
                    'padding-top': inputPadding,
                    'padding-bottom': inputPadding
                });

                /* Creating wrapper */
                var wrapper = $('<div>')
                    .css({
                        'position': 'relative',
                        'display': 'inline-block'
                    })
                    .addClass('watermark_wrapper');

                /* Set watermark text */
                var watermarkText = settings.text;
                if (settings.useAttribute && settings.attributeName && (input.attr(settings.attributeName) != 'undefined')) {
                    watermarkText = input.attr(settings.attributeName);
                }

                /* Creating watermark span */
                var watermarkObject = $('<span>')
                    .css({
                        'height': inputHeight,
                        'line-height': inputHeight + 'px',
                        'font-size': inputFontSize,
                        'top': inputMarginTop,
                        'left': watermarkLeft,
                        'position': 'absolute',
                        'cursor': input.css('cursor')
                    })
                    .addClass(settings.watermarkClass)
                    .html(watermarkText);

                /* Save watermark object for other methods */
                $(this).data('watermark-object', watermarkObject);

                watermarkObject.click(function () {
                    input.click();
                    input.focus();
                });

                /* Getting they together */
                input.wrap(wrapper);
                input.after(watermarkObject);

                input.bind('click keyup input cut paste', function () {
                    input.watermark('update');
                });

                /* Refresh watermark */
                input.watermark('update');
            });
        },
        /* Show watermark */
        show: function () {
            return this.each(function () {
                if ($(this).data('watermark-object')) {
                    $(this).data('watermark-object').show();
                }
            });
        },
        /* Hide watermark */
        hide: function () {
            return this.each(function () {
                if ($(this).data('watermark-object')) {
                    $(this).data('watermark-object').hide();
                }
            });
        },
        update: function () {
            return this.each(function () {
                if ($(this).data('watermark-object')) {
                    if ($(this).val()) {
                        $(this).watermark('hide');
                    } else {
                        $(this).watermark('show');
                    }
                }
            });
        }
    };

    $.fn.watermark = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.watermark');
        }
    };
})(jQuery);