!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('.PresetDateRangePicker_panel{padding:0 22px 11px}.PresetDateRangePicker_button{background:0 0;border:2px solid #00a699;-moz-box-sizing:border-box;box-sizing:border-box;color:#00a699;cursor:pointer;font:inherit;font-weight:700;height:100%;line-height:normal;margin-right:8px;overflow:visible;padding:4px 12px;position:relative;text-align:center}.PresetDateRangePicker_button:active{outline:0}.PresetDateRangePicker_button__selected{background:#00a699;color:#fff}.SingleDatePickerInput{background-color:#fff;display:inline-block}.SingleDatePickerInput__withBorder{border:1px solid #dbdbdb;border-radius:2px}.SingleDatePickerInput__rtl{direction:rtl}.SingleDatePickerInput__disabled{background-color:#f2f2f2}.SingleDatePickerInput__block{display:block}.SingleDatePickerInput__showClearDate{padding-right:30px}.SingleDatePickerInput_clearDate{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;margin:0 10px 0 5px;overflow:visible;padding:10px;position:absolute;right:0;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.SingleDatePickerInput_clearDate__default:focus,.SingleDatePickerInput_clearDate__default:hover{background:#dbdbdb;border-radius:50%}.SingleDatePickerInput_clearDate__small{padding:6px}.SingleDatePickerInput_clearDate__hide{visibility:hidden}.SingleDatePickerInput_clearDate_svg{fill:#82888a;height:12px;vertical-align:middle;width:15px}.SingleDatePickerInput_clearDate_svg__small{height:9px}.SingleDatePickerInput_calendarIcon{background:0 0;border:0;color:inherit;cursor:pointer;display:inline-block;font:inherit;line-height:normal;margin:0 5px 0 10px;overflow:visible;padding:10px;vertical-align:middle}.SingleDatePickerInput_calendarIcon_svg{fill:#82888a;height:15px;vertical-align:middle;width:14px}.SingleDatePicker{display:inline-block;position:relative}.SingleDatePicker__block{display:block}.SingleDatePicker_picker{background-color:#fff;position:absolute;z-index:1}.SingleDatePicker_picker__rtl{direction:rtl}.SingleDatePicker_picker__directionLeft{left:0}.SingleDatePicker_picker__directionRight{right:0}.SingleDatePicker_picker__portal{background-color:#0000004d;height:100%;left:0;position:fixed;top:0;width:100%}.SingleDatePicker_picker__fullScreenPortal{background-color:#fff}.SingleDatePicker_closeButton{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;overflow:visible;padding:15px;position:absolute;right:0;top:0;z-index:2}.SingleDatePicker_closeButton:focus,.SingleDatePicker_closeButton:hover{color:darken(#cacccd,10%);text-decoration:none}.SingleDatePicker_closeButton_svg{fill:#cacccd;height:15px;width:15px}.DayPickerKeyboardShortcuts_buttonReset{background:0 0;border:0;border-radius:0;color:inherit;cursor:pointer;font:inherit;font-size:14px;line-height:normal;overflow:visible;padding:0}.DayPickerKeyboardShortcuts_buttonReset:active{outline:0}.DayPickerKeyboardShortcuts_show{height:26px;position:absolute;width:33px;z-index:2}.DayPickerKeyboardShortcuts_show:before{content:"";display:block;position:absolute}.DayPickerKeyboardShortcuts_show__bottomRight{bottom:0;right:0}.DayPickerKeyboardShortcuts_show__bottomRight:before{border-right:33px solid #00a699;border-top:26px solid #0000;bottom:0;right:0}.DayPickerKeyboardShortcuts_show__bottomRight:hover:before{border-right:33px solid #008489}.DayPickerKeyboardShortcuts_show__topRight{right:0;top:0}.DayPickerKeyboardShortcuts_show__topRight:before{border-bottom:26px solid #0000;border-right:33px solid #00a699;right:0;top:0}.DayPickerKeyboardShortcuts_show__topRight:hover:before{border-right:33px solid #008489}.DayPickerKeyboardShortcuts_show__topLeft{left:0;top:0}.DayPickerKeyboardShortcuts_show__topLeft:before{border-bottom:26px solid #0000;border-left:33px solid #00a699;left:0;top:0}.DayPickerKeyboardShortcuts_show__topLeft:hover:before{border-left:33px solid #008489}.DayPickerKeyboardShortcuts_showSpan{color:#fff;position:absolute}.DayPickerKeyboardShortcuts_showSpan__bottomRight{bottom:0;right:5px}.DayPickerKeyboardShortcuts_showSpan__topRight{right:5px;top:1px}.DayPickerKeyboardShortcuts_showSpan__topLeft{left:5px;top:1px}.DayPickerKeyboardShortcuts_panel{background:#fff;border:1px solid #dbdbdb;border-radius:2px;bottom:0;left:0;margin:33px;overflow:auto;padding:22px;position:absolute;right:0;text-align:left;top:0;z-index:2}.DayPickerKeyboardShortcuts_title{font-size:16px;font-weight:700;margin:0}.DayPickerKeyboardShortcuts_list{font-size:14px;list-style:none;padding:0}.DayPickerKeyboardShortcuts_close{position:absolute;right:22px;top:22px;z-index:2}.DayPickerKeyboardShortcuts_close:active{outline:0}.DayPickerKeyboardShortcuts_closeSvg{fill:#cacccd;height:15px;width:15px}.DayPickerKeyboardShortcuts_closeSvg:focus,.DayPickerKeyboardShortcuts_closeSvg:hover{fill:#82888a}.CalendarDay{-moz-box-sizing:border-box;box-sizing:border-box;cursor:pointer;font-size:14px;text-align:center}.CalendarDay:active{outline:0}.CalendarDay__defaultCursor{cursor:default}.CalendarDay__default{background:#fff;border:1px solid #e4e7e7;color:#484848}.CalendarDay__default:hover{background:#e4e7e7;border:1px solid #e4e7e7;color:inherit}.CalendarDay__hovered_offset{background:#f4f5f5;border:1px double #e4e7e7;color:inherit}.CalendarDay__outside{background:#fff;border:0;color:#484848}.CalendarDay__outside:hover{border:0}.CalendarDay__blocked_minimum_nights{background:#fff;border:1px solid #eceeee;color:#cacccd}.CalendarDay__blocked_minimum_nights:active,.CalendarDay__blocked_minimum_nights:hover{background:#fff;color:#cacccd}.CalendarDay__highlighted_calendar{background:#ffe8bc;color:#484848}.CalendarDay__highlighted_calendar:active,.CalendarDay__highlighted_calendar:hover{background:#ffce71;color:#484848}.CalendarDay__selected_span{background:#66e2da;border:1px double #33dacd;color:#fff}.CalendarDay__selected_span:active,.CalendarDay__selected_span:hover{background:#33dacd;border:1px double #33dacd;color:#fff}.CalendarDay__selected,.CalendarDay__selected:active,.CalendarDay__selected:hover{background:#00a699;border:1px double #00a699;color:#fff}.CalendarDay__hovered_span,.CalendarDay__hovered_span:hover{background:#b2f1ec;border:1px double #80e8e0;color:#007a87}.CalendarDay__hovered_span:active{background:#80e8e0;border:1px double #80e8e0;color:#007a87}.CalendarDay__blocked_calendar,.CalendarDay__blocked_calendar:active,.CalendarDay__blocked_calendar:hover{background:#cacccd;border:1px solid #cacccd;color:#82888a}.CalendarDay__blocked_out_of_range,.CalendarDay__blocked_out_of_range:active,.CalendarDay__blocked_out_of_range:hover{background:#fff;border:1px solid #e4e7e7;color:#cacccd}.CalendarDay__hovered_start_first_possible_end{background:#eceeee;border:1px double #eceeee}.CalendarDay__hovered_start_blocked_min_nights{background:#eceeee;border:1px double #e4e7e7}.CalendarMonth{background:#fff;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:top}.CalendarMonth_table{border-collapse:collapse;border-spacing:0}.CalendarMonth_verticalSpacing{border-collapse:initial}.CalendarMonth_caption{caption-side:top;color:#484848;font-size:18px;padding-bottom:37px;padding-top:22px;text-align:center}.CalendarMonth_caption__verticalScrollable{padding-bottom:7px;padding-top:12px}.CalendarMonthGrid{background:#fff;text-align:left;z-index:0}.CalendarMonthGrid__animating{z-index:1}.CalendarMonthGrid__horizontal{left:9px;position:absolute}.CalendarMonthGrid__vertical,.CalendarMonthGrid__vertical_scrollable{margin:0 auto}.CalendarMonthGrid_month__horizontal{display:inline-block;min-height:100%;vertical-align:top}.CalendarMonthGrid_month__hideForAnimation{opacity:0;pointer-events:none;position:absolute;z-index:-1}.CalendarMonthGrid_month__hidden{visibility:hidden}.DayPickerNavigation{position:relative;z-index:2}.DayPickerNavigation__horizontal{height:0}.DayPickerNavigation__verticalScrollable_prevNav{z-index:1}.DayPickerNavigation__verticalDefault{bottom:0;height:52px;left:0;position:absolute;width:100%}.DayPickerNavigation__verticalScrollableDefault{position:relative}.DayPickerNavigation__bottom{height:auto}.DayPickerNavigation__bottomDefault{-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between}.DayPickerNavigation_button{border:0;cursor:pointer;margin:0;padding:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DayPickerNavigation_button__default{background-color:#fff;border:1px solid #e4e7e7;color:#757575}.DayPickerNavigation_button__default:focus,.DayPickerNavigation_button__default:hover{border:1px solid #c4c4c4}.DayPickerNavigation_button__default:active{background:#f2f2f2}.DayPickerNavigation_button__disabled{border:1px solid #f2f2f2;cursor:default}.DayPickerNavigation_button__disabled:focus,.DayPickerNavigation_button__disabled:hover{border:1px solid #f2f2f2}.DayPickerNavigation_button__disabled:active{background:0 0}.DayPickerNavigation_button__horizontalDefault{border-radius:3px;line-height:.78;padding:6px 9px;position:absolute;top:18px}.DayPickerNavigation_bottomButton__horizontalDefault{margin:-10px 22px 30px;position:static}.DayPickerNavigation_leftButton__horizontalDefault{left:22px}.DayPickerNavigation_rightButton__horizontalDefault{right:22px}.DayPickerNavigation_button__verticalDefault{background:#fff;box-shadow:0 0 5px 2px #0000001a;display:inline-block;height:100%;padding:5px;position:relative;text-align:center;width:50%}.DayPickerNavigation_nextButton__verticalDefault{border-left:0}.DayPickerNavigation_nextButton__verticalScrollableDefault,.DayPickerNavigation_prevButton__verticalScrollableDefault{width:100%}.DayPickerNavigation_svg__horizontal{display:block;fill:#82888a;height:19px;width:19px}.DayPickerNavigation_svg__vertical{fill:#484848;height:42px;width:42px}.DayPickerNavigation_svg__disabled{fill:#f2f2f2}.DayPicker{position:relative;text-align:left}.DayPicker,.DayPicker__horizontal{background:#fff}.DayPicker__verticalScrollable{height:100%}.DayPicker__hidden{visibility:hidden}.DayPicker__withBorder{border-radius:3px;box-shadow:0 2px 6px #0000000d,0 0 0 1px #00000012}.DayPicker_portal__horizontal{box-shadow:none;left:50%;position:absolute;top:50%}.DayPicker_portal__vertical{position:static}.DayPicker_focusRegion{outline:0}.DayPicker_calendarInfo__horizontal,.DayPicker_wrapper__horizontal{display:inline-block;vertical-align:top}.DayPicker_weekHeaders{position:relative}.DayPicker_weekHeaders__horizontal{margin-left:9px}.DayPicker_weekHeader{color:#757575;position:absolute;text-align:left;top:62px;z-index:2}.DayPicker_weekHeader__vertical{left:50%}.DayPicker_weekHeader__verticalScrollable{background:#fff;border-bottom:1px solid #dbdbdb;display:table-row;left:0;margin-left:0;text-align:center;top:0;width:100%}.DayPicker_weekHeader_ul{font-size:14px;list-style:none;margin:1px 0;padding-left:0;padding-right:0}.DayPicker_weekHeader_li{display:inline-block;text-align:center}.DayPicker_transitionContainer{border-radius:3px;overflow:hidden;position:relative}.DayPicker_transitionContainer__horizontal{-webkit-transition:height .2s ease-in-out;-moz-transition:height .2s ease-in-out;transition:height .2s ease-in-out}.DayPicker_transitionContainer__vertical{width:100%}.DayPicker_transitionContainer__verticalScrollable{bottom:0;height:100%;left:0;overflow-y:scroll;padding-top:20px;position:absolute;right:0;top:0}.DateInput{background:#fff;display:inline-block;margin:0;padding:0;position:relative;vertical-align:middle;width:130px}.DateInput__small{width:97px}.DateInput__block{width:100%}.DateInput__disabled{background:#f2f2f2;color:#dbdbdb}.DateInput_input{background-color:#fff;border:0;border-bottom:2px solid #0000;border-radius:0;color:#484848;font-size:19px;font-weight:200;line-height:24px;padding:11px 11px 9px;width:100%}.DateInput_input__small{font-size:15px;letter-spacing:.2px;line-height:18px;padding:7px 7px 5px}.DateInput_input__regular{font-weight:auto}.DateInput_input__readOnly{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.DateInput_input__focused{background:#fff;border:0;border-bottom:2px solid #008489;outline:0}.DateInput_input__disabled{background:#f2f2f2;font-style:italic}.DateInput_screenReaderMessage{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.DateInput_fang{height:10px;left:22px;position:absolute;width:20px;z-index:2}.DateInput_fangShape{fill:#fff}.DateInput_fangStroke{fill:#0000;stroke:#dbdbdb}.DateRangePickerInput{background-color:#fff;display:inline-block}.DateRangePickerInput__disabled{background:#f2f2f2}.DateRangePickerInput__withBorder{border:1px solid #dbdbdb;border-radius:2px}.DateRangePickerInput__rtl{direction:rtl}.DateRangePickerInput__block{display:block}.DateRangePickerInput__showClearDates{padding-right:30px}.DateRangePickerInput_arrow{color:#484848;display:inline-block;vertical-align:middle}.DateRangePickerInput_arrow_svg{fill:#484848;height:24px;vertical-align:middle;width:24px}.DateRangePickerInput_clearDates{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;margin:0 10px 0 5px;overflow:visible;padding:10px;position:absolute;right:0;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.DateRangePickerInput_clearDates__small{padding:6px}.DateRangePickerInput_clearDates_default:focus,.DateRangePickerInput_clearDates_default:hover{background:#dbdbdb;border-radius:50%}.DateRangePickerInput_clearDates__hide{visibility:hidden}.DateRangePickerInput_clearDates_svg{fill:#82888a;height:12px;vertical-align:middle;width:15px}.DateRangePickerInput_clearDates_svg__small{height:9px}.DateRangePickerInput_calendarIcon{background:0 0;border:0;color:inherit;cursor:pointer;display:inline-block;font:inherit;line-height:normal;margin:0 5px 0 10px;overflow:visible;padding:10px;vertical-align:middle}.DateRangePickerInput_calendarIcon_svg{fill:#82888a;height:15px;vertical-align:middle;width:14px}.DateRangePicker{display:inline-block;position:relative}.DateRangePicker__block{display:block}.DateRangePicker_picker{background-color:#fff;position:absolute;z-index:1}.DateRangePicker_picker__rtl{direction:rtl}.DateRangePicker_picker__directionLeft{left:0}.DateRangePicker_picker__directionRight{right:0}.DateRangePicker_picker__portal{background-color:#0000004d;height:100%;left:0;position:fixed;top:0;width:100%}.DateRangePicker_picker__fullScreenPortal{background-color:#fff}.DateRangePicker_closeButton{background:0 0;border:0;color:inherit;cursor:pointer;font:inherit;line-height:normal;overflow:visible;padding:15px;position:absolute;right:0;top:0;z-index:2}.DateRangePicker_closeButton:focus,.DateRangePicker_closeButton:hover{color:darken(#cacccd,10%);text-decoration:none}.DateRangePicker_closeButton_svg{fill:#cacccd;height:15px;width:15px}\n@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact-portal-container{position:absolute;z-index:9999}.impact-dateRangePicker-main-container{display:flex;font-family:Manrope,sans-serif}.impact-dateRangePicker-main-container.label-flex-row{align-items:center;flex-direction:row;gap:16px}.impact-dateRangePicker-main-container.label-flex-column{flex-direction:column}.impact-dateRangePicker-main-container.label-flex-column .dateRangePicker-label{margin-bottom:6px}.impact-dateRangePicker-main-container .dateRangePicker-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:18px}.impact-dateRangePicker-main-container .dateRangePicker-container{position:relative;width:240px}.impact-dateRangePicker-main-container .dateRangePicker-input-container{box-sizing:border-box;display:flex;height:32px;width:100%}.impact-dateRangePicker-main-container .dateRangePicker-input-container:focus-within .dateRangePicker-input-start-date,.impact-dateRangePicker-main-container .dateRangePicker-input-container:hover .dateRangePicker-input-start-date{border:1px solid #4259ee;border-right:none}.impact-dateRangePicker-main-container .dateRangePicker-input-container:focus-within .dateRangePicker-input-end-date,.impact-dateRangePicker-main-container .dateRangePicker-input-container:hover .dateRangePicker-input-end-date{border:1px solid #4259ee;border-left:none}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-start-date{border:1px solid #c3c8d4;border-radius:8px 0 0 8px;border-right:none;box-sizing:border-box;flex:.8 1 0;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;padding-left:12px;width:100%}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-start-date:focus{outline:none}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-start-date:focus::placeholder{color:#4259ee}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-end-date{background-color:#fff;background-position:center right 12px;border:1px solid #c3c8d4;border-left:none;border-radius:0 8px 8px 0;box-sizing:border-box;flex:1 1 0;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;width:100%}@media screen and (max-width:1399px) and (min-width:1200px){.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-end-date{background-position:center right 10px;background-size:13px;padding-left:10px}}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-end-date:focus{outline:none}.impact-dateRangePicker-main-container .dateRangePicker-input-container .dateRangePicker-input-end-date:focus::placeholder{color:#4259ee}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled:hover .dateRangePicker-input-start-date{border:1px solid #d9dde7;border-right:none}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled:hover .dateRangePicker-input-end-date{border:1px solid #d9dde7;border-left:none}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled .dateRangePicker-input-start-date{background-color:#f2f4fb;border-bottom:1px solid #d9dde7;border-left:1px solid #d9dde7;border-top:1px solid #d9dde7;pointer-events:none!important}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled .dateRangePicker-input-start-date:hover{border:1px solid #d9dde7}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled .dateRangePicker-input-end-date{background-color:#f2f4fb;border-bottom:1px solid #d9dde7;border-right:1px solid #d9dde7;border-top:1px solid #d9dde7;pointer-events:none!important}.impact-dateRangePicker-main-container .dateRangePicker-input-disabled .dateRangePicker-input-end-date:hover{border:1px solid #d9dde7}.impact-dateRangePicker-main-container .impact-dateRangePicker-error:hover .dateRangePicker-input-start-date{border:1px solid red;border-right:none}.impact-dateRangePicker-main-container .impact-dateRangePicker-error:hover .dateRangePicker-input-end-date{border:1px solid red;border-left:none}.impact-dateRangePicker-main-container .impact-dateRangePicker-error .dateRangePicker-input-start-date{border-bottom:1px solid red;border-left:1px solid red;border-top:1px solid red}.impact-dateRangePicker-main-container .impact-dateRangePicker-error .dateRangePicker-input-start-date:focus::placeholder{color:red}.impact-dateRangePicker-main-container .impact-dateRangePicker-error .dateRangePicker-input-end-date{border-bottom:1px solid red;border-right:1px solid red;border-top:1px solid red}.impact-dateRangePicker-main-container .impact-dateRangePicker-error .dateRangePicker-input-end-date:focus::placeholder{color:red}.impact-dateRangePicker-full-width-main-container .dateRangePicker-container{width:100%}.impact-dateRangePicker-dropdown-container{background-color:#fff;border:none;border-radius:8px;box-shadow:0 1px 6px #00000029;display:flex;flex-direction:row;left:0;position:absolute;top:35px;width:auto;z-index:9999}.impact-dateRangePicker-dropdown-container .DayPicker_transitionContainer{height:240px!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container{width:450px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker{height:fit-content;width:432px!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker>div{height:inherit;width:432px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker>div>div{height:inherit;width:432px!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker__withBorder{border-radius:unset;box-shadow:none}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker__horizontal{background:#0000}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonthGrid__horizontal{display:flex!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth_caption{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;padding-bottom:30px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container.showMonthYearSelect .CalendarMonth_caption{padding-bottom:12px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker_weekHeader_li small{line-height:20px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker_weekHeader_li{box-sizing:border-box;display:block;margin:0!important;text-align:center;width:20px!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker_weekHeader{box-sizing:border-box;top:50px;width:207px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker_weekHeader ul{align-items:center;box-sizing:border-box;column-gap:5px;display:grid;font-family:Manrope,sans-serif;font-size:12px;font-weight:400;grid-template-columns:repeat(7,20px);justify-content:center;margin:0;padding:0;width:100%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPicker_weekHeader:after{background-color:#d4d4d4;bottom:-2px;content:"";height:1px;left:12px;position:absolute;right:12px;width:auto}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation{position:relative;z-index:2}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__horizontal{height:0}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__verticalScrollable_prevNav{z-index:1}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__verticalDefault{bottom:0;height:52px;left:0;position:absolute;width:100%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__verticalScrollableDefault{position:relative}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__bottom{height:auto}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation__bottomDefault{-webkit-box-pack:justify;-ms-flex-pack:justify;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button{border:0;cursor:pointer;margin:0;padding:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button__default{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/accordion-chevron.svg) no-repeat;background-size:12px;transform:rotate(90deg)}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button__default svg{display:none}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button__disabled{opacity:.8}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button__horizontalDefault{border-radius:3px;line-height:.78;padding:6px;position:absolute;top:25px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_bottomButton__horizontalDefault{margin:-10px 22px 30px;position:static}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_leftButton__horizontalDefault{left:20px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_rightButton__horizontalDefault{right:15px;transform:rotate(-90deg)}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_button__verticalDefault{background:#fff;box-shadow:0 0 5px 2px #0000001a;display:inline-block;height:100%;padding:5px;position:relative;text-align:center;width:50%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_nextButton__verticalDefault{border-left:0}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_nextButton__verticalScrollableDefault,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_prevButton__verticalScrollableDefault{width:100%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_svg__vertical{fill:#484848;height:42px;width:42px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .DayPickerNavigation_svg__disabled{fill:#f2f2f2}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth{background:#0000;box-sizing:border-box;width:207px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth_table{border-collapse:initial;border-spacing:0;box-sizing:border-box;column-gap:5px;display:grid;grid-template-columns:repeat(7,20px);justify-content:center;padding-top:8px;width:100%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth_table tbody,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth_table tr{display:contents}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarMonth_table td.CalendarDay{margin-top:6px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__default{border:none;box-sizing:border-box;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:12px;font-weight:400;height:20px!important;line-height:16.39px;padding-top:2px;width:20px!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__hovered_span,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__selected_span{background:#e7eaff;position:relative}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__hovered_span:after,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__selected_span:after{background:#eceefd;bottom:0;content:"";left:-4px;position:absolute;right:-4px;top:0;z-index:-1}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__default:hover{background:#eceefd!important;border-radius:8px;color:#4259ee;outline:1px solid #b3bdf8}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__selected,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__selected:active,.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__selected:hover{background:#4259ee!important;border:none;border-radius:8px;color:#fff}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .CalendarDay__blocked_out_of_range{color:#c3c8d4!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .dateRangePicker-footer-container{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:10px 19px;position:relative}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .dateRangePicker-footer-container:before{background-color:#d4d4d4;content:"";height:1px;left:10px;position:absolute;top:0;width:95%}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .dateRangePicker-footer-container .dateRangePicker-footer-label-container{align-items:center;color:#60697d;display:flex;flex-direction:row;font-size:12px;font-weight:500;gap:4px;line-height:18px}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .dateRangePicker-footer-container .dateRangePicker-footer-label-container .dateRangePicker-footer-value{color:#0d152c;font-weight:600}.impact-dateRangePicker-dropdown-container .dateRangePicker-left-container .dateRangePicker-footer-container .dateRangePicker-buttons-right-container{align-items:center;display:flex;flex-direction:row;gap:8px}.impact-dateRangePicker-dropdown-container .dateRangePicker-show-range-main-container{padding:16px 8px;position:relative;width:100%;z-index:1}.impact-dateRangePicker-dropdown-container .dateRangePicker-show-range-main-container:before{background-color:#d4d4d4;content:"";height:85%;left:0;position:absolute;top:20px;width:1px}.impact-dateRangePicker-dropdown-container .dateRangePicker-show-range-main-container .dateRangePicker-shortcut-heading{color:#60697d;font-size:12px;font-weight:500;line-height:18px;margin-bottom:8px;text-align:center}.impact-dateRangePicker-dropdown-container .dateRangePicker-show-range-main-container .dateRangePicker-shortcut-list .ia-radioButton{margin:0!important}.impact-dateRangePicker-dropdown-container .dateRangePicker-show-range-main-container .dateRangePicker-shortcut-list .ia-radioButton .MuiTypography-root{font-size:12px}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarMonth,.impact-dateRangePicker-dropdown-container .showWeekNumbers .DayPicker_weekHeader{width:215px}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarMonth_table,.impact-dateRangePicker-dropdown-container .showWeekNumbers .DayPicker_weekHeader ul{transform:translate(10px)}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarMonth_table{justify-content:flex-start;left:6px;position:relative}.impact-dateRangePicker-dropdown-container .showWeekNumbers .DayPickerNavigation_rightButton__horizontalDefault{right:3px}.impact-dateRangePicker-dropdown-container .showWeekNumbers .DayPicker_weekHeader:after{left:20px}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarMonth_table tbody{position:relative}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarMonth_table tbody:before{background-color:#d4d4d4;content:"";height:100%;left:-5px;position:absolute;top:8px;width:1px;z-index:1}.impact-dateRangePicker-dropdown-container .showWeekNumbers .CalendarDayWeekNumber{border-right:none!important;color:#757575;display:none;display:block;font-family:Manrope,sans-serif;font-size:11px;font-weight:500;left:-30px;position:absolute;width:18px}.impact-dateRangePicker-dropdown-container .showWeekNumbers .suppress-click-on-week-number{pointer-events:none}.showRangeSelector{width:max-content}.date-range-picker-show-month-year-select-container{align-items:center;display:flex;justify-content:space-between;left:20px;position:relative;top:-6px;width:150px;z-index:9999}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container{width:80px}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container .ia-select-styled-dropdown-main-button{min-width:80px;width:80px}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container .ia-select-styled-dropdown-main-button .ia-select-button-text-full-width{width:80px}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container .ia-select-button-clear-icon{display:none}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container .ia-select-chevron-icon{display:none;margin-left:-50px;width:10px}.date-range-picker-show-month-year-select-container .date-range-picker-month-select-container .ia-select-button-text-span{width:60px}.date-range-picker-show-month-year-select-container .date-range-picker-year-select-container{width:66px}.date-range-picker-show-month-year-select-container .date-range-picker-year-select-container .ia-select-styled-dropdown-main-button{min-width:66px;width:66px}.date-range-picker-show-month-year-select-container .date-range-picker-year-select-container .ia-select-styled-dropdown-main-button .ia-select-button-text-full-width{width:66px}.date-range-picker-show-month-year-select-container .date-range-picker-year-select-container .ia-select-button-clear-icon{display:none}.date-range-picker-show-month-year-select-container .date-range-picker-year-select-container .ia-select-chevron-icon{display:none;margin-left:-110px;width:10px}.date-range-picker-month-select-dropdown,.date-range-picker-year-select-dropdown{min-width:115px!important;width:115px!important;z-index:9999}')),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import "../../node_modules/react-dates/lib/initialize.js";

