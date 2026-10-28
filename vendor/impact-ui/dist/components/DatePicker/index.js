!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('.PresetDateRangePicker_panel{padding:0 22px 11px}.PresetDateRangePicker_button{background:0 0;border:2px solid #00a699;-moz-box-sizing:border-box;box-sizing:border-box;color:#00a699;cursor:pointer;font:inherit;font-weight:700;height:100%;line-height:normal;margin-right:8px;overflow:visible;padding:4px 12px;position:relative;text-align:center}.PresetDateRangePicker_button:active{outline:0}.PresetDateRangePicker_button__selected{background:#00a699;color:#fff}.SingleDatePickerInput{background-color:#fff;display:inline-block}.SingleDatePickerInput__withBorder{border:1px solid #dbdbdb;border-radius:2px}.SingleDatePickerInput__rtl{direction:rtl}.SingleDatePickerInput__disabled{background-color:#f2f2f2}.SingleDatePickerInput__block{display:block}.SingleDatePickerInput__showClearDate{padding-right:30px}.SingleDatePickerInput_clearDate{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;margin:0 10px 0 5px;overflow:visible;padding:10px;position:absolute;right:0;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.SingleDatePickerInput_clearDate__default:focus,.SingleDatePickerInput_clearDate__default:hover{background:#dbdbdb;border-radius:50%}.SingleDatePickerInput_clearDate__small{padding:6px}.SingleDatePickerInput_clearDate__hide{visibility:hidden}.SingleDatePickerInput_clearDate_svg{fill:#82888a;height:12px;vertical-align:middle;width:15px}.SingleDatePickerInput_clearDate_svg__small{height:9px}.SingleDatePickerInput_calendarIcon{background:0 0;border:0;color:inherit;cursor:pointer;display:inline-block;font:inherit;line-height:normal;margin:0 5px 0 10px;overflow:visible;padding:10px;vertical-align:middle}.SingleDatePickerInput_calendarIcon_svg{fill:#82888a;height:15px;vertical-align:middle;width:14px}.SingleDatePicker{display:inline-block;position:relative}.SingleDatePicker__block{display:block}.SingleDatePicker_picker{background-color:#fff;position:absolute;z-index:1}.SingleDatePicker_picker__rtl{direction:rtl}.SingleDatePicker_picker__directionLeft{left:0}.SingleDatePicker_picker__directionRight{right:0}.SingleDatePicker_picker__portal{background-color:#0000004d;height:100%;left:0;position:fixed;top:0;width:100%}.SingleDatePicker_picker__fullScreenPortal{background-color:#fff}.SingleDatePicker_closeButton{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;overflow:visible;padding:15px;position:absolute;right:0;top:0;z-index:2}.SingleDatePicker_closeButton:focus,.SingleDatePicker_closeButton:hover{color:darken(#cacccd,10%);text-decoration:none}.SingleDatePicker_closeButton_svg{fill:#cacccd;height:15px;width:15px}.DayPickerKeyboardShortcuts_buttonReset{background:0 0;border:0;border-radius:0;color:inherit;cursor:pointer;font:inherit;font-size:14px;line-height:normal;overflow:visible;padding:0}.DayPickerKeyboardShortcuts_buttonReset:active{outline:0}.DayPickerKeyboardShortcuts_show{height:26px;position:absolute;width:33px;z-index:2}.DayPickerKeyboardShortcuts_show:before{content:"";display:block;position:absolute}.DayPickerKeyboardShortcuts_show__bottomRight{bottom:0;right:0}.DayPickerKeyboardShortcuts_show__bottomRight:before{border-right:33px solid #00a699;border-top:26px solid #0000;bottom:0;right:0}.DayPickerKeyboardShortcuts_show__bottomRight:hover:before{border-right:33px solid #008489}.DayPickerKeyboardShortcuts_show__topRight{right:0;top:0}.DayPickerKeyboardShortcuts_show__topRight:before{border-bottom:26px solid #0000;border-right:33px solid #00a699;right:0;top:0}.DayPickerKeyboardShortcuts_show__topRight:hover:before{border-right:33px solid #008489}.DayPickerKeyboardShortcuts_show__topLeft{left:0;top:0}.DayPickerKeyboardShortcuts_show__topLeft:before{border-bottom:26px solid #0000;border-left:33px solid #00a699;left:0;top:0}.DayPickerKeyboardShortcuts_show__topLeft:hover:before{border-left:33px solid #008489}.DayPickerKeyboardShortcuts_showSpan{color:#fff;position:absolute}.DayPickerKeyboardShortcuts_showSpan__bottomRight{bottom:0;right:5px}.DayPickerKeyboardShortcuts_showSpan__topRight{right:5px;top:1px}.DayPickerKeyboardShortcuts_showSpan__topLeft{left:5px;top:1px}.DayPickerKeyboardShortcuts_panel{background:#fff;border:1px solid #dbdbdb;border-radius:2px;bottom:0;left:0;margin:33px;overflow:auto;padding:22px;position:absolute;right:0;text-align:left;top:0;z-index:2}.DayPickerKeyboardShortcuts_title{font-size:16px;font-weight:700;margin:0}.DayPickerKeyboardShortcuts_list{font-size:14px;list-style:none;padding:0}.DayPickerKeyboardShortcuts_close{position:absolute;right:22px;top:22px;z-index:2}.DayPickerKeyboardShortcuts_close:active{outline:0}.DayPickerKeyboardShortcuts_closeSvg{fill:#cacccd;height:15px;width:15px}.DayPickerKeyboardShortcuts_closeSvg:focus,.DayPickerKeyboardShortcuts_closeSvg:hover{fill:#82888a}.CalendarDay{-moz-box-sizing:border-box;box-sizing:border-box;cursor:pointer;font-size:14px;text-align:center}.CalendarDay:active{outline:0}.CalendarDay__defaultCursor{cursor:default}.CalendarDay__default{background:#fff;border:1px solid #e4e7e7;color:#484848}.CalendarDay__default:hover{background:#e4e7e7;border:1px solid #e4e7e7;color:inherit}.CalendarDay__hovered_offset{background:#f4f5f5;border:1px double #e4e7e7;color:inherit}.CalendarDay__outside{background:#fff;border:0;color:#484848}.CalendarDay__outside:hover{border:0}.CalendarDay__blocked_minimum_nights{background:#fff;border:1px solid #eceeee;color:#cacccd}.CalendarDay__blocked_minimum_nights:active,.CalendarDay__blocked_minimum_nights:hover{background:#fff;color:#cacccd}.CalendarDay__highlighted_calendar{background:#ffe8bc;color:#484848}.CalendarDay__highlighted_calendar:active,.CalendarDay__highlighted_calendar:hover{background:#ffce71;color:#484848}.CalendarDay__selected_span{background:#66e2da;border:1px double #33dacd;color:#fff}.CalendarDay__selected_span:active,.CalendarDay__selected_span:hover{background:#33dacd;border:1px double #33dacd;color:#fff}.CalendarDay__selected,.CalendarDay__selected:active,.CalendarDay__selected:hover{background:#00a699;border:1px double #00a699;color:#fff}.CalendarDay__hovered_span,.CalendarDay__hovered_span:hover{background:#b2f1ec;border:1px double #80e8e0;color:#007a87}.CalendarDay__hovered_span:active{background:#80e8e0;border:1px double #80e8e0;color:#007a87}.CalendarDay__blocked_calendar,.CalendarDay__blocked_calendar:active,.CalendarDay__blocked_calendar:hover{background:#cacccd;border:1px solid #cacccd;color:#82888a}.CalendarDay__blocked_out_of_range,.CalendarDay__blocked_out_of_range:active,.CalendarDay__blocked_out_of_range:hover{background:#fff;border:1px solid #e4e7e7;color:#cacccd}.CalendarDay__hovered_start_first_possible_end{background:#eceeee;border:1px double #eceeee}.CalendarDay__hovered_start_blocked_min_nights{background:#eceeee;border:1px double #e4e7e7}.CalendarMonth{background:#fff;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:top}.CalendarMonth_table{border-collapse:collapse;border-spacing:0}.CalendarMonth_verticalSpacing{border-collapse:initial}.CalendarMonth_caption{caption-side:top;color:#484848;font-size:18px;padding-bottom:37px;padding-top:22px;text-align:center}.CalendarMonth_caption__verticalScrollable{padding-bottom:7px;padding-top:12px}.CalendarMonthGrid{background:#fff;text-align:left;z-index:0}.CalendarMonthGrid__animating{z-index:1}.CalendarMonthGrid__horizontal{left:9px;position:absolute}.CalendarMonthGrid__vertical,.CalendarMonthGrid__vertical_scrollable{margin:0 auto}.CalendarMonthGrid_month__horizontal{display:inline-block;min-height:100%;vertical-align:top}.CalendarMonthGrid_month__hideForAnimation{opacity:0;pointer-events:none;position:absolute;z-index:-1}.CalendarMonthGrid_month__hidden{visibility:hidden}.DayPickerNavigation{position:relative;z-index:2}.DayPickerNavigation__horizontal{height:0}.DayPickerNavigation__verticalScrollable_prevNav{z-index:1}.DayPickerNavigation__verticalDefault{bottom:0;height:52px;left:0;position:absolute;width:100%}.DayPickerNavigation__verticalScrollableDefault{position:relative}.DayPickerNavigation__bottom{height:auto}.DayPickerNavigation__bottomDefault{-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between}.DayPickerNavigation_button{border:0;cursor:pointer;margin:0;padding:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DayPickerNavigation_button__default{background-color:#fff;border:1px solid #e4e7e7;color:#757575}.DayPickerNavigation_button__default:focus,.DayPickerNavigation_button__default:hover{border:1px solid #c4c4c4}.DayPickerNavigation_button__default:active{background:#f2f2f2}.DayPickerNavigation_button__disabled{border:1px solid #f2f2f2;cursor:default}.DayPickerNavigation_button__disabled:focus,.DayPickerNavigation_button__disabled:hover{border:1px solid #f2f2f2}.DayPickerNavigation_button__disabled:active{background:0 0}.DayPickerNavigation_button__horizontalDefault{border-radius:3px;line-height:.78;padding:6px 9px;position:absolute;top:18px}.DayPickerNavigation_bottomButton__horizontalDefault{margin:-10px 22px 30px;position:static}.DayPickerNavigation_leftButton__horizontalDefault{left:22px}.DayPickerNavigation_rightButton__horizontalDefault{right:22px}.DayPickerNavigation_button__verticalDefault{background:#fff;box-shadow:0 0 5px 2px #0000001a;display:inline-block;height:100%;padding:5px;position:relative;text-align:center;width:50%}.DayPickerNavigation_nextButton__verticalDefault{border-left:0}.DayPickerNavigation_nextButton__verticalScrollableDefault,.DayPickerNavigation_prevButton__verticalScrollableDefault{width:100%}.DayPickerNavigation_svg__horizontal{display:block;fill:#82888a;height:19px;width:19px}.DayPickerNavigation_svg__vertical{fill:#484848;height:42px;width:42px}.DayPickerNavigation_svg__disabled{fill:#f2f2f2}.DayPicker{position:relative;text-align:left}.DayPicker,.DayPicker__horizontal{background:#fff}.DayPicker__verticalScrollable{height:100%}.DayPicker__hidden{visibility:hidden}.DayPicker__withBorder{border-radius:3px;box-shadow:0 2px 6px #0000000d,0 0 0 1px #00000012}.DayPicker_portal__horizontal{box-shadow:none;left:50%;position:absolute;top:50%}.DayPicker_portal__vertical{position:static}.DayPicker_focusRegion{outline:0}.DayPicker_calendarInfo__horizontal,.DayPicker_wrapper__horizontal{display:inline-block;vertical-align:top}.DayPicker_weekHeaders{position:relative}.DayPicker_weekHeaders__horizontal{margin-left:9px}.DayPicker_weekHeader{color:#757575;position:absolute;text-align:left;top:62px;z-index:2}.DayPicker_weekHeader__vertical{left:50%}.DayPicker_weekHeader__verticalScrollable{background:#fff;border-bottom:1px solid #dbdbdb;display:table-row;left:0;margin-left:0;text-align:center;top:0;width:100%}.DayPicker_weekHeader_ul{font-size:14px;list-style:none;margin:1px 0;padding-left:0;padding-right:0}.DayPicker_weekHeader_li{display:inline-block;text-align:center}.DayPicker_transitionContainer{border-radius:3px;overflow:hidden;position:relative}.DayPicker_transitionContainer__horizontal{-webkit-transition:height .2s ease-in-out;-moz-transition:height .2s ease-in-out;transition:height .2s ease-in-out}.DayPicker_transitionContainer__vertical{width:100%}.DayPicker_transitionContainer__verticalScrollable{bottom:0;height:100%;left:0;overflow-y:scroll;padding-top:20px;position:absolute;right:0;top:0}.DateInput{background:#fff;display:inline-block;margin:0;padding:0;position:relative;vertical-align:middle;width:130px}.DateInput__small{width:97px}.DateInput__block{width:100%}.DateInput__disabled{background:#f2f2f2;color:#dbdbdb}.DateInput_input{background-color:#fff;border:0;border-bottom:2px solid #0000;border-radius:0;color:#484848;font-size:19px;font-weight:200;line-height:24px;padding:11px 11px 9px;width:100%}.DateInput_input__small{font-size:15px;letter-spacing:.2px;line-height:18px;padding:7px 7px 5px}.DateInput_input__regular{font-weight:auto}.DateInput_input__readOnly{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DateInput_input__focused{background:#fff;border:0;border-bottom:2px solid #008489;outline:0}.DateInput_input__disabled{background:#f2f2f2;font-style:italic}.DateInput_screenReaderMessage{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.DateInput_fang{height:10px;left:22px;position:absolute;width:20px;z-index:2}.DateInput_fangShape{fill:#fff}.DateInput_fangStroke{fill:#0000;stroke:#dbdbdb}.DateRangePickerInput{background-color:#fff;display:inline-block}.DateRangePickerInput__disabled{background:#f2f2f2}.DateRangePickerInput__withBorder{border:1px solid #dbdbdb;border-radius:2px}.DateRangePickerInput__rtl{direction:rtl}.DateRangePickerInput__block{display:block}.DateRangePickerInput__showClearDates{padding-right:30px}.DateRangePickerInput_arrow{color:#484848;display:inline-block;vertical-align:middle}.DateRangePickerInput_arrow_svg{fill:#484848;height:24px;vertical-align:middle;width:24px}.DateRangePickerInput_clearDates{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;margin:0 10px 0 5px;overflow:visible;padding:10px;position:absolute;right:0;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.DateRangePickerInput_clearDates__small{padding:6px}.DateRangePickerInput_clearDates_default:focus,.DateRangePickerInput_clearDates_default:hover{background:#dbdbdb;border-radius:50%}.DateRangePickerInput_clearDates__hide{visibility:hidden}.DateRangePickerInput_clearDates_svg{fill:#82888a;height:12px;vertical-align:middle;width:15px}.DateRangePickerInput_clearDates_svg__small{height:9px}.DateRangePickerInput_calendarIcon{background:0 0;border:0;color:inherit;cursor:pointer;display:inline-block;font:inherit;line-height:normal;margin:0 5px 0 10px;overflow:visible;padding:10px;vertical-align:middle}.DateRangePickerInput_calendarIcon_svg{fill:#82888a;height:15px;vertical-align:middle;width:14px}.DateRangePicker{display:inline-block;position:relative}.DateRangePicker__block{display:block}.DateRangePicker_picker{background-color:#fff;position:absolute;z-index:1}.DateRangePicker_picker__rtl{direction:rtl}.DateRangePicker_picker__directionLeft{left:0}.DateRangePicker_picker__directionRight{right:0}.DateRangePicker_picker__portal{background-color:#0000004d;height:100%;left:0;position:fixed;top:0;width:100%}.DateRangePicker_picker__fullScreenPortal{background-color:#fff}.DateRangePicker_closeButton{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;overflow:visible;padding:15px;position:absolute;right:0;top:0;z-index:2}.DateRangePicker_closeButton:focus,.DateRangePicker_closeButton:hover{color:darken(#cacccd,10%);text-decoration:none}.DateRangePicker_closeButton_svg{fill:#cacccd;height:15px;width:15px}\n@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact-datepicker-main-container{display:flex;font-family:Manrope,sans-serif}.impact-datepicker-main-container.label-flex-row{align-items:center;flex-direction:row;gap:16px}.impact-datepicker-main-container.label-flex-column{flex-direction:column}.impact-datepicker-main-container.label-flex-column .datePicker-label{margin-bottom:6px}.impact-datepicker-main-container .datePicker-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:18px}.impact-datepicker-main-container .datePicker-container{position:relative}.impact-datepicker-main-container .datePicker-input-container{height:32px;width:240px}.impact-datepicker-main-container .datePicker-input-container .impact-datepicker-date-input{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/calendar.svg) no-repeat;background-color:#fff;background-position:center right 12px;background-size:14px;border:1px solid #c3c8d4;border-radius:8px;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:32px;padding-left:12px;width:100%}.impact-datepicker-main-container .datePicker-input-container .impact-datepicker-date-input:hover{border:1px solid #4259ee;cursor:pointer}.impact-datepicker-main-container .datePicker-input-container .impact-datepicker-date-input:focus{border:1px solid #4259ee;outline:none}.impact-datepicker-main-container .datePicker-input-container .impact-datepicker-date-input:focus::placeholder{color:#4259ee}.impact-datepicker-main-container .datePicker-input-container-custom-icon{display:flex;position:relative}.impact-datepicker-main-container .datePicker-input-container-custom-icon .impact-datepicker-date-input{background:#fff!important}.impact-datepicker-main-container .datePicker-input-disabled .impact-datepicker-date-input{background-color:#f2f4fb;border:1px solid #d9dde7;pointer-events:none!important}.impact-datepicker-main-container .datePicker-input-disabled .impact-datepicker-date-input:hover{border:1px solid #d9dde7}.impact-datepicker-main-container .impact-datePicker-error .impact-datepicker-date-input{border:1px solid red!important}.impact-datepicker-main-container .impact-datePicker-error .impact-datepicker-date-input:hover{border:1px solid red!important;cursor:pointer}.impact-datepicker-main-container .impact-datePicker-error .impact-datepicker-date-input:focus{border:1px solid red!important;outline:none}.impact-datepicker-main-container .impact-datePicker-error .impact-datepicker-date-input:focus::placeholder{color:red}.impact-date-picker-dropdown-container{background-color:#fff;border:none;border-radius:8px;box-shadow:0 1px 6px #00000029;left:0;position:absolute;top:35px;width:269px;z-index:99}.impact-date-picker-dropdown-container.impact-date-picker-dropdown-top{bottom:calc(100% + 4px);top:auto}.impact-date-picker-dropdown-container.impact-date-picker-dropdown-portal{left:0;position:relative;top:0}.impact-date-picker-dropdown-container .DayPicker{width:269px!important}.impact-date-picker-dropdown-container .DayPicker>div{width:269px}.impact-date-picker-dropdown-container .DayPicker>div>div{width:269px!important}.impact-date-picker-dropdown-container .DayPicker__withBorder{box-shadow:none}.impact-date-picker-dropdown-container .DayPicker_focusRegion{width:269px!important}.impact-date-picker-dropdown-container .DayPicker_transitionContainer{min-height:266px;width:269px!important}.impact-date-picker-dropdown-container .CalendarMonthGrid__horizontal{left:0}.impact-date-picker-dropdown-container .CalendarMonthGrid_month__hidden,.impact-date-picker-dropdown-container .CalendarMonthGrid_month__horizontal{width:269px}.impact-date-picker-dropdown-container .CalendarMonth{padding:20px!important}.impact-date-picker-dropdown-container .CalendarMonth_caption{padding-bottom:28px;padding-top:0}.impact-date-picker-dropdown-container .DayPickerNavigation_leftButton__horizontalDefault{left:20px;top:17px}.impact-date-picker-dropdown-container .DayPickerNavigation_rightButton__horizontalDefault{right:20px;top:17px}.impact-date-picker-dropdown-container .CalendarMonth_caption{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500}.impact-date-picker-dropdown-container .DayPicker_weekHeader_li small{line-height:20px}.impact-date-picker-dropdown-container .DayPicker_weekHeader{left:0;padding:0 12px;top:50px;width:269px}.impact-date-picker-dropdown-container .DayPicker_weekHeader ul{font-family:Manrope,sans-serif;font-size:12px;font-weight:400;padding-left:1px}.impact-date-picker-dropdown-container .DayPicker_weekHeader:after{background-color:#d4d4d4;bottom:-2px;content:"";height:1px;left:15px;position:absolute;width:80%}.impact-date-picker-dropdown-container .DayPickerNavigation{position:relative;z-index:2}.impact-date-picker-dropdown-container .DayPickerNavigation__horizontal{height:0}.impact-date-picker-dropdown-container .DayPickerNavigation__verticalScrollable_prevNav{z-index:1}.impact-date-picker-dropdown-container .DayPickerNavigation__verticalDefault{bottom:0;height:52px;left:0;position:absolute;width:100%}.impact-date-picker-dropdown-container .DayPickerNavigation__verticalScrollableDefault{position:relative}.impact-date-picker-dropdown-container .DayPickerNavigation__bottom{height:auto}.impact-date-picker-dropdown-container .DayPickerNavigation__bottomDefault{-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between}.impact-date-picker-dropdown-container .DayPickerNavigation_button{border:0;cursor:pointer;margin:0;padding:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.impact-date-picker-dropdown-container .DayPickerNavigation_button:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-date-picker-dropdown-container .DayPickerNavigation_button:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-date-picker-dropdown-container .DayPickerNavigation_button__default{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/accordion-chevron.svg) no-repeat;background-size:12px;transform:rotate(90deg)}.impact-date-picker-dropdown-container .DayPickerNavigation_button__default svg{display:none}.impact-date-picker-dropdown-container .DayPickerNavigation_button__disabled{opacity:.8}.impact-date-picker-dropdown-container .DayPickerNavigation_button__horizontalDefault{border-radius:3px;line-height:.78;padding:6px;position:absolute;top:25px}.impact-date-picker-dropdown-container .DayPickerNavigation_bottomButton__horizontalDefault{margin:-10px 22px 30px;position:static}.impact-date-picker-dropdown-container .DayPickerNavigation_leftButton__horizontalDefault{left:22px}.impact-date-picker-dropdown-container .DayPickerNavigation_rightButton__horizontalDefault{right:22px;transform:rotate(-90deg)}.impact-date-picker-dropdown-container .DayPickerNavigation_button__verticalDefault{background:#fff;box-shadow:0 0 5px 2px #0000001a;display:inline-block;height:100%;padding:5px;position:relative;text-align:center;width:50%}.impact-date-picker-dropdown-container .DayPickerNavigation_nextButton__verticalDefault{border-left:0}.impact-date-picker-dropdown-container .DayPickerNavigation_nextButton__verticalScrollableDefault,.impact-date-picker-dropdown-container .DayPickerNavigation_prevButton__verticalScrollableDefault{width:100%}.impact-date-picker-dropdown-container .DayPickerNavigation_svg__vertical{fill:#484848;height:42px;width:42px}.impact-date-picker-dropdown-container .DayPickerNavigation_svg__disabled{fill:#f2f2f2}.impact-date-picker-dropdown-container .CalendarMonth_table{border-collapse:initial;border-spacing:10px 8px;padding-top:8px}.impact-date-picker-dropdown-container .CalendarDay__default{border:none;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:12px;font-weight:400;height:20px!important;line-height:16.39px;padding-top:2px;width:20px!important}.impact-date-picker-dropdown-container .CalendarDay__default:hover{background:#eceefd!important;border-radius:8px;color:#4259ee;outline:1px solid #b3bdf8}.impact-date-picker-dropdown-container .CalendarDay__selected,.impact-date-picker-dropdown-container .CalendarDay__selected:active,.impact-date-picker-dropdown-container .CalendarDay__selected:hover{background:#4259ee!important;border-radius:8px;color:#fff}.impact-date-picker-dropdown-container .CalendarDay__blocked_out_of_range{color:#c3c8d4!important}.impact-date-picker-dropdown-container .DayPicker_weekHeader_li{display:inline-block;margin-left:10px;text-align:center;width:20px!important}.datePicker-buttons-container{display:flex;gap:16px;justify-content:flex-end;padding:10px 19px;position:relative}.datePicker-buttons-container:before{background-color:#d4d4d4;content:"";height:1px;left:10px;position:absolute;top:0;width:90%}.datePicker-buttons-container.datePicker-buttons-container--hidden{display:none}.showWeekNumbers .DayPicker_weekHeader:after{left:25px}.showWeekNumbers .CalendarMonth_table{left:12px;padding-top:4px;position:relative}.showWeekNumbers .CalendarMonth_table tbody{position:relative}.showWeekNumbers .CalendarMonth_table tbody:before{background-color:#d4d4d4;content:"";height:calc(100% - 6px);left:-5px;position:absolute;top:6px;width:1px;z-index:1}.showWeekNumbers .CalendarDayWeekNumber{border-right:none!important;color:#757575;display:none;display:block;font-family:Manrope,sans-serif;font-size:11px;font-weight:500;left:-30px;position:absolute;width:18px}.impact-portal-container{position:absolute;z-index:9999}.impact-datepicker-full-width-main-container .datePicker-input-container{width:100%}.date-picker-show-month-year-select-container{align-items:center;display:flex;justify-content:space-between;left:23px;position:relative;top:-6px;width:188px;z-index:9999}.date-picker-show-month-year-select-container .date-picker-month-select-container{width:105px}.date-picker-show-month-year-select-container .date-picker-month-select-container .ia-select-styled-dropdown-main-button{min-width:105px;width:105px}.date-picker-show-month-year-select-container .date-picker-month-select-container .ia-select-button-clear-icon{display:none}.date-picker-show-month-year-select-container .date-picker-month-select-container .ia-select-chevron-icon{display:none;margin-left:-50px;width:10px}.date-picker-show-month-year-select-container .date-picker-year-select-container{width:80px}.date-picker-show-month-year-select-container .date-picker-year-select-container .ia-select-styled-dropdown-main-button{min-width:80px;width:80px}.date-picker-show-month-year-select-container .date-picker-year-select-container .ia-select-button-clear-icon{display:none}.date-picker-show-month-year-select-container .date-picker-year-select-container .ia-select-chevron-icon{display:none;margin-left:-110px;width:10px}.date-picker-month-select-dropdown,.date-picker-year-select-dropdown{min-width:115px!important;width:115px!important}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import "../../node_modules/react-dates/lib/initialize.js";
import { DatePickerDropdown } from "./datePickerDropdown.js";
import { DatePickerInput } from "./datePickerInput.js";


const DatePicker = forwardRef(
  ({
    fullWidth,
    label,
    isRequired,
    labelOrientation = "top",
    isError,
    isDisabled,
    closeOnDateSelect,
    placeholder,
    selectedDate,
    setSelectedDate,
    handleDateChange,
    showWeekNumbers,
    primaryButtonProps,
    secondaryButtonProps,
    tertiaryButtonProps,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    onTertiaryButtonClick,
    withPortal,
    portalContainer = typeof document !== "undefined" ? document.body : void 0,
    showMonthYearSelect,
    customYears,
    displayFormat = "DD-MM-YYYY",
    minDate,
    maxDate,
    onClickOutside,
    isOutsideRange,
    isAgGridCellRenderer = false,
    customIcon,
    readOnly,
    inputProps,
    hideTertiaryButton,
    hideSecondaryButton,
    hidePrimaryButton,
    className,
    id,
    "data-testid": dataTestId,
    ...args
  }, ref) => {
    const dateString = selectedDate && moment.isMoment(selectedDate) && selectedDate.isValid() ? selectedDate.format(displayFormat) : "";
    const datePickerMainContainerRef = useRef(null);
    const inputContainerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState(dateString || "");
    const [cancelTrigger, setCancelTrigger] = useState(0);
    const [placement, setPlacement] = useState("bottom");
    const allButtonsHidden = Boolean(
      hideTertiaryButton && hideSecondaryButton && hidePrimaryButton
    );
    useEffect(() => {
      setInputValue(dateString || "");
    }, [dateString]);
    const updatePlacement = useCallback(() => {
      var _a, _b;
      const rect = (_a = datePickerMainContainerRef.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!rect) return;
      const viewportHeight = window.innerHeight;
      const spacing = 6;
      const measuredHeight = (_b = dropdownRef.current) == null ? void 0 : _b.getBoundingClientRect().height;
      const dropdownHeight = measuredHeight || (allButtonsHidden ? 250 : 300);
      const spaceBelow = viewportHeight - rect.bottom;
      if (spaceBelow >= dropdownHeight + spacing) {
        setPlacement("bottom");
      } else {
        setPlacement("top");
      }
    }, [allButtonsHidden]);
    useEffect(() => {
      if (!isOpen) return;
      let frame = null;
      const handleUpdate = () => {
        if (frame !== null) return;
        frame = requestAnimationFrame(() => {
          updatePlacement();
          frame = null;
        });
      };
      updatePlacement();
      window.addEventListener("resize", handleUpdate);
      window.addEventListener("scroll", handleUpdate, true);
      return () => {
        window.removeEventListener("resize", handleUpdate);
        window.removeEventListener("scroll", handleUpdate, true);
        if (frame !== null) cancelAnimationFrame(frame);
      };
    }, [isOpen, updatePlacement]);
    const handleDateStringChange = (value) => {
      if (value === null || value === "" || value === displayFormat) {
        setSelectedDate == null ? void 0 : setSelectedDate(null);
        setInputValue("");
        return;
      }
      if (moment.isMoment(value)) {
        if (minDate && value.isBefore(minDate, "day")) {
          setInputValue(value.format(displayFormat));
          setSelectedDate == null ? void 0 : setSelectedDate(null);
          return;
        }
        if (maxDate && value.isAfter(maxDate, "day")) {
          setInputValue(value.format(displayFormat));
          setSelectedDate == null ? void 0 : setSelectedDate(null);
          return;
        }
        setSelectedDate == null ? void 0 : setSelectedDate(value);
        setInputValue(value.format(displayFormat));
      } else {
        const parsedDate = moment(value, displayFormat, true);
        if (parsedDate.isValid()) {
          if (minDate != null && parsedDate.isBefore(minDate, "day")) {
            setInputValue(value);
            setSelectedDate == null ? void 0 : setSelectedDate(null);
            return;
          }
          if (maxDate != null && parsedDate.isAfter(maxDate, "day")) {
            setInputValue(value);
            setSelectedDate == null ? void 0 : setSelectedDate(null);
            return;
          }
          setSelectedDate == null ? void 0 : setSelectedDate(parsedDate);
        }
        setInputValue(value);
      }
    };
    const handleClear = () => {
      setSelectedDate == null ? void 0 : setSelectedDate(null);
      setInputValue("");
      setCancelTrigger((prev) => prev + 1);
      onTertiaryButtonClick == null ? void 0 : onTertiaryButtonClick();
      setFocused(false);
      setTimeout(() => {
        setFocused(true);
      }, 0);
    };
    const handleCancel = () => {
      setIsOpen(false);
      onSecondaryButtonClick == null ? void 0 : onSecondaryButtonClick();
    };
    const handleClickOutside = useCallback(
      (event) => {
        var _a;
        const target = event.target;
        const el = target;
        const isWithinMainContainer = (_a = datePickerMainContainerRef.current) == null ? void 0 : _a.contains(target);
        const isWithinPortalContainer = withPortal && el.closest(".impact-portal-container");
        const isWithinButtonsContainer = el.closest(".datePicker-buttons-container");
        if (!isWithinMainContainer && !isWithinPortalContainer && !isWithinButtonsContainer && !isAgGridCellRenderer && !el.closest(".ia-select-container-v3-styled-menu ") && isOpen) {
          onClickOutside == null ? void 0 : onClickOutside();
          setIsOpen(false);
        }
      },
      [isOpen, isAgGridCellRenderer, withPortal, onClickOutside]
    );
    useEffect(() => {
      setFocused(isOpen);
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClickOutside]);
    const onDatesChange = (date) => {
      if (handleDateChange) {
        handleDateChange(date);
      } else {
        setSelectedDate == null ? void 0 : setSelectedDate(date);
      }
      if (closeOnDateSelect) {
        setIsOpen(false);
      }
    };
    const computedIsError = useMemo(
      () => Boolean(isError ?? (selectedDate != null && (isOutsideRange == null ? void 0 : isOutsideRange(selectedDate)))),
      [isError, selectedDate, isOutsideRange]
    );
    const normalizedCustomYears = useMemo(() => {
      if (!customYears || customYears.length === 0) return void 0;
      const first = customYears[0];
      if (first !== null && typeof first === "object" && "label" in first) {
        return customYears;
      }
      return customYears.map((y) => ({ label: String(y), value: String(y) }));
    }, [customYears]);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `impact-datepicker-main-container ${labelOrientation === "left" ? "label-flex-row" : "label-flex-column"} ${fullWidth === true ? "impact-datepicker-full-width-main-container" : ""} ${className ?? ""}`.trim(),
        children: [
          label && /* @__PURE__ */ jsxs("div", { className: "datePicker-label", children: [
            label,
            " ",
            isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: datePickerMainContainerRef, className: "datePicker-container", children: [
            /* @__PURE__ */ jsx(
              DatePickerInput,
              {
                ref,
                customIcon,
                "data-testid": dataTestId,
                dateString: inputValue,
                displayFormat,
                id,
                inputContainerRef,
                inputProps,
                isDisabled,
                isError: computedIsError,
                isOpen,
                maxDate: maxDate ?? null,
                minDate: minDate ?? null,
                placeholder,
                readOnly,
                selectedDate: selectedDate ?? null,
                setIsOpen,
                onCancel: cancelTrigger,
                onDateStringChange: handleDateStringChange
              }
            ),
            isOpen && /* @__PURE__ */ jsx(
              DatePickerDropdown,
              {
                allButtonsHidden,
                containerRef: datePickerMainContainerRef,
                customYears: normalizedCustomYears,
                dropdownRef,
                focused,
                hidePrimaryButton,
                hideSecondaryButton,
                hideTertiaryButton,
                isOutsideRange,
                maxDate: maxDate ?? null,
                minDate: minDate ?? null,
                placement,
                portalContainer,
                primaryButtonProps,
                secondaryButtonProps,
                selectedDate: selectedDate ?? null,
                setFocused,
                setIsOpen,
                setSelectedDate,
                showMonthYearSelect,
                showWeekNumbers,
                tertiaryButtonProps,
                withPortal,
                onDatesChange,
                onPrimaryButtonClick,
                onSecondaryButtonClick: handleCancel,
                onTertiaryButtonClick: handleClear,
                ...args
              }
            )
          ] })
        ]
      }
    );
  }
);
DatePicker.displayName = "DatePicker";
export {
  DatePicker
};
