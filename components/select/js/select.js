(function () {

    var uniqueId = 0;

    function unique(prfix) {
        var id = ++uniqueId;
        return prfix + id;
    }

    var template = [
        '<div class="js-select">',
        '<div class="js-header">',
        '<div class="selected-option">',
        '<label></label>',
        '<span class="current"></span>',
        '</div>',
        '<div class="animate-wrap">',
        '<div class="line"></div>',
        '</div>',
        '</div>',
        '<ul class="js-list-options">',
        '</ul>',
        '</div>'
    ].join('');


    function Select(element, options) {
        var self = this;
        this.id = unique('select_');
        this.element = element;
        this.options = options;
        this.template = $(template);
        this.parent = this.element.parent();
        this.selected = this.element.find('option:selected');
        this.listOptions = this.element.find('option');
        this.isDisabled = !!this.element.attr('disabled');
        this.isRequired = !!this.element.attr('required');
        this.textLabel = this.element.attr('data-label');

        this.refreshFn = this.refresh.bind(this);
        this.disabled = this.disabled.bind(this);
        this.enabled = this.enabled.bind(this);

        this.init();
        this.setupUI();
        this.update();
        this.value();
        this.watch();


        if (this.isDisabled)
            this.template.addClass('is-disabled');

        if (this.isRequired)
            this.template.addClass('is-required');
    }

    Select.prototype.init = function () {

        var self = this;

        if (this.selected.text().length > 0) {
            this.template.addClass('is-active');
        }


        if (this.isDisabled)
            return;


        $(document).off('.js-select');
        $(document).on('click.js-select', '.js-select', this.onClick);
        $(document).on('click.js-select', '.js-select .option:not(.is-disabled)', this.onOptionClick);
        $(document).on('keydown.js-select', '.js-select', this.onKeyDown);
        $(document).on('click.js-select', this.onOuterClick);

    };


    Select.prototype.update = function () {
        var self = this;

        this.element.on('change', function () {
            if (self.template.find('select option:selected').text().length > 0) {
                self.template.addClass('is-active');
            }
        });
    };

    Select.prototype.setOptions = function () {
        var self = this;

        self.template.find('ul').html('');

        this.listOptions.each(function () {
            var $option = $(this);

            if ($option.val().length === 0) {
                return;
            }

            self.template.find('ul').append($('<li></li>')
                .attr('data-value', $option.val())
                .addClass('option ' +
                    ($option.is(':selected') ? ' is-selected ' : '') +
                    ($option.is(':disabled') ? ' is-disabled ' : '')
                ).html($option.text())
            );
        });

    };

    Select.prototype.setupUI = function () {
        this.template.attr('id', this.id);
        this.template.attr('tabindex', '0');
        this.template.append(this.element);
        this.parent.append(this.template);

        this.template.find('.js-header span.current').text(this.selected.text());

        this.template.find('.js-header label').text(this.textLabel);
        //load all options to ul list
        this.setOptions();
    };

    Select.prototype.reloadOptions = function () {

        this.template.find('.js-header span.current').text(this.selected.text());
        this.setOptions();
    };

    Select.prototype.value = function () {
        var val = this.element.val(),
            self = this;

        setInterval(function () {
            if (self.element.val() !== val) {
                val = self.element.val();
                self.reloadOptions();
            }
        }, 200);

        return val;
    };

    Select.prototype.watch = function () {
        var self = this;
        var selected = this.selected;

        setInterval(function () {

            var newSelect = self.element.find('option:selected');

            if (selected.val() !== newSelect.val()) {
                self.selected = newSelect;
                selected = self.selected;
                self.reloadOptions();
            }

            if (self.isDisabled)
                self.template.addClass('is-disabled');

        }, 200)
    };

    Select.prototype.onClick = function (e) {
        console.log(' Aftwr ',this.isDisabled)
        var $select = $(this);

        $('.js-select').not($select).removeClass('is-open');
        $select.toggleClass('is-open');

        if ($select.has('is-open')) {
            $select.find('.option');
            $select.find('.is-focus').removeClass('is-focus');
            $select.find('.is-selected').addClass('is-focus');
        }

    };

    Select.prototype.onOptionClick = function (e) {
        var $option = $(this);
        var $select = $option.parents('.js-select');

        $select.find('.is-selected').removeClass('is-selected');
        $option.addClass('is-selected');

        $select.find('.current').text($option.text());

        $select.find('select').val($option.data('value')).trigger('change');

    };

    Select.prototype.onOuterClick = function (e) {

        if ($(e.target).closest('.js-select').length === 0) {
            $('.js-select').removeClass('is-open');
        }

    };

    Select.prototype.onKeyDown = function (e) {

        var $select = $(this);
        var $focus_option = $select.find('.is-focus') || $select.find('is-selected');

        // Enter
        if (e.keyCode === 13) {
            if ($select.hasClass('is-open')) {
                $focus_option.trigger('click');
            } else {
                $select.trigger('click');
            }
            return false;
            // Down
        } else if (e.keyCode === 40) {

            if (!$select.hasClass('is-open')) {
                $select.trigger('click');
            } else {
                var $next = $focus_option.nextAll('.option:not(.is-disabled)').first();

                if ($next.length > 0) {
                    $select.find('.is-focus').removeClass('is-focus');
                    $next.addClass('is-focus');

                    // $select.find('.js-list-options').animate({
                    //     scrollTop:($next.position().top)
                    // },200);
                }
            }

            return false;
            // Up
        } else if (e.keyCode === 38) {

            if (!$select.hasClass('is-open')) {
                $select.trigger('click');

            } else {
                var $prev = $focus_option.prevAll('.option:not(.is-disabled)').first();

                if ($prev.length > 0) {
                    $select.find('.is-focus').removeClass('is-focus');
                    $prev.addClass('is-focus');

                    // $select.find('.js-list-options').animate({
                    //     scrollTop:($prev.position().top)
                    // },200);
                }
            }

            return false;
            // Esc
        } else if (e.keyCode === 27) {
            //
            // if ($select.hasClass('is-open')) {
            //     $select.trigger('click');
            // }
        }

    };

    Select.prototype.refresh = function () {
        this.listOptions = this.element.find('option');
        this.reloadOptions();
    };

    Select.prototype.disabled = function () {
        this.element.prop('disabled', true);
        //this.isDisabled = true;
    };

    Select.prototype.enabled = function () {
        this.element.prop('disabled', false);
        this.isDisabled = false;
    };

    $.fn.jsSelect = function (_options) {
        var defOption = {
            onSelect: null
        };

        return this.each(function () {
            var $this = $(this),
                data = $this.data('js-select'),
                arg = Array.prototype.slice.call(arguments, 1);

            if (!data) {
                var options = $.extend(defOption, _options);
                $this.data('js-select', new Select($this, options));

            } else {

                if (typeof _options === 'string') {
                    if (_options === "update") {
                        data['refreshFn'].apply(this)
                    }

                    if (_options === "disabled") {
                        data['disabled'].apply(this)
                    }

                    if (_options === "enabled") {
                        data['enabled'].apply(this)
                    }


                }
            }

        })


    }

}())