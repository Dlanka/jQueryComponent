;(function () {

    $.fn._init = $.fn.init;

    $.fn.init = function (selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };

    function _Switch(element,options) {

    }



    $.fn.Switch = function (options) {


        var $this = $(this),

            elements = [],

            selector = $this.data('selector');


        var elementsCount = function () {
            return elements.length;
        };

        var setElements = function (ele) {
            elements.push(ele);
        };

        var destroy = function (ele) {
        };

        function render() {

            var $switch = $('<div class="switch"></div>');
            var $switchBar = $('<div class="switch-bar"></div>');
            var $switchHandler = $('<div class="switch-handler"></div>');

        }

        function init($this) {

            setElements($this);

            if (typeof options === "string") {
                switch (options) {

                    case 'destroy':
                        destroy($this);
                        break;
                }
            }

            $this.addClass('updated');

        }

        function update(selector) {
            init($(selector));
        }

        function watch() {

            var oldLength = elementsCount();

            function checkLength() {

                var newLength = function () {
                    return $(document).find(selector).length;
                };

                if (oldLength !== newLength()) {
                    oldLength = newLength();
                    update(selector)
                }
            }

            setInterval(function () {
                checkLength();
            }, 1000)
        }

        $this.each(function () {
            init($(this));
        });

        watch();

        return $this;
    }


}());