import { forwardRef, useRef, useState, useEffect } from "react";
import moment from "moment";
import { DateRangePickerDropdown } from "./dateRangePickerDropdown.js";
import { DateRangePickerInput } from "./dateRangePickerInput.js";

import { rangeSelectorTypes, setStartDateOffset, setEndDateOffset } from "./utils.js";
import { HelperText } from "../common/HelperText/index.js";
const DateRangePicker = forwardRef(
  ({
    label,
    isRequired,
    labelOrientation,
    fullWidth,
    startDate,
    setStartDate,
    startDateInputProps,
    endDate,
    setEndDate,
    endDateInputProps,
    isDisabled,
    isError,
    withPortal,
    handleDatesChange,
    handleFocusChange,
    portalContainer = document.body,
    showWeekNumbers,
    tertiaryButtonProps,
    primaryButtonProps,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    onResetClick,
    showRangeSelector,
    showMonthYearSelect,
    customYears,
    handleStartDateFocus,
    handleEndDateFocus,
    displayFormat = "DD-MM-YYYY",
    customWeekNumberData,
    enableCustomDatePlacement = false,
    suppressClickOnWeekNumber = false,
    isAgGridCellRenderer = false,
    minDate,
    maxDate,
    readOnly = false,
    startDateOffset,
    endDateOffset,
    helperText,
    isOutsideRange,
    portalClassName,
    customIcon,
    id,
    "data-testid": dataTestId,
    ...args
  }, ref) => {
    const dateRangePickerMainContainerRef = useRef(null);
    const inputContainerRef = useRef(null);
    const dropDownContainerRef = useRef(null);
    const startDateInputRef = useRef();
    const endDateInputRef = useRef();
    const startDateString = startDate == null ? void 0 : startDate.format(displayFormat);
    const endDateString = endDate == null ? void 0 : endDate.format(displayFormat);
    const selectedDaysNumber = endDate && startDate ? endDate.diff(startDate, "days") + 1 : 0;
    const [isOpen, setIsOpen] = useState(false);
    const [focusedInput, setFocusedInput] = useState("startDate");
    const [selectedRange, setSelectedRange] = useState(rangeSelectorTypes[0].id);
    const [tempStartDate, setTempStartDate] = useState(startDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);
    const resetClicked = useRef(false);
    const [hasInputErrors, setHasInputErrors] = useState(false);
    const [clearErrorsTrigger, setClearErrorsTrigger] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(0);
    const onStartDateFocus = () => {
      if (handleStartDateFocus) {
        handleStartDateFocus(setFocusedInput);
      }
      setFocusedInput("startDate");
      setIsOpen(true);
    };
    const onEndDateFocus = () => {
      if (handleEndDateFocus) {
        handleEndDateFocus(setFocusedInput);
      }
      setFocusedInput("endDate");
      setIsOpen(true);
    };
    const onDatesChange = ({ startDate: startDate2, endDate: endDate2 }) => {
      if (handleDatesChange) {
        handleDatesChange(startDate2, endDate2);
      } else {
        setStartDate(startDate2);
        setEndDate(endDate2);
      }
      setClearErrorsTrigger((prev) => prev + 1);
    };
    const onFocusChange = (focusedInput2) => {
      if (handleFocusChange) {
        handleFocusChange(focusedInput2, setFocusedInput, startDateInputRef, endDateInputRef);
        return;
      }
      setFocusedInput(() => focusedInput2 === null ? "startDate" : focusedInput2);
      setTimeout(() => {
        if (focusedInput2 === null || focusedInput2 === "startDate") {
          if (startDateInputRef.current) {
            startDateInputRef.current.focus();
            const position = 0;
            startDateInputRef.current.setSelectionRange(position, position);
          }
        }
        if (focusedInput2 === "endDate") {
          if (endDateInputRef.current) {
            endDateInputRef.current.focus();
            const position = 0;
            endDateInputRef.current.setSelectionRange(position, position);
          }
        }
      }, 0);
    };
    const handleRangeSelectorChange = (event) => {
      setStartDate(startDate);
      setEndDate(endDate);
      setSelectedRange(event.target.value);
      setFocusedInput("startDate");
    };
    const handleClickOutside = (event) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target) && dropDownContainerRef.current && !dropDownContainerRef.current.contains(event.target) && !event.target.closest(".ia-select-container-v3-styled-menu ") && !isAgGridCellRenderer && isOpen) {
        setIsOpen(false);
        if (!resetClicked.current) {
          setStartDate(tempStartDate);
          setEndDate(tempEndDate);
          setClearErrorsTrigger((prev) => prev + 1);
        }
        resetClicked.current = false;
      }
    };
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);
    const handleResetDates = () => {
      resetClicked.current = true;
      setHasInputErrors(false);
      setClearErrorsTrigger((prev) => prev + 1);
      setResetTrigger((prev) => prev + 1);
      if (onResetClick) {
        onResetClick();
      } else {
        setStartDate(null);
        setEndDate(null);
        setTempEndDate(null);
        setTempStartDate(null);
        setFocusedInput("startDate");
      }
    };
    const handleCancelDates = () => {
      if (onSecondaryButtonClick) {
        onSecondaryButtonClick();
      }
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setFocusedInput("startDate");
      setIsOpen(false);
    };
    const handleApplyDates = () => {
      if (hasInputErrors) {
        return;
      }
      if (onPrimaryButtonClick) {
        onPrimaryButtonClick();
      }
      setIsOpen(false);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    };
    const handleStartDateStringChange = (value) => {
      if (value === null) {
        setStartDate(null);
        return;
      }
      if (moment.isMoment(value)) {
        if (minDate && value.isBefore(minDate, "day")) {
          return;
        }
        if (maxDate && value.isAfter(maxDate, "day")) {
          return;
        }
        if (endDate && value.isAfter(endDate, "day")) {
          return;
        }
        setStartDate(value);
      } else {
        const parsedDate = moment(value, displayFormat, true);
        if (parsedDate.isValid()) {
          if (minDate && parsedDate.isBefore(minDate, "day")) {
            return;
          }
          if (maxDate && parsedDate.isAfter(maxDate, "day")) {
            return;
          }
          if (endDate && parsedDate.isAfter(endDate, "day")) {
            return;
          }
          setStartDate(parsedDate);
        }
      }
    };
    const handleEndDateStringChange = (value) => {
      if (value === null) {
        setEndDate(null);
        return;
      }
      if (moment.isMoment(value)) {
        if (minDate && value.isBefore(minDate, "day")) {
          return;
        }
        if (maxDate && value.isAfter(maxDate, "day")) {
          return;
        }
        if (startDate && value.isBefore(startDate, "day")) {
          return;
        }
        setEndDate(value);
      } else {
        const parsedDate = moment(value, displayFormat, true);
        if (parsedDate.isValid()) {
          if (minDate && parsedDate.isBefore(minDate, "day")) {
            return;
          }
          if (maxDate && parsedDate.isAfter(maxDate, "day")) {
            return;
          }
          if (startDate && parsedDate.isBefore(startDate, "day")) {
            return;
          }
          setEndDate(parsedDate);
        }
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `impact-dateRangePicker-main-container ${labelOrientation === "left" ? "label-flex-row" : "label-flex-column"} ${fullWidth ? "impact-dateRangePicker-full-width-main-container" : ""}`,
        "data-testid": dataTestId,
        id,
        children: [
          label && /* @__PURE__ */ jsxs("div", { className: "dateRangePicker-label", children: [
            label,
            " ",
            isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
          ] }),
          /* @__PURE__ */ jsxs("div", { ref: dateRangePickerMainContainerRef, className: "dateRangePicker-container", children: [
            /* @__PURE__ */ jsx(
              DateRangePickerInput,
              {
                clearErrorsTrigger,
                customIcon,
                displayFormat,
                endDateInputProps,
                endDateInputRef,
                endDateString,
                inputContainerRef,
                isDisabled,
                isError,
                isOutsideRange,
                maxDate,
                minDate,
                readOnly,
                resetTrigger,
                startDateInputProps,
                startDateInputRef,
                startDateString,
                onEndDateFocus,
                onEndDateStringChange: handleEndDateStringChange,
                onErrorStateChange: setHasInputErrors,
                onStartDateFocus,
                onStartDateStringChange: handleStartDateStringChange
              }
            ),
            isOpen && /* @__PURE__ */ jsx(
              DateRangePickerDropdown,
              {
                ...args,
                containerRef: dateRangePickerMainContainerRef,
                customWeekNumberData,
                customYears,
                dropDownContainerRef,
                enableCustomDatePlacement,
                endDate,
                endDateOffset,
                focusedInput,
                handleApplyDates,
                handleCancelDates,
                handleRangeSelectorChange,
                handleResetDates,
                hasInputErrors,
                isOutsideRange,
                maxDate,
                minDate,
                portalClassName,
                portalContainer,
                primaryButtonProps,
                selectedDaysNumber,
                selectedRange,
                setEndDateOffset,
                setIsOpen,
                setStartDateOffset,
                showMonthYearSelect,
                showRangeSelector,
                showWeekNumbers,
                startDate,
                startDateOffset,
                suppressClickOnWeekNumber,
                tertiaryButtonProps,
                withPortal,
                onDatesChange,
                onFocusChange,
                onSecondaryButtonClick
              }
            )
          ] }),
          helperText && /* @__PURE__ */ jsx(HelperText, { error: isError, helper: isError ? helperText : "" })
        ]
      }
    );
  }
);
export {
  DateRangePicker
};
