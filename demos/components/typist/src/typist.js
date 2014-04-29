(function () {
    String.prototype.replaceAt = function (index, char) {
        return this.substr(0, index) + char + this.substr(index + char.length);
    };
    (function ($) {
        return $.fn.humanTypist = function (options) {
            var erronize, humanize, settings, speed_options, type;
            settings = $.extend({
                speed: "beginner",
                lang: "javascript"
            }, options);
            speed_options = {
                grandma: 2000,
                beginner: 1500,
                upcomer: 1000,
                scriptkiddie: 500,
                secretary: 300,
                hacker: 200,
                elite: 90, // 150
                computer: 100,
                faster:85 /*85*/
            };
            humanize = function (speed) {
                return Math.floor(speed * Math.random());
            };
            erronize = function (text) {
                var i, ntext;
                ntext = text;
                i = 0;
                while (i <= text.length) {
                    i += 10;
                    if (ntext.substring(i + 10) !== " ") {
                        ntext = ntext.substring(0, i + 10) + ntext.substring(i + 10);
                    }
                }
                return ntext;
            };
            // highlight(el, 'javascript')
            highlight = function(el, lang){
                //sh_highlightElement(el, sh_languages[lang]);
                el.scrollIntoView(false);  
            };

            type = function (e, text, speed) {
                var next;
                next = $(e).text().length + 1;

                $(e).text(text.substr(0, next));
                window.setProgressPercentage();

                highlight(e, settings.lang);

                if (text.charAt(next - 1) === "#") {
                    $(e).text().replaceAt(next - 1, "");
                }
                return setTimeout((function () {

                    return type(e, text, speed);

                }), (speed));
            
        };
        return this.each(function () {
            var speed, text;
            speed = speed_options[settings.speed];
            text = $(this).html();
            //text = erronize(text);
            $(this).text("");

            return type(this, text, speed);
        });
    };
    })(jQuery);
}).call(this);

