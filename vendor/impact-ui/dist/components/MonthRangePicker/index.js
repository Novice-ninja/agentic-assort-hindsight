!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact-portal-container{position:absolute;z-index:9999}.ia-select-container-v3-blanket{bottom:0;left:0;position:fixed;right:0;top:0;z-index:9998}.impact-monthRangePicker-main-container{display:flex;font-family:Manrope,sans-serif}.impact-monthRangePicker-main-container.label-flex-column{flex-direction:column}.impact-monthRangePicker-main-container.label-flex-column .monthRangePicker-label{margin-bottom:6px}.impact-monthRangePicker-main-container .monthRangePicker-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:16px}.impact-monthRangePicker-main-container .monthRangePicker-container{position:relative;width:282px}.impact-monthRangePicker-main-container .monthRangePicker-input-container{box-sizing:border-box;display:flex;height:32px;width:100%}.impact-monthRangePicker-main-container .monthRangePicker-input-container:focus-within .dateRangePicker-input-start-date,.impact-monthRangePicker-main-container .monthRangePicker-input-container:hover .dateRangePicker-input-start-date{border:1px solid #4259ee;border-right:none}.impact-monthRangePicker-main-container .monthRangePicker-input-container:focus-within .dateRangePicker-input-end-date,.impact-monthRangePicker-main-container .monthRangePicker-input-container:hover .dateRangePicker-input-end-date{border:1px solid #4259ee;border-left:none}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date{border:1px solid #c3c8d4;border-radius:8px 0 0 8px;border-right:none;box-sizing:border-box;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;padding-left:12px;width:123px}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date.active{width:76px}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date.error{border-bottom:1px solid #e15554;border-left:1px solid #e15554;border-top:1px solid #e15554}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date::placeholder{color:#b4bac7}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date:focus{outline:none}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date:focus::placeholder,.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-start-date:focus:not(:placeholder-shown){color:#4259ee}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/calendar.svg) no-repeat;background-color:#fff;background-position:center right 12px;background-size:14px;border:1px solid #c3c8d4;border-left:none;border-radius:0 8px 8px 0;box-sizing:border-box;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;width:100%}@media screen and (max-width:1399px) and (min-width:1200px){.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date{background-position:center right 10px;background-size:13px;padding-left:10px}}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date::placeholder{color:#b4bac7}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date:focus{outline:none}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date.error{border-bottom:1px solid #e15554;border-right:1px solid #e15554;border-top:1px solid #e15554}.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date:focus::placeholder,.impact-monthRangePicker-main-container .monthRangePicker-input-container .dateRangePicker-input-end-date:focus:not(:placeholder-shown){color:#4259ee}.impact-monthRangePicker-main-container .monthRangePicker-input-container .close-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat 50%;background-size:14px;border:none;border-radius:4px;cursor:pointer;height:24px;padding:0;position:absolute;right:36px;top:16px;transform:translateY(-50%);width:24px}.impact-monthRangePicker-main-container .monthRangePicker-input-container .close-icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-monthRangePicker-main-container .monthRangePicker-input-container .close-icon:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-monthRangePicker-main-container.disabled{pointer-events:none}.impact-monthRangePicker-main-container.disabled .monthRangePicker-label{color:#b4bac7}.impact-monthRangePicker-main-container.disabled .dateRangePicker-input-end-date,.impact-monthRangePicker-main-container.disabled .dateRangePicker-input-start-date{background-color:#f8f9fb;border-color:#d9dde7;color:#b4bac7}.impact-monthRangePicker-main-container.disabled .dateRangePicker-input-end-date{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/calendarDisable.svg);background-position:center right 12px;background-repeat:no-repeat;background-size:14px}.impact-monthRangePicker-main-container.disabled .close-icon{opacity:.6}.ia-month-picker-container{background-color:#fff;border:1px solid #f0f0f0;border-radius:12px;box-shadow:0 0 4px #0000001f;height:276px;left:0;padding:16px;position:absolute;top:40px;width:586px;z-index:1200}.month-range-picker-selected-year{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:16px}.month-range-picker-year-select-container{width:85px}.month-range-picker-year-select-container .ia-select-styled-dropdown-main-button{border:none!important;padding:6px}.month-range-picker-year-select-container .ia-select-button-clear-icon{display:none}.month-range-picker-year-select-container .ia-select-chevron-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/arrowDownMonthRange.svg) no-repeat;background-position:50%;background-size:10px;margin-left:-110px;margin-right:36px}.month-range-picker-month-select-dropdown,.month-range-picker-year-select-dropdown{min-width:115px!important;width:115px!important;z-index:9999}.ia-header{align-items:center;display:flex;justify-content:space-between;padding-inline:8px}.ia-header .Mui-focusVisible:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-header .Mui-focusVisible:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-render-month-container{display:flex;justify-content:space-between}.ia-render-month{display:flex;flex-wrap:wrap;gap:36px;height:128px;margin-top:16px;row-gap:10px;width:252px}.ia-month{align-items:center;-moz-appearance:none;appearance:none;-webkit-appearance:none;background:#0000;border:1px solid #0000;color:inherit;cursor:pointer;display:flex;font:inherit;gap:10px;height:36px;justify-content:center;padding:0;width:36px}.ia-month:hover:not(.start,.end){background-color:#eceefd;border:1px solid #b3bdf8;border-radius:8px;color:#3649c6}.ia-month.current-month{border:1px solid #eceefd;border-radius:8px}.ia-month:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-month:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-month.Mui-disabled:focus-visible,.ia-month.ia-btn-disabled:focus-visible,.ia-month.ia-switch-disabled:focus-visible,.ia-month.impact-select-disabled:focus-visible,.ia-month.impact_input_disabled:focus-visible,.ia-month.route-disabled:focus-visible,.ia-month:disabled:focus-visible,.ia-month[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.ia-calendar-month{font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:15px;text-align:left;text-decoration-skip-ink:none;text-underline-position:from-font}.ia-month.end,.ia-month.start{background-color:#4259ee;border-radius:8px;color:#fff;position:relative}.ia-month.end.has-start-month:before{background-color:#eceefd;content:"";height:100%;left:-47px;position:absolute;right:6px;top:0;z-index:-1}.ia-month.selected{background-color:initial;border:1px solid #0000;border-radius:0;position:relative}.ia-month.selected:hover:before{border-radius:6px}.ia-month.selected:before{background-color:#eceefd;content:"";height:100%;left:-47px;position:absolute;right:0;top:0;z-index:-1}.ia-month.selected.hovered-previous-to-end:before{display:none}.ia-month.selected.hovered-previous-to-end:after{background-color:#eceefd;content:"";height:100%;left:0;position:absolute;right:-47px;top:0;z-index:-1}.month12:after,.month4:after,.month8:after{right:-1px!important}.month1:before,.month5:before,.month9:before{left:-1px!important}.month1.end:before,.month1.start:before,.month5.end:before,.month5.start:before,.month9.end:before,.month9.start:before{left:4px!important}.ia-month.disabled,.ia-month:disabled{color:#b4bac7;cursor:default;pointer-events:none}.ia-vertical-line{border:.5px solid #d9dde7;margin-block:16px 0}.ia-calendar-button{display:flex;gap:16px;justify-content:flex-end;margin-top:16px}')),document.head.appendChild(e)}}catch(n){console.error("vite-plugin-css-injected-by-js",n)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ChevronLeftOutlined.js";
import default_1$1 from "../../node_modules/@mui/icons-material/ChevronRightOutlined.js";
import { MONTHS_NUMBER } from "./constants.js";
import { Button } from "../Button/index.js";
import { Portal } from "../Portal/index.js";
import { Select } from "../Select/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import IconButton from "../../node_modules/@mui/material/IconButton/IconButton.js";
const MonthRangePicker = ({
  customYears,
  locale,
  isMandatory = false,
  displayFormat = "MM/YYYY",
  focusedInput = null,
  onApply = () => {
  },
  startMonth: initialStartMonth = null,
  endMonth: initialEndMonth = null,
  showYearSelect = false,
  isOutsideRange = () => false,
  disabled = false,
  customWidth = "282px",
  isError = false,
  withPortal = false,
  portalContainer = typeof document !== "undefined" ? document.body : null,
  portalClassName = "",
  onStartMonthChange = () => {
  },
  onEndMonthChange = () => {
  },
  className,
  id,
  "data-testid": dataTestId
}) => {
  const { t, locale: activeLocale } = useTranslation();
  const effectiveLocale = locale || activeLocale;
  const today = /* @__PURE__ */ new Date();
  const currentYear = today.getFullYear();
  const yrs = Array.from({ length: 10 }, (_, index) => {
    const year = (currentYear - 5 + index).toString();
    return { label: year, value: year };
  });
  const years = customYears && customYears.length > 0 ? customYears : yrs;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [startMonth, setStartMonth] = useState(initialStartMonth);
  const [endMonth, setEndMonth] = useState(initialEndMonth);
  const [yearOffset, setYearOffset] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [currentOptions1, setCurrentOptions1] = useState(years);
  const [selectedOptions1, setSelectedOptions1] = useState({
    label: (today.getFullYear() - 1).toString(),
    value: (today.getFullYear() - 1).toString()
  });
  const [open2, setOpen2] = useState(false);
  const [currentOptions2, setCurrentOptions2] = useState(years);
  const [selectedOptions2, setSelectedOptions2] = useState({
    label: today.getFullYear().toString(),
    value: today.getFullYear().toString()
  });
  const inputContainerRef = useRef(null);
  const dropDownContainerRef = useRef(null);
  const dropDownRef = useRef(null);
  const startDateInputRef = useRef();
  const endDateInputRef = useRef();
  const monthRangePickerMainContainerRef = useRef(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [focusInput, setFocusInput] = useState(focusedInput);
  const [dummyStartMonth, setDummyStartMonth] = useState(initialStartMonth);
  const [dummyEndMonth, setDummyEndMonth] = useState(initialEndMonth);
  const isResetClicked = useRef(false);
  const [prevIconDisabled, setPrevIconDisabled] = useState(false);
  const [nextIconDisabled, setNextIconDisabled] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    offsetHeight: 0,
    offsetWidth: 0
  });
  const [focusedPanel, setFocusedPanel] = useState(1);
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(null);
  const panel1ButtonRefs = useRef([]);
  const panel2ButtonRefs = useRef([]);
  const keyboardOpenRef = useRef(false);
  const pendingFocusRef = useRef(null);
  const isMonthSelected = (month) => {
    if (!startMonth) {
      return false;
    }
    if (endMonth) {
      const startYearMonth = startMonth.getFullYear() * 12 + startMonth.getMonth();
      const endYearMonth = endMonth.getFullYear() * 12 + endMonth.getMonth();
      const currentYearMonth = month.getFullYear() * 12 + month.getMonth();
      return currentYearMonth >= startYearMonth && currentYearMonth <= endYearMonth;
    }
    if (hoveredMonth && !endMonth) {
      const startYearMonth = startMonth.getFullYear() * 12 + startMonth.getMonth();
      const hoveredYearMonth = hoveredMonth.getFullYear() * 12 + hoveredMonth.getMonth();
      const currentYearMonth = month.getFullYear() * 12 + month.getMonth();
      const minMonth = Math.min(startYearMonth, hoveredYearMonth);
      const maxMonth = Math.max(startYearMonth, hoveredYearMonth);
      return currentYearMonth >= minMonth && currentYearMonth <= maxMonth;
    }
    return false;
  };
  const isMonthStart = (month) => {
    return month.getTime() === ((startMonth == null ? void 0 : startMonth.getTime()) || 0);
  };
  const isMonthEnd = (month) => {
    if (!endMonth) {
      return false;
    }
    const endYearMonth = endMonth.getFullYear() * 12 + endMonth.getMonth();
    const currentYearMonth = month.getFullYear() * 12 + month.getMonth();
    return currentYearMonth === endYearMonth;
  };
  const handleMonthClick = (month, type) => {
    const MIN_RANGE = 0;
    const monthsDiff = (m1, m2) => Math.abs(m1 - m2);
    if (!startMonth && !endMonth) {
      setStartMonth(month);
      onStartMonthChange(month);
      setFocusInput("end month");
      return;
    }
    if (startMonth && !endMonth) {
      if (month === startMonth) {
        setStartMonth(null);
        onStartMonthChange(null);
        setFocusInput("end month");
        return;
      }
      if (month < startMonth) {
        if (monthsDiff(month, startMonth) < MIN_RANGE) return;
        setEndMonth(startMonth);
        onEndMonthChange(startMonth);
        setStartMonth(month);
        onStartMonthChange(month);
        setFocusInput("start month");
        return;
      }
      if (monthsDiff(month, startMonth) < MIN_RANGE) return;
      setEndMonth(month);
      onEndMonthChange(month);
      setFocusInput("start month");
      return;
    }
    if (startMonth && endMonth) {
      setStartMonth(month);
      onStartMonthChange(month);
      setEndMonth(null);
      onEndMonthChange(null);
      setFocusInput("end month");
      return;
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const month = new Intl.DateTimeFormat(effectiveLocale, { month: "2-digit" }).format(date);
    const year = new Intl.DateTimeFormat(effectiveLocale, { year: "numeric" }).format(date);
    if (displayFormat === "YYYY/MM") {
      return `${year}/${month}`;
    }
    return `${month}/${year}`;
  };
  const handleMonthHover = (month) => {
    if (startMonth && !endMonth) {
      setHoveredMonth(month);
    }
  };
  const handleMonthLeave = () => {
    setHoveredMonth(null);
  };
  const renderMonth = (year, type, month) => {
    const monthStart = new Date(year, month, 1);
    const isSelected = isMonthSelected(monthStart);
    const isStart = isMonthStart(monthStart);
    const isEnd = isMonthEnd(monthStart);
    const isDisabled = isOutsideRange(monthStart);
    const isCurrentMonth = monthStart.getFullYear() === today.getFullYear() && monthStart.getMonth() === today.getMonth();
    const isHoveredPreviousToEnd = hoveredMonth && startMonth && hoveredMonth.getFullYear() * 12 + hoveredMonth.getMonth() < startMonth.getFullYear() * 12 + startMonth.getMonth();
    const getVariants = () => {
      if (isStart) return "start";
      if (isEnd) return "end";
      if (isSelected) return "selected";
      return "";
    };
    const panel = type === "start" ? 1 : 2;
    const panelRefs = panel === 1 ? panel1ButtonRefs : panel2ButtonRefs;
    const isFocused = focusedPanel === panel && focusedMonthIndex === month;
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref: (el) => panelRefs.current[month] = el,
        "aria-label": new Intl.DateTimeFormat(effectiveLocale, {
          month: "long",
          year: "numeric"
        }).format(monthStart),
        "aria-pressed": isStart || isEnd || isSelected,
        className: `ia-month month${month + 1} ${getVariants()} ${startMonth && getVariants() === "end" ? "has-start-month" : ""} ${isCurrentMonth ? "current-month" : ""} ${isHoveredPreviousToEnd ? "hovered-previous-to-end" : ""} ${isDisabled ? "disabled" : ""}`,
        disabled: isDisabled,
        tabIndex: isFocused ? 0 : -1,
        type: "button",
        onClick: () => {
          handleMonthClick(monthStart);
        },
        onFocus: () => {
          setFocusedPanel(panel);
          setFocusedMonthIndex(month);
        },
        onMouseEnter: () => !isDisabled && handleMonthHover(monthStart),
        onMouseLeave: handleMonthLeave,
        children: /* @__PURE__ */ jsx("span", { className: "ia-calendar-month", children: new Intl.DateTimeFormat(effectiveLocale, { month: "short" }).format(monthStart) })
      },
      month
    );
  };
  const renderYear = (year, type) => /* @__PURE__ */ jsx("div", { className: "ia-render-month", children: MONTHS_NUMBER.map((month) => renderMonth(year, type, month)) });
  const handlePrevYear = () => {
    const offset = yearOffset - 1;
    setYearOffset(offset);
    setSelectedOptions1((prevState) => {
      const newValue = parseInt(prevState.value) - 1;
      if (newValue == currentOptions1[0].value) {
        setPrevIconDisabled(true);
      }
      return { label: newValue.toString(), value: newValue.toString() };
    });
    setSelectedOptions2((prevState) => {
      const newValue = parseInt(prevState.value) - 1;
      return { label: newValue.toString(), value: newValue.toString() };
    });
  };
  const handleNextYear = () => {
    const offset = yearOffset + 1;
    setYearOffset(offset);
    setSelectedOptions1((prevState) => {
      const newValue = parseInt(prevState.value) + 1;
      return { label: newValue.toString(), value: newValue.toString() };
    });
    setSelectedOptions2((prevState) => {
      const newValue = parseInt(prevState.value) + 1;
      if (newValue == currentOptions2[currentOptions2.length - 1].value) {
        setNextIconDisabled(true);
      }
      return { label: newValue.toString(), value: newValue.toString() };
    });
  };
  const handleYearSelect = (selectId, selectedValue) => {
    const newYear = parseInt(selectedValue.value);
    if (selectId === 1) {
      setSelectedOptions1({
        label: newYear.toString(),
        value: newYear.toString()
      });
      setSelectedOptions2({
        label: (newYear + 1).toString(),
        value: (newYear + 1).toString()
      });
    } else if (selectId === 2) {
      setSelectedOptions2({
        label: newYear.toString(),
        value: newYear.toString()
      });
      setSelectedOptions1({
        label: (newYear - 1).toString(),
        value: (newYear - 1).toString()
      });
    }
    setIsSelectOpen(true);
  };
  const hanldeInputClick = (inputType) => {
    setOpenCalendar(true);
    setFocusInput(inputType);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !openCalendar) {
      keyboardOpenRef.current = true;
      hanldeInputClick("start month");
      setFocusedPanel(1);
      setFocusedMonthIndex((startMonth == null ? void 0 : startMonth.getMonth()) ?? 0);
    }
  };
  const handleCalendarKeyDown = (e) => {
    var _a, _b;
    if (e.key === "Escape") {
      handleCancel();
      (_a = startDateInputRef.current) == null ? void 0 : _a.focus();
      return;
    }
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 };
    if (moves[e.key] === void 0 || focusedMonthIndex === null) return;
    e.preventDefault();
    const delta = moves[e.key];
    let newPanel = focusedPanel;
    let newIndex = focusedMonthIndex + delta;
    if (focusedPanel === 1) {
      if (newIndex > 11) {
        newPanel = 2;
        newIndex = newIndex - 12;
      } else if (newIndex < 0) {
        if (!prevIconDisabled) {
          pendingFocusRef.current = { panel: 1, index: newIndex + 12 };
          handlePrevYear();
        }
        return;
      }
    } else {
      if (newIndex > 11) {
        if (!nextIconDisabled) {
          pendingFocusRef.current = { panel: 2, index: newIndex - 12 };
          handleNextYear();
        }
        return;
      } else if (newIndex < 0) {
        newPanel = 1;
        newIndex = newIndex + 12;
      }
    }
    setFocusedPanel(newPanel);
    setFocusedMonthIndex(newIndex);
    const refs = newPanel === 1 ? panel1ButtonRefs : panel2ButtonRefs;
    (_b = refs.current[newIndex]) == null ? void 0 : _b.focus();
    const year = newPanel === 1 ? parseInt(selectedOptions1.value) : parseInt(selectedOptions2.value);
    if (startMonth && !endMonth) {
      setHoveredMonth(new Date(year, newIndex, 1));
    }
  };
  useEffect(() => {
    if (focusInput === "start month") {
      startDateInputRef.current.focus();
    }
    if (focusInput === "end month") {
      endDateInputRef.current.focus();
    }
  }, [focusInput]);
  useEffect(() => {
    if (openCalendar && keyboardOpenRef.current && focusedMonthIndex !== null) {
      const timer = setTimeout(() => {
        var _a;
        (_a = panel1ButtonRefs.current[focusedMonthIndex]) == null ? void 0 : _a.focus();
      }, 0);
      keyboardOpenRef.current = false;
      return () => {
        clearTimeout(timer);
      };
    }
  }, [openCalendar]);
  useEffect(() => {
    if (pendingFocusRef.current !== null) {
      const { panel, index } = pendingFocusRef.current;
      pendingFocusRef.current = null;
      setFocusedPanel(panel);
      setFocusedMonthIndex(index);
      setTimeout(() => {
        var _a;
        const refs = panel === 1 ? panel1ButtonRefs : panel2ButtonRefs;
        (_a = refs.current[index]) == null ? void 0 : _a.focus();
      }, 0);
    }
  }, [selectedOptions1, selectedOptions2]);
  const handleClickOutside = (event) => {
    if (inputContainerRef.current && !inputContainerRef.current.contains(event.target) && dropDownContainerRef.current && !dropDownContainerRef.current.contains(event.target) && !event.target.closest(".close-icon") && !event.target.closest(".month-range-picker-year-select-dropdown") && !isSelectOpen) {
      setOpenCalendar(false);
      if (isResetClicked.current) {
        setStartMonth(null);
        setEndMonth(null);
        setDummyStartMonth(null);
        setDummyEndMonth(null);
        isResetClicked.current = false;
      } else {
        setStartMonth(dummyStartMonth);
        setEndMonth(dummyEndMonth);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openCalendar]);
  const handleClear = () => {
    setStartMonth(null);
    setEndMonth(null);
    setDummyStartMonth(null);
    setDummyEndMonth(null);
    isResetClicked.current = true;
  };
  const handleCancel = () => {
    setOpenCalendar(false);
    setStartMonth(dummyStartMonth);
    setEndMonth(dummyEndMonth);
  };
  const handleApply = () => {
    setOpenCalendar(false);
    setDummyStartMonth(startMonth);
    setDummyEndMonth(endMonth);
    onApply(startMonth, endMonth);
  };
  useLayoutEffect(() => {
    if (withPortal && monthRangePickerMainContainerRef.current) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const {
        x,
        y,
        height: offsetHeight,
        width: offsetWidth
      } = monthRangePickerMainContainerRef.current.getBoundingClientRect();
      setPosition({ x, y: y + scrollY, offsetHeight, offsetWidth });
    }
  }, [openCalendar, withPortal]);
  useEffect(() => {
    if (selectedOptions1.value == currentOptions1[0].value) {
      setPrevIconDisabled(true);
    } else {
      setPrevIconDisabled(false);
    }
    if (selectedOptions2.value == currentOptions2[currentOptions2.length - 1].value) {
      setNextIconDisabled(true);
    } else {
      setNextIconDisabled(false);
    }
  }, [selectedOptions1, selectedOptions2]);
  const renderCalendarContent = () => /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dropDownContainerRef,
      "aria-label": t("monthRangePicker.ariaDialog"),
      className: "ia-month-picker-container",
      role: "dialog",
      onKeyDown: handleCalendarKeyDown,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "ia-header", children: [
          /* @__PURE__ */ jsx(IconButton, { disableRipple: true, disabled: prevIconDisabled, onClick: handlePrevYear, children: /* @__PURE__ */ jsx(default_1, { className: "left-icon" }) }),
          showYearSelect ? /* @__PURE__ */ jsx("div", { className: "month-range-picker-year-select-container", children: /* @__PURE__ */ jsx(
            Select,
            {
              ref: dropDownRef,
              isWithSearch: true,
              withPortal: true,
              currentOptions: currentOptions1,
              dropDownPortalClassName: "month-range-picker-year-select-dropdown",
              handleChange: (val) => {
                handleYearSelect(1, val);
              },
              initialOptions: years,
              isOpen: open1,
              minWidth: 100,
              name: "year-select",
              selectedOptions: selectedOptions1,
              setCurrentOptions: setCurrentOptions1,
              setIsOpen: setOpen1,
              setSelectedOptions: setSelectedOptions1
            }
          ) }) : /* @__PURE__ */ jsx("div", { className: "month-range-picker-selected-year", children: selectedOptions1.value }),
          showYearSelect ? /* @__PURE__ */ jsx("div", { className: "month-range-picker-year-select-container", children: /* @__PURE__ */ jsx(
            Select,
            {
              isWithSearch: true,
              withPortal: true,
              currentOptions: currentOptions2,
              dropDownPortalClassName: "month-range-picker-year-select-dropdown",
              handleChange: (val) => {
                handleYearSelect(2, val);
              },
              initialOptions: years,
              isOpen: open2,
              minWidth: 100,
              name: "month-select",
              selectedOptions: selectedOptions2,
              setCurrentOptions: setCurrentOptions2,
              setIsOpen: setOpen2,
              setSelectedOptions: setSelectedOptions2
            }
          ) }) : /* @__PURE__ */ jsx("div", { className: "month-range-picker-selected-year", children: selectedOptions2.value }),
          /* @__PURE__ */ jsx(IconButton, { disableRipple: true, disabled: nextIconDisabled, onClick: handleNextYear, children: /* @__PURE__ */ jsx(default_1$1, { className: "right-icon" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ia-render-month-container", children: [
          renderYear(parseInt(selectedOptions1.value), "start"),
          /* @__PURE__ */ jsx("hr", { className: "ia-vertical-line" }),
          renderYear(parseInt(selectedOptions2.value), "end")
        ] }),
        /* @__PURE__ */ jsx("hr", { className: "ia-vertical-line" }),
        /* @__PURE__ */ jsxs("div", { className: "ia-calendar-button", children: [
          /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: handleCancel, children: t("common.cancel") }),
          /* @__PURE__ */ jsx(Button, { onClick: handleApply, children: t("common.apply") })
        ] })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact-monthRangePicker-main-container label-flex-column ${disabled ? "disabled" : ""} ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "monthRangePicker-label", children: [
          t("monthPicker.label"),
          isMandatory && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: monthRangePickerMainContainerRef,
            className: "monthRangePicker-container",
            style: { width: customWidth },
            children: [
              /* @__PURE__ */ jsxs("div", { ref: inputContainerRef, className: "monthRangePicker-input-container", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: startDateInputRef,
                    readOnly: true,
                    "aria-expanded": openCalendar,
                    "aria-haspopup": "dialog",
                    "aria-label": t("monthRangePicker.ariaStartMonth"),
                    className: `dateRangePicker-input-start-date ${startMonth ? "active" : ""} ${isError ? "error" : ""}`,
                    placeholder: t("monthRangePicker.startPlaceholder", { format: displayFormat }),
                    role: "button",
                    type: "text",
                    value: startMonth ? `${formatDate(startMonth)} -` : "",
                    onClick: () => {
                      hanldeInputClick("start month");
                    },
                    onFocus: () => {
                      setFocusInput("start month");
                    },
                    onKeyDown: handleInputKeyDown
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: endDateInputRef,
                    readOnly: true,
                    "aria-expanded": openCalendar,
                    "aria-haspopup": "dialog",
                    "aria-label": t("monthRangePicker.ariaEndMonth"),
                    className: `dateRangePicker-input-end-date ${isError ? "error" : ""}`,
                    name: "endDate",
                    placeholder: t("monthRangePicker.endPlaceholder", { format: displayFormat }),
                    role: "button",
                    type: "text",
                    value: endMonth ? formatDate(endMonth) : "",
                    onClick: () => {
                      hanldeInputClick("end month");
                    },
                    onFocus: () => {
                      setFocusInput("end month");
                    },
                    onKeyDown: handleInputKeyDown
                  }
                ),
                (startMonth || endMonth) && /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": t("monthRangePicker.ariaClose"),
                    className: "close-icon",
                    tabIndex: 0,
                    type: "button",
                    onClick: handleClear,
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClear();
                      }
                    }
                  }
                )
              ] }),
              openCalendar && (withPortal && portalContainer ? /* @__PURE__ */ jsxs(Portal, { container: portalContainer, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `impact-portal-container ${portalClassName}`.trim(),
                    style: {
                      top: position.y,
                      left: position.x,
                      width: `${position.offsetWidth || 0}px`
                    },
                    children: renderCalendarContent()
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": true,
                    className: "ia-select-container-v3-blanket",
                    onClick: () => {
                      setOpenCalendar(false);
                    }
                  }
                )
              ] }) : renderCalendarContent())
            ]
          }
        )
      ]
    }
  );
};
export {
  MonthRangePicker
};
