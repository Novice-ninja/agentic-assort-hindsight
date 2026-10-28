!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact-portal-container{position:absolute;z-index:9999}.ia-select-container-v3-blanket{bottom:0;left:0;position:fixed;right:0;top:0;z-index:9998}.impact-singleMonthPicker-main-container{display:flex;font-family:Manrope,sans-serif}.impact-singleMonthPicker-main-container.single-month-label-flex-column{flex-direction:column}.impact-singleMonthPicker-main-container.single-month-label-flex-column .singleMonthPicker-label{margin-bottom:6px}.impact-singleMonthPicker-main-container .singleMonthPicker-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:16px}.impact-singleMonthPicker-main-container .singleMonthPicker-container{position:relative;width:282px}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container{box-sizing:border-box;display:flex;height:32px;width:100%}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container:hover .singleMonthPicker-input-field{border:1px solid #4259ee}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/calendar.svg) no-repeat;background-color:#fff;background-position:center right 12px;background-size:14px;border:1px solid #c3c8d4;border-radius:8px;box-sizing:border-box;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;padding-left:12px;width:100%}@media screen and (max-width:1399px) and (min-width:1200px){.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field{background-position:center right 10px;background-size:13px;padding-left:10px}}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field.active{width:100%}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field.error{border:1px solid #e15554}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field::placeholder{color:#b4bac7}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field:focus{border:1px solid #4259ee;outline:none}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field:focus::placeholder,.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .singleMonthPicker-input-field:focus:not(:placeholder-shown){color:#4259ee}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .mp-close-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close.svg) no-repeat 50%;background-size:14px;border:none;cursor:pointer;height:24px;padding:0;position:absolute;right:36px;top:16px;transform:translateY(-50%);width:24px}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .mp-close-icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-singleMonthPicker-main-container .singleMonthPicker-input-container .mp-close-icon:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-singleMonthPicker-main-container.disabled{pointer-events:none}.impact-singleMonthPicker-main-container.disabled .singleMonthPicker-label{color:#b4bac7}.impact-singleMonthPicker-main-container.disabled .singleMonthPicker-input-field{background-color:#f8f9fb;background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/calendarDisable.svg);background-position:center right 12px;background-repeat:no-repeat;background-size:14px;border-color:#d9dde7;color:#b4bac7}.impact-singleMonthPicker-main-container.disabled .mp-close-icon{opacity:.6}.mp-single-month-picker-container{background-color:#fff;border:1px solid #f0f0f0;border-radius:12px;box-shadow:0 0 4px #0000001f;height:264px;left:0;padding:16px;position:absolute;top:40px;width:300px;z-index:1200}.month-picker-year-select-container{margin-inline:6px}.month-picker-year-select-container .ia-select-button-text-full-width{flex:0 0 auto}.month-picker-year-select-container .ia-select-styled-dropdown-main-button{border:none;padding:6px}.month-picker-year-select-container .ia-select-button-clear-icon{display:none}.month-picker-year-select-container .ia-select-chevron-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/arrowDownMonthRange.svg) no-repeat;background-position:50%;background-size:10px;margin-left:-110px;margin-right:0}.month-picker-year-select-dropdown{min-width:115px!important;width:115px!important;z-index:9999}.mp-header{align-items:center;display:flex;justify-content:center;padding-inline:8px}.mp-header .Mui-focusVisible:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.mp-header .Mui-focusVisible:focus:not(:focus-visible){box-shadow:none;outline:none}.mp-render-month-container{display:flex;justify-content:space-between}.mp-render-month{display:flex;flex-wrap:wrap;gap:36px;height:128px;margin-top:4px;row-gap:10px;width:252px}.mp-month{align-items:center;-moz-appearance:none;appearance:none;-webkit-appearance:none;background:#0000;border:none;color:inherit;cursor:pointer;display:flex;font:inherit;gap:10px;height:36px;justify-content:center;padding:0;width:36px}.mp-month:hover{background-color:#eceefd;border:1px solid #b3bdf8;border-radius:8px;color:#3649c6}.mp-month.current-month{border:1px solid #eceefd;border-radius:8px}.mp-month:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.mp-month:focus:not(:focus-visible){box-shadow:none;outline:none}.mp-month.Mui-disabled:focus-visible,.mp-month.ia-btn-disabled:focus-visible,.mp-month.ia-switch-disabled:focus-visible,.mp-month.impact-select-disabled:focus-visible,.mp-month.impact_input_disabled:focus-visible,.mp-month.route-disabled:focus-visible,.mp-month:disabled:focus-visible,.mp-month[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.mp-selected-year{color:#1f2b4d;font-size:14px;line-height:16px}.mp-calendar-month,.mp-selected-year{font-family:Manrope,sans-serif;font-weight:500}.mp-calendar-month{font-size:12px;line-height:15px;text-align:left;text-decoration-skip-ink:none;text-underline-position:from-font}.mp-month.end,.mp-month.start{position:relative}.mp-month.end,.mp-month.selected,.mp-month.start{background-color:#4259ee;border-radius:8px;color:#fff}.mp-month.disabled,.mp-month:disabled{color:#b4bac7;cursor:default;pointer-events:none}.mp-vertical-line{border:.5px solid #d9dde7;margin-block:16px 0}.mp-calendar-button{display:flex;gap:16px;justify-content:flex-end;margin-top:16px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ChevronLeftOutlined.js";
import default_1$1 from "../../node_modules/@mui/icons-material/ChevronRightOutlined.js";
import { Button } from "../Button/index.js";
import { Portal } from "../Portal/index.js";
import { Select } from "../Select/index.js";
import { MONTHS_NUMBER } from "./constants.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import IconButton from "../../node_modules/@mui/material/IconButton/IconButton.js";
const defaultYears = () => {
  const today = /* @__PURE__ */ new Date();
  const currentYear = today.getFullYear();
  return Array.from({ length: 10 }, (_, index) => {
    const year = (currentYear - 5 + index).toString();
    return { label: year, value: year };
  });
};
function MonthPicker({
  customYears,
  locale,
  isMandatory = false,
  displayFormat = "MM/YYYY",
  focusedInput = null,
  onApply,
  onMonthChange,
  selectedMonth: initialSelectedMonth = null,
  isOutsideRange = () => false,
  disabled = false,
  showYearSelect = false,
  isError = false,
  customWidth = "282px",
  withPortal = false,
  portalContainer = typeof document !== "undefined" ? document.body : null,
  portalClassName = "",
  YearSelectComponent: YearSelectProp
}) {
  const { t, locale: activeLocale } = useTranslation();
  const effectiveLocale = locale || activeLocale;
  const YearSelect = YearSelectProp ?? Select;
  const today = useMemo(() => /* @__PURE__ */ new Date(), []);
  const yrs = useMemo(() => defaultYears(), []);
  const years = customYears && customYears.length > 0 ? customYears : yrs;
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialSelectedMonth);
  const [, setYearOffset] = useState(0);
  const [currentOptions, setCurrentOptions] = useState(years);
  const [selectedOptions, setSelectedOptions] = useState({
    label: today.getFullYear().toString(),
    value: today.getFullYear().toString()
  });
  const inputContainerRef = useRef(null);
  const dropDownContainerRef = useRef(null);
  const monthInputRef = useRef(null);
  const monthPickerMainContainerRef = useRef(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [focusInput, setFocusInput] = useState(focusedInput);
  const [dummySelectedMonth, setDummySelectedMonth] = useState(initialSelectedMonth);
  const isResetClicked = useRef(false);
  const [focusedMonthIndex, setFocusedMonthIndex] = useState(null);
  const monthButtonRefs = useRef([]);
  const keyboardOpenRef = useRef(false);
  const pendingFocusRef = useRef(null);
  const [prevIconDisabled, setPrevIconDisabled] = useState(false);
  const [nextIconDisabled, setNextIconDisabled] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    offsetHeight: 0,
    offsetWidth: 0
  });
  const handleMonthClick = useCallback(
    (month) => {
      setSelectedMonth(month);
      onMonthChange == null ? void 0 : onMonthChange(month);
    },
    [onMonthChange]
  );
  const formatDate = useCallback(
    (date) => {
      if (!date) return "";
      const month = new Intl.DateTimeFormat(effectiveLocale, { month: "2-digit" }).format(date);
      const year = new Intl.DateTimeFormat(effectiveLocale, { year: "numeric" }).format(date);
      if (displayFormat === "YYYY/MM") return `${year}/${month}`;
      return `${month}/${year}`;
    },
    [displayFormat, effectiveLocale]
  );
  const isMonthSelected = useCallback(
    (month) => {
      if (!selectedMonth || !month) return false;
      return selectedMonth.getMonth() === month.getMonth() && selectedMonth.getFullYear() === month.getFullYear();
    },
    [selectedMonth]
  );
  const renderMonth = useCallback(
    (year, monthIndex) => {
      const monthStart = new Date(year, monthIndex, 1);
      const isSelected = isMonthSelected(monthStart);
      const isDisabled = isOutsideRange(monthStart);
      const isCurrentMonth = monthStart.getFullYear() === today.getFullYear() && monthStart.getMonth() === today.getMonth();
      const variantClass = isSelected ? "selected" : isDisabled ? "disabled" : isCurrentMonth ? "current-month" : "";
      return /* @__PURE__ */ jsx(
        "button",
        {
          ref: (el) => {
            monthButtonRefs.current[monthIndex] = el;
          },
          "aria-label": new Intl.DateTimeFormat(effectiveLocale, {
            month: "long",
            year: "numeric"
          }).format(monthStart),
          "aria-pressed": isSelected,
          className: `mp-month month${monthIndex + 1} ${variantClass}`.trim(),
          disabled: isDisabled,
          tabIndex: focusedMonthIndex === monthIndex ? 0 : -1,
          type: "button",
          onClick: () => {
            handleMonthClick(monthStart);
          },
          onFocus: () => {
            setFocusedMonthIndex(monthIndex);
          },
          children: /* @__PURE__ */ jsx("span", { className: "mp-calendar-month", children: new Intl.DateTimeFormat(effectiveLocale, { month: "short" }).format(monthStart) })
        },
        monthIndex
      );
    },
    [effectiveLocale, today, isMonthSelected, isOutsideRange, handleMonthClick, focusedMonthIndex]
  );
  const renderYear = useCallback(
    (year) => /* @__PURE__ */ jsx("div", { className: "mp-render-month", children: MONTHS_NUMBER.map((m) => renderMonth(year, m)) }),
    [renderMonth]
  );
  const handlePrevYear = useCallback(() => {
    setYearOffset((o) => o - 1);
    setSelectedOptions((prevState) => {
      var _a;
      const newVal = parseInt(prevState.value, 10) - 1;
      const str = newVal.toString();
      if (str === ((_a = currentOptions[0]) == null ? void 0 : _a.value)) setPrevIconDisabled(true);
      return { label: str, value: str };
    });
  }, [currentOptions]);
  const handleNextYear = useCallback(() => {
    setYearOffset((o) => o + 1);
    setSelectedOptions((prevState) => {
      const newVal = parseInt(prevState.value, 10) + 1;
      return { label: newVal.toString(), value: newVal.toString() };
    });
  }, []);
  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !openCalendar) {
        keyboardOpenRef.current = true;
        setOpenCalendar(true);
        setFocusInput("selected month");
        setFocusedMonthIndex((selectedMonth == null ? void 0 : selectedMonth.getMonth()) ?? 0);
      }
    },
    [openCalendar, selectedMonth]
  );
  const handleInputClick = useCallback(() => {
    setOpenCalendar(true);
    setFocusInput("selected month");
  }, []);
  const handleClickOutside = useCallback(
    (event) => {
      const target = event.target;
      if (inputContainerRef.current && !inputContainerRef.current.contains(target) && dropDownContainerRef.current && !dropDownContainerRef.current.contains(target) && !target.closest(".mp-close-icon") && !target.closest(".month-picker-year-select-dropdown") && !isSelectOpen) {
        setOpenCalendar(false);
        if (isResetClicked.current) {
          setSelectedMonth(null);
          setDummySelectedMonth(null);
          isResetClicked.current = false;
        } else {
          setSelectedMonth(dummySelectedMonth);
        }
      }
    },
    [isSelectOpen, dummySelectedMonth]
  );
  useEffect(() => {
    var _a;
    if (focusInput === "selected month") {
      (_a = monthInputRef.current) == null ? void 0 : _a.focus();
    }
  }, [focusInput]);
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openCalendar, handleClickOutside]);
  const handleClear = useCallback(() => {
    setSelectedMonth(null);
    setDummySelectedMonth(null);
    isResetClicked.current = true;
  }, []);
  const handleCancel = useCallback(() => {
    setOpenCalendar(false);
    setSelectedMonth(dummySelectedMonth);
  }, [dummySelectedMonth]);
  const handleCalendarKeyDown = useCallback(
    (e) => {
      var _a, _b;
      if (e.key === "Escape") {
        handleCancel();
        (_a = monthInputRef.current) == null ? void 0 : _a.focus();
        return;
      }
      const moves = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: 4,
        ArrowUp: -4
      };
      const delta = moves[e.key];
      if (delta !== void 0 && focusedMonthIndex !== null) {
        e.preventDefault();
        const next = focusedMonthIndex + delta;
        if (next > 11) {
          if (!nextIconDisabled) {
            pendingFocusRef.current = next - 12;
            handleNextYear();
          }
        } else if (next < 0) {
          if (!prevIconDisabled) {
            pendingFocusRef.current = next + 12;
            handlePrevYear();
          }
        } else {
          setFocusedMonthIndex(next);
          (_b = monthButtonRefs.current[next]) == null ? void 0 : _b.focus();
        }
      }
    },
    [
      focusedMonthIndex,
      nextIconDisabled,
      prevIconDisabled,
      handleNextYear,
      handlePrevYear,
      handleCancel
    ]
  );
  const handleApply = useCallback(() => {
    setOpenCalendar(false);
    setDummySelectedMonth(selectedMonth);
    onApply == null ? void 0 : onApply(selectedMonth);
  }, [selectedMonth, onApply]);
  useLayoutEffect(() => {
    if (withPortal && monthPickerMainContainerRef.current) {
      const rect = monthPickerMainContainerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setPosition({
        x: rect.x,
        y: rect.y + scrollY,
        offsetHeight: rect.height,
        offsetWidth: rect.width
      });
    }
  }, [openCalendar, withPortal]);
  useEffect(() => {
    if (openCalendar && keyboardOpenRef.current && focusedMonthIndex !== null) {
      const timer = setTimeout(() => {
        var _a;
        (_a = monthButtonRefs.current[focusedMonthIndex]) == null ? void 0 : _a.focus();
      }, 0);
      keyboardOpenRef.current = false;
      return () => {
        clearTimeout(timer);
      };
    }
    return void 0;
  }, [openCalendar, focusedMonthIndex]);
  useEffect(() => {
    if (pendingFocusRef.current !== null) {
      const idx = pendingFocusRef.current;
      pendingFocusRef.current = null;
      setFocusedMonthIndex(idx);
      setTimeout(() => {
        var _a;
        (_a = monthButtonRefs.current[idx]) == null ? void 0 : _a.focus();
      }, 0);
    }
  }, [selectedOptions]);
  useEffect(() => {
    var _a, _b;
    if (selectedOptions.value === ((_a = currentOptions[0]) == null ? void 0 : _a.value)) {
      setPrevIconDisabled(true);
    } else {
      setPrevIconDisabled(false);
    }
    if (selectedOptions.value === ((_b = currentOptions[currentOptions.length - 1]) == null ? void 0 : _b.value)) {
      setNextIconDisabled(true);
    } else {
      setNextIconDisabled(false);
    }
  }, [selectedOptions, currentOptions]);
  const computedIsError = useMemo(
    () => Boolean(isError || selectedMonth && isOutsideRange(selectedMonth)),
    [isError, selectedMonth, isOutsideRange]
  );
  const renderCalendarContent = () => /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dropDownContainerRef,
      "aria-label": t("monthPicker.ariaMonthPicker"),
      className: "mp-single-month-picker-container",
      role: "dialog",
      onKeyDown: handleCalendarKeyDown,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mp-header", children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disableRipple: true,
              disabled: prevIconDisabled,
              sx: { padding: 0 },
              onClick: handlePrevYear,
              children: /* @__PURE__ */ jsx(default_1, { className: "mp-left-icon" })
            }
          ),
          showYearSelect ? /* @__PURE__ */ jsx("div", { className: "month-picker-year-select-container", children: /* @__PURE__ */ jsx(
            YearSelect,
            {
              isWithSearch: true,
              withPortal: true,
              currentOptions,
              dropDownPortalClassName: "month-picker-year-select-dropdown",
              initialOptions: years,
              isOpen: isSelectOpen,
              minWidth: 62,
              name: "year-select",
              selectedOptions,
              setCurrentOptions,
              setIsOpen: setIsSelectOpen,
              setSelectedOptions: (opts) => {
                if (opts && !Array.isArray(opts)) setSelectedOptions(opts);
              }
            }
          ) }) : /* @__PURE__ */ jsx("div", { className: "mp-selected-year", children: selectedOptions.value }),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disableRipple: true,
              disabled: nextIconDisabled,
              sx: { padding: 0 },
              onClick: handleNextYear,
              children: /* @__PURE__ */ jsx(default_1$1, { className: "mp-right-icon" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mp-render-month-container", children: renderYear(parseInt(selectedOptions.value, 10)) }),
        /* @__PURE__ */ jsx("hr", { className: "mp-vertical-line" }),
        /* @__PURE__ */ jsxs("div", { className: "mp-calendar-button", children: [
          /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: handleCancel, children: t("common.cancel") }),
          /* @__PURE__ */ jsx(Button, { onClick: handleApply, children: t("common.apply") })
        ] })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact-singleMonthPicker-main-container single-month-label-flex-column ${disabled ? "disabled" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "singleMonthPicker-label", children: [
          t("monthPicker.label"),
          isMandatory && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: monthPickerMainContainerRef,
            className: "singleMonthPicker-container",
            style: { width: customWidth },
            children: [
              /* @__PURE__ */ jsxs("div", { ref: inputContainerRef, className: "singleMonthPicker-input-container", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: monthInputRef,
                    readOnly: true,
                    "aria-expanded": openCalendar,
                    "aria-haspopup": "dialog",
                    "aria-label": t("monthPicker.ariaSelectedMonth"),
                    className: `singleMonthPicker-input-field ${selectedMonth ? "active" : ""} ${computedIsError ? "error" : ""}`.trim(),
                    placeholder: t("monthPicker.placeholder", { format: displayFormat }),
                    type: "text",
                    value: selectedMonth ? formatDate(selectedMonth) : "",
                    onBlur: () => {
                      setFocusInput(null);
                    },
                    onClick: handleInputClick,
                    onFocus: () => {
                      setFocusInput("selected month");
                    },
                    onKeyDown: handleInputKeyDown
                  }
                ),
                selectedMonth && /* @__PURE__ */ jsx(
                  "button",
                  {
                    "aria-label": t("monthPicker.ariaClose"),
                    className: "mp-close-icon",
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
}
MonthPicker.displayName = "MonthPicker";
export {
  MONTHS_NUMBER,
  MonthPicker
};
