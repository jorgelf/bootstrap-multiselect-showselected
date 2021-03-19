# Bootstrap Multiselect - Show Selected

Small plugin for showing the selected values first as an _optgroup_ when opening a [bootstrap-multiselect](http://davidstutz.github.io/bootstrap-multiselect/) dropdown. Please be aware that the selected values list only updates when the dropdown is opened.

![Example of multiselect showing the selected values.](example.png?raw=true "Example of multiselect showing the selected values.")

In order to use it, simply load the JavaScript and CSS files after _bootstrap-multiselect_. Then you can specify the following new options when initializing the _bootstrap-multiselect_ component:

* _showSelectedValues_: whether we want to show the currently selected values upon opening the dropdown. Setting it to _false_ completely disables this plugin. Default: _false_
* _showSelectedValuesCollapsed_: whether we want the currently selected values _optgroup_ to show initially collapsed when opening the dropdown. Default: _false_
* _showSelectedValuesOnlyOnce_: whether we want the currently selected values to be shown only in the selected values _optgroup_, hiding them from their usual place in the list below. Default: _false_
* _showSelectedValuesEmpty_: whether we want the currently selected values _optgroup_ to be shown when there are no values selected, displaying the text specified with the parameter _selectedValuesNoValuesText_. Default: _true_
* _selectedValuesTitleText_: the text we want to show as title of the selected values _optgroup_. Default: "_Values initially selected_"
* _selectedValuesNoValuesText_: the text we want to show inside the selected values _optgroup_ when there are no values selected. Default: "_None_"

Additional notes:

* I'm aware that the code is quite inelegant, just wanted a quick fix for my project needs.
* The original value checkbox and the one shown in the new selected values _optgroup_ are always synced, but this is done in an unoptimized way by just refreshing all the checkboxes with each change. Shouldn't be a problem in most cases, but if you have thousands of items, then it could be.
* If you use the option _showSelectedValuesOnlyOnce_, _optgroups_ with all their options selected will still be shown empty in the list below.
* Has been tested to work with most _bootstrap-multiselect_ options in version _1.0.0_, at least up to commit [_e15132b_](https://github.com/davidstutz/bootstrap-multiselect/commit/e15132b6a3891cdb3384f1fdaea68620a2bb961b). Can't guarantee it to work with older or newer versions.
