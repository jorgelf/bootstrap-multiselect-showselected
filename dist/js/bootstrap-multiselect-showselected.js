/**
 * MIT License
 * 
 * Copyright (c) 2021 Jorge López Fernández
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
$.fn.multiselect.Constructor.prototype.defaults.showSelectedValues = false;
$.fn.multiselect.Constructor.prototype.defaults.showSelectedValuesCollapsed = false;
$.fn.multiselect.Constructor.prototype.defaults.showSelectedValuesOnlyOnce = false;
$.fn.multiselect.Constructor.prototype.defaults.showSelectedValuesEmpty = true;
$.fn.multiselect.Constructor.prototype.defaults.selectedValuesTitleText = 'Values initially selected';
$.fn.multiselect.Constructor.prototype.defaults.selectedValuesNoValuesText = 'None';

$.fn.multiselect.Constructor.prototype.buildDropdownOriginal = $.fn.multiselect.Constructor.prototype.buildDropdown;

$.fn.multiselect.Constructor.prototype.buildDropdown = function() {

	this.buildDropdownOriginal();

	if (this.options.showSelectedValues) {
		var label = this.options.selectedValuesTitleText;
		var value = 'bootstrap-multiselect-selected-values';
		var title = this.options.selectedValuesTitleText;

		var $groupOption = $("<span class='multiselect-group multiselect-selected-values dropdown-item-text'></span>");

		if (this.options.enableHTML) {
			$groupOption.html(" " + label);
		} else {
			$groupOption.text(" " + label);
		}

		$groupOption.find('.form-check').addClass('d-inline-block');
		$groupOption.append('<span class="caret-container dropdown-toggle pl-1"></span>');

		this.$popupContainer.append($groupOption);

		$(".multiselect-selected-values", this.$popupContainer).off("click");
		$(".multiselect-selected-values", this.$popupContainer).on("click", $.proxy(function (event) {
			var $group = $(event.target);
			var $inputs = $group.nextUntil(":not(.multiselect-selected-values-entry)");

			var visible = true;
			$inputs.each(function () {
				visible = visible && !$(this).hasClass('multiselect-collapsible-hidden');
			});

			if (visible) {
				$inputs.hide()
					.addClass('multiselect-collapsible-hidden');
			} else {
				$inputs.show()
					.removeClass('multiselect-collapsible-hidden');
			}
			$group.toggleClass('collapsed', visible);
		}, this));

		this.createDivider();
	}
};

$.fn.multiselect.Constructor.prototype.refreshOriginal = $.fn.multiselect.Constructor.prototype.refresh;

$.fn.multiselect.Constructor.prototype.refresh = function() {
	if (this.options.showSelectedValues) {
		var inputs = {};
		$('.multiselect-selected-values-option input', this.$popupContainer).each(function () {
			inputs[$(this).val()] = $(this);
		});
		$('option', this.$select).each($.proxy(function (index, element) {
			var $elem = $(element);
			var $input = inputs[$(element).val()];

			if ($input) {
				if ($elem.is(':selected')) {
					$input.prop('checked', true);

					if (this.options.selectedClass) {
						$input.closest('.multiselect-selected-values-option')
							.addClass(this.options.selectedClass);
					}
				} else {
					$input.prop('checked', false);

					if (this.options.selectedClass) {
						$input.closest('.multiselect-selected-values-option')
							.removeClass(this.options.selectedClass);
					}
				}
			}
		}, this));
		this.refreshOriginal();
	}
};

$.fn.multiselect.Constructor.prototype.clearSelectionOriginal = $.fn.multiselect.Constructor.prototype.clearSelection;

$.fn.multiselect.Constructor.prototype.clearSelection = function() {
	this.clearSelectionOriginal();
	if (this.options.showSelectedValues) {
		this.refresh();
	}
};

$.fn.multiselect.Constructor.prototype.mergeOptionsOriginal = $.fn.multiselect.Constructor.prototype.mergeOptions;

$.fn.multiselect.Constructor.prototype.mergeOptions = function (options) {
	options.onChangeOriginal = options.onChange;
	options.onChange = function(option, checked) {
		if (this.options.showSelectedValues) {
			this.refresh();
		}
		if (this.options.onChangeOriginal) {
			this.options.onChangeOriginal(option, checked);
		}
	};

	options.onSelectAllOriginal = options.onSelectAll;
	options.onSelectAll = function() {
		if (this.options.showSelectedValues) {
			this.refresh();
		}
		if (this.options.onSelectAllOriginal) {
			this.options.onSelectAllOriginal();
		}
	};

	options.onDeselectAllOriginal = options.onDeselectAll;
	options.onDeselectAll = function() {
		if (this.options.showSelectedValues) {
			this.refresh();
		}
		if (this.options.onDeselectAllOriginal) {
			this.options.onDeselectAllOriginal();
		}
	};
	
	options.onDropdownShowOriginal = options.onDropdownShow;
	options.onDropdownShow = function(event) {
		if (this.options.showSelectedValues) {
			this.$popupContainer.find('.multiselect-selected-values-entry').remove();
			this.$popupContainer.find('.multiselect-selected-values-hidden').removeClass('multiselect-selected-values-hidden');
			var values = this.$select.val();
			if (values && values.length) {
				for (var i = values.length - 1; i >= 0; i--) {
					var option = this.getInputByValue(values[i]).closest('.multiselect-option');
					var newOption = option.clone().removeClass('multiselect-option').addClass('multiselect-group-option-indented').addClass('multiselect-selected-values-entry').addClass('multiselect-selected-values-option');
					newOption.insertAfter(this.$popupContainer.find('.multiselect-selected-values'));
					if (this.options.showSelectedValuesCollapsed) {
						newOption.addClass('multiselect-collapsible-hidden').hide();
					}
					if (this.options.showSelectedValuesOnlyOnce) {
						option.addClass('multiselect-selected-values-hidden');
					}
				}
				if (!this.options.showSelectedValuesEmpty) {
					var title = this.$popupContainer.find('.multiselect-group.multiselect-selected-values');
					title.show();
					title.nextAll('.dropdown-divider:first').show();
				}
				this.$popupContainer.find('.multiselect-group.multiselect-selected-values').toggleClass('collapsed', this.options.showSelectedValuesCollapsed);
			} else {
				if (this.options.showSelectedValuesEmpty) {
					var text = $('<span class="multiselect-selected-values-entry multiselect-group-option-indented multiselect-selected-values-none dropdown-item-text">' + this.options.selectedValuesNoValuesText + '</span>');
					text.insertAfter(this.$popupContainer.find('.multiselect-selected-values'));
					if (this.options.showSelectedValuesCollapsed) {
						text.addClass('multiselect-collapsible-hidden').hide();
					}
				} else {
					var title = this.$popupContainer.find('.multiselect-group.multiselect-selected-values');
					title.hide();
					title.nextAll('.dropdown-divider:first').hide();
				}
			}
		}
		if (this.options.onDropdownShowOriginal) {
			this.options.onDropdownShowOriginal(event);
		}
	};
	
	return this.mergeOptionsOriginal(options);
};
