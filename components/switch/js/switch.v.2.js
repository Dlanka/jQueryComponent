(function () {

    var uniqueId = 0;

    function unique(prfix) {
        var id = ++uniqueId;
        return prfix + id;
    }

    var template = [
        '<div class="switch">',
        '<div class="switch-bar"></div>',
        '<div class="switch-handler"></div>',
        '</div>'
    ].join('');

    function whichTransitionEvent() {
        var t,
            el = document.createElement("div");

        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }


    function Switch(element, options) {
        var self = this;
        this.id = unique('sw_');
        this.element = element;
        this.options = options;
        this.template = $(template);
        this.parent = this.element.parent();
        this.isMouseUp = false;
        this.isMouseDown = false;
        this.traslate = 0;
        this.isChecked = 0;
        this.type = this.element.attr('type');
        this.name = this.element.attr('name');
        this.$switchHandler = this.template.find('.switch-handler');
        this.transitionEvent = whichTransitionEvent();

        this.init();
        this.setupUI();

        if (this.element.is(':checked')) {
            this.template.addClass('is-checked');
        }
    }

    Switch.prototype.init = function () {
        this.$switchHandler.on('mousedown', $.proxy(this.onMouseDownHandler, this));
        this.$switchHandler.on('mouseup', $.proxy(this.onMouseUpHandler, this));
        this.template.on('mousedown', $.proxy(this.onMouseDown, this));
        this.template.on('mouseup', $.proxy(this.onMouseUp, this));
        this.template.on('mousemove', $.proxy(this.onMouseMove, this));
        $(document).on('click', $.proxy(this.onClick, this));

    };

    Switch.prototype.setupUI = function () {
        this.template.attr('id', this.id)
        this.template.append(this.element);
        this.parent.append(this.template)
    };

    Switch.prototype.value = function () {
        var val = 0,
            self = this;
        if (this.type === "checkbox") {
            checkbox();
        } else {
            radioButton();
        }

        function checkbox() {

            if (!self.element.is(':checked')) {
                self.template.addClass('is-checked');
                self.element.prop('checked', true);
                val = 1;
            } else {
                self.element.prop('checked', false);
                self.template.removeClass('is-checked');
                val = 0;
            }

            self.element.trigger('change');

        }

        function radioButton() {

            if (self.element.is(':checked'))
                return;

            $(document).find('input[name="' + self.name + '"]').each(function () {
                var $this = $(this);

                if($this.attr('type') === 'checkbox')
                    return;

                $this.parents('.switch').removeClass('is-checked');
                $this.prop('checked', false);
                $this.trigger('change');
                self.template.addClass('is-checked');
                self.element.prop('checked', true);
                self.element.trigger('change');
            })

        }

        return val;
    };


    Switch.prototype.onMouseDownHandler = function (e) {
        var handler = $(e.target);

        if (!handler.hasClass('switch-handler'))
            return;

        $(document).find('.is-scale').remove();

        var div = $('<div></div>');
        handler.append(div);

        setTimeout(function () {
            div.addClass('is-scale');
        }, 1);

        div.one(this.transitionEvent, completed);

        function completed(e) {
            div.remove();
        }

    };

    Switch.prototype.onMouseUpHandler = function (e) {

    };

    Switch.prototype.onMouseDown = function (e) {
        e.stopPropagation();
        //this.isMouseDown = true;
    };

    Switch.prototype.onMouseUp = function (e) {
        e.stopPropagation();
        this.isChecked = !!this.value();
        //console.log(this.isChecked);
        // this.isMouseDown = false;
        // this.isMouseUp = true;
        // this.$switchHandler.css('transform', '');
        // console.log(this.traslate)
        // var isChanged = this.isChecked ? this.traslate < 0.5 : this.traslate > 0.5;
        // this.isChecked = isChanged;
        // console.log(isChanged)
    };

    Switch.prototype.onMouseMove = function (e) {

        // e.stopPropagation();
        //
        // if (this.isMouseDown && !this.isMouseUp) {
        //     //console.log(e.offsetX)
        //     var precent = e.offsetX / 20;
        //
        //     this.traslate = this.isChecked ? 1 + precent : precent;
        //     this.traslate = Math.max(0, Math.min(1, this.traslate));
        //     this.$switchHandler.css('transform', 'translate3d(' + (100 * this.traslate) + '%,0,0)');
        //
        // }
    };

    Switch.prototype.onClick = function (e) {
        // if (!$(e.target).hasClass('switch') || !$(e.target).parent().hasClass('switch')) {
        //     this.isMouseDown = false;
        //     this.isMouseUp = false;
        // }

    };


    $.fn.switch = function (options) {

        return this.each(function () {
            var $this = $(this),
                data = $this.data('switch');

            if (!data) {
                var options = $.extend({}, options);
                $this.data('switch', new Switch($this, options));
            } else {

            }

        })

    }

}())