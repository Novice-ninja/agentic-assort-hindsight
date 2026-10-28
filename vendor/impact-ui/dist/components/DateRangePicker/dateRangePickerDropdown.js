import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { CalendarDay, DayPickerRangeController } from "react-dates";
import { DateRangePickerCustom } from "./dateRangePickerCustom.js";
import { DateRangePickerFooter } from "./dateRangePickerFooter.js";
import { ShowMonthYearSelect } from "./showMonthYearSelect.js";
import { calculatePosition, buildFiscalDayLookup, formatMomentDate, isDayInFiscalPanel, getFiscalRecord, getFiscalWeekLabel, getFiscalStartDateOffset, getFiscalEndDateOffset } from "./utils.js";
import { Portal } from "../Portal/index.js";
function DateRangePickerDropdown({
  dropDownContainerRef,
  withPortal,
  portalContainer,
  containerRef,
  onDatesChange,
  onFocusChange,
  focusedInput,
  startDate,
  endDate,
  showWeekNumbers,
  selectedRange,
  setStartDateOffset,
  setEndDateOffset,
  selectedDaysNumber,
  handleResetDates,
  handleCancelDates,
  onSecondaryButtonClick,
  tertiaryButtonProps,
  handleApplyDates,
  primaryButtonProps,
  showRangeSelector,
  handleRangeSelectorChange,
  showMonthYearSelect,
  customYears,
  customWeekNumberData,
  enableCustomDatePlacement,
  suppressClickOnWeekNumber,
  setIsOpen,
  startDateOffset,
  endDateOffset,
  hasInputErrors,
  isOutsideRange,
  minDate,
  maxDate,
  portalClassName,
  enableOutsideDays: consumerEnableOutsideDays,
  ...args
}) {
  const [moment, setMoment] = useState(null);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    offsetHeight: 0,
    offsetWidth: 0
  });
  const [customPosition, setCustomPosition] = useState({
    left: 0,
    right: "auto"
  });
  useEffect(() => {
    let cancelled = false;
    import("moment").then((mod) => {
      if (!cancelled) {
        setMoment(() => mod.default);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const isValidDate = (date) => Boolean(date == null ? void 0 : date._isAMomentObject) && date.isValid() && (!minDate || !date.isBefore(minDate, "day")) && (!maxDate || !date.isAfter(maxDate, "day")) && !(isOutsideRange == null ? void 0 : isOutsideRange(date));
  const hasValidRange = isValidDate(startDate) && isValidDate(endDate) && !endDate.isBefore(startDate, "day");
  const isClearDisabled = startDate == null && endDate == null && !hasInputErrors;
  useLayoutEffect(() => {
    if (withPortal && containerRef.current) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const {
        x,
        y,
        height: offsetHeight,
        width: offsetWidth
      } = containerRef.current.getBoundingClientRect();
      calculatePosition({
        containerRef,
        setCustomPosition,
        showRangeSelector
      });
      setPosition({
        x,
        y: y + scrollY,
        offsetHeight,
        offsetWidth,
        ...customPosition
      });
    } else if (!withPortal && containerRef.current && dropDownContainerRef.current) {
      calculatePosition({
        containerRef,
        setCustomPosition,
        showRangeSelector
      });
    }
  }, [containerRef.current, dropDownContainerRef.current, withPortal, showRangeSelector]);
  const fiscalLookup = useMemo(
    () => enableCustomDatePlacement && moment ? buildFiscalDayLookup(moment, customWeekNumberData) : null,
    [moment, enableCustomDatePlacement, customWeekNumberData]
  );
  const getWeekNumberWithinMonth = (momentInstance) => {
    const startOfMonth = momentInstance.clone().startOf("month");
    return Math.ceil((momentInstance.date() - 1 + startOfMonth.day()) / 7);
  };
  const renderFiscalDayContents = (momentInstance, modifiers) => {
    const record = getFiscalRecord(fiscalLookup, momentInstance);
    const fiscalWeek = getFiscalWeekLabel(record);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      showWeekNumbers && modifiers.has("first-day-of-week") && /* @__PURE__ */ jsxs(
        "span",
        {
          className: `CalendarDayWeekNumber ${suppressClickOnWeekNumber ? "suppress-click-on-week-number" : ""}`,
          children: [
            "W",
            fiscalWeek ?? getWeekNumberWithinMonth(momentInstance) + 1
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "CalendarDayNumber", children: momentInstance.format("D") })
    ] });
  };
  const renderDayContents = useCallback(
    (momentInstance, modifiers) => {
      if (fiscalLookup) {
        return renderFiscalDayContents(momentInstance, modifiers);
      }
      let currentWeek = null;
      let currentWeekNumber = null;
      if (customWeekNumberData) {
        if (modifiers.has("first-day-of-week")) {
          currentWeek = customWeekNumberData.find((weekNumberData) => {
            return (weekNumberData == null ? void 0 : weekNumberData.calendar_week_start_date) === formatMomentDate(momentInstance);
          });
        }
      } else {
        currentWeekNumber = getWeekNumberWithinMonth(momentInstance);
      }
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        showWeekNumbers && modifiers.has("first-day-of-week") && /* @__PURE__ */ jsxs(
          "span",
          {
            className: `CalendarDayWeekNumber ${suppressClickOnWeekNumber ? "suppress-click-on-week-number" : ""}`,
            children: [
              "W",
              customWeekNumberData ? currentWeek == null ? void 0 : currentWeek.calendar_year_week : currentWeekNumber + 1
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "CalendarDayNumber", children: momentInstance.format("D") })
      ] });
    },
    [fiscalLookup, customWeekNumberData, showWeekNumbers, suppressClickOnWeekNumber]
  );
  const renderCalendarDay = useCallback(
    (dayProps) => {
      if (!fiscalLookup) {
        return /* @__PURE__ */ jsx(CalendarDay, { ...dayProps });
      }
      const { day, isOutsideDay } = dayProps;
      const belongsInPanel = isDayInFiscalPanel(fiscalLookup, day, isOutsideDay);
      if (!belongsInPanel) {
        if (consumerEnableOutsideDays) {
          return /* @__PURE__ */ jsx(CalendarDay, { ...dayProps, isOutsideDay: true });
        }
        return /* @__PURE__ */ jsx(CalendarDay, { ...dayProps, day: null });
      }
      return /* @__PURE__ */ jsx(CalendarDay, { ...dayProps, isOutsideDay: false });
    },
    [fiscalLookup, consumerEnableOutsideDays]
  );
  const getRangeStartDateOffset = (day) => fiscalLookup ? getFiscalStartDateOffset(fiscalLookup, moment, selectedRange, day) : setStartDateOffset(selectedRange, day);
  const getRangeEndDateOffset = (day) => fiscalLookup ? getFiscalEndDateOffset(fiscalLookup, moment, selectedRange, day) : setEndDateOffset(selectedRange, day);
  const enableOutsideDays = Boolean(fiscalLookup) || Boolean(consumerEnableOutsideDays);
  const onPrevMonthClick = (params) => {
    var _a, _b;
    const isNavButtonFocused = (_a = document.activeElement) == null ? void 0 : _a.classList.contains(
      "DayPickerNavigation_leftButton__horizontalDefault"
    );
    if (isNavButtonFocused) {
      setTimeout(() => {
        var _a2;
        const btn = (_a2 = dropDownContainerRef == null ? void 0 : dropDownContainerRef.current) == null ? void 0 : _a2.querySelector(
          ".DayPickerNavigation_leftButton__horizontalDefault"
        );
        btn == null ? void 0 : btn.focus();
      }, 0);
    }
    (_b = args.onPrevMonthClick) == null ? void 0 : _b.call(args, params);
  };
  const onNextMonthClick = (params) => {
    var _a, _b;
    const isNavButtonFocused = (_a = document.activeElement) == null ? void 0 : _a.classList.contains(
      "DayPickerNavigation_rightButton__horizontalDefault"
    );
    if (isNavButtonFocused) {
      setTimeout(() => {
        var _a2;
        const btn = (_a2 = dropDownContainerRef == null ? void 0 : dropDownContainerRef.current) == null ? void 0 : _a2.querySelector(
          ".DayPickerNavigation_rightButton__horizontalDefault"
        );
        btn == null ? void 0 : btn.focus();
      }, 0);
    }
    (_b = args.onNextMonthClick) == null ? void 0 : _b.call(args, params);
  };
  const getInitialVisibleMonth = () => {
    if (startDate) return startDate;
    if (endDate) return endDate;
    return moment();
  };
  if (!moment) {
    return null;
  }
  if (withPortal) {
    return /* @__PURE__ */ jsxs(Portal, { container: portalContainer, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `impact-portal-container ${portalClassName}`,
          style: {
            top: position.y || position.top,
            left: position.x || position.left,
            bottom: position.bottom,
            right: position.right,
            width: position.offsetWidth || "0px"
          },
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              ref: dropDownContainerRef,
              className: `impact-dateRangePicker-dropdown-container ${showRangeSelector ? "showRangeSelector" : ""}`,
              style: {
                ...customPosition
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `dateRangePicker-left-container ${showWeekNumbers ? "showWeekNumbers" : ""} ${showMonthYearSelect ? "showMonthYearSelect" : ""}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        DayPickerRangeController,
                        {
                          ...args,
                          daySize: 26,
                          enableOutsideDays,
                          endDate,
                          endDateOffset: endDateOffset ? endDateOffset : selectedRange === "custom" ? void 0 : fiscalLookup ? getRangeEndDateOffset : setEndDateOffset,
                          focusedInput,
                          hideKeyboardShortcutsPanel: true,
                          horizontalMonthPadding: showWeekNumbers ? 16 : 12,
                          initialVisibleMonth: getInitialVisibleMonth,
                          isOutsideRange,
                          numberOfMonths: 2,
                          renderCalendarDay: fiscalLookup ? renderCalendarDay : args.renderCalendarDay,
                          renderDayContents: showWeekNumbers ? renderDayContents : null,
                          renderMonthElement: showMonthYearSelect ? ({ month, onMonthSelect, onYearSelect }) => /* @__PURE__ */ jsx(
                            ShowMonthYearSelect,
                            {
                              customYears,
                              month,
                              onMonthSelect,
                              onYearSelect
                            }
                          ) : null,
                          startDate,
                          startDateOffset: startDateOffset ? startDateOffset : selectedRange === "custom" ? void 0 : fiscalLookup ? getRangeStartDateOffset : setStartDateOffset,
                          onDatesChange,
                          onFocusChange,
                          onNextMonthClick,
                          onPrevMonthClick
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        DateRangePickerFooter,
                        {
                          handleApplyDates,
                          handleCancelDates,
                          handleResetDates,
                          hasInputErrors,
                          isApplyDisabled: !hasValidRange,
                          isClearDisabled,
                          primaryButtonProps,
                          selectedDaysNumber,
                          tertiaryButtonProps,
                          onSecondaryButtonClick
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "dateRangePicker-right-container", children: showRangeSelector ? /* @__PURE__ */ jsx(
                  DateRangePickerCustom,
                  {
                    handleRangeSelectorChange,
                    selectedRange
                  }
                ) : null })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "ia-select-container-v3-blanket", onClick: () => setIsOpen(false) })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dropDownContainerRef,
      className: `impact-dateRangePicker-dropdown-container ${showRangeSelector ? "showRangeSelector" : ""}`,
      style: {
        ...customPosition
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `dateRangePicker-left-container ${showWeekNumbers ? "showWeekNumbers" : ""} ${showMonthYearSelect ? "showMonthYearSelect" : ""}`,
            children: [
              /* @__PURE__ */ jsx(
                DayPickerRangeController,
                {
                  ...args,
                  daySize: 26,
                  enableOutsideDays,
                  endDate,
                  endDateOffset: endDateOffset ? endDateOffset : selectedRange === "custom" ? void 0 : getRangeEndDateOffset,
                  focusedInput,
                  hideKeyboardShortcutsPanel: true,
                  horizontalMonthPadding: showWeekNumbers ? 16 : 12,
                  initialVisibleMonth: getInitialVisibleMonth,
                  isOutsideRange,
                  numberOfMonths: 2,
                  renderCalendarDay: fiscalLookup ? renderCalendarDay : args.renderCalendarDay,
                  renderDayContents: showWeekNumbers ? renderDayContents : null,
                  renderMonthElement: showMonthYearSelect ? ({ month, onMonthSelect, onYearSelect }) => /* @__PURE__ */ jsx(
                    ShowMonthYearSelect,
                    {
                      customYears,
                      month,
                      onMonthSelect,
                      onYearSelect
                    }
                  ) : null,
                  startDate,
                  startDateOffset: startDateOffset ? startDateOffset : selectedRange === "custom" ? void 0 : getRangeStartDateOffset,
                  onDatesChange,
                  onFocusChange,
                  onNextMonthClick,
                  onPrevMonthClick
                }
              ),
              /* @__PURE__ */ jsx(
                DateRangePickerFooter,
                {
                  handleApplyDates,
                  handleCancelDates,
                  handleResetDates,
                  hasInputErrors,
                  isApplyDisabled: !hasValidRange,
                  isClearDisabled,
                  primaryButtonProps,
                  selectedDaysNumber,
                  tertiaryButtonProps,
                  onSecondaryButtonClick
                }
              )
            ]
          }
        ),
        showRangeSelector ? /* @__PURE__ */ jsx(
          DateRangePickerCustom,
          {
            handleRangeSelectorChange,
            selectedRange
          }
        ) : null
      ]
    }
  );
}
export {
  DateRangePickerDropdown
};
