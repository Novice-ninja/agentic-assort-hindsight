import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import moment from "moment";
import { getAssetUrl } from "../../utils/assetBase.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const calendarIcon = getAssetUrl("icons/calendar.svg");
function DateRangePickerInput({
  inputContainerRef,
  startDateString,
  startDateInputRef,
  startDateInputProps,
  endDateString,
  endDateInputRef,
  endDateInputProps,
  isDisabled,
  isError,
  onStartDateFocus,
  onEndDateFocus,
  displayFormat = "DD-MM-YYYY",
  onStartDateStringChange,
  onEndDateStringChange,
  minDate,
  maxDate,
  readOnly,
  isOutsideRange,
  onErrorStateChange,
  clearErrorsTrigger,
  resetTrigger,
  customIcon
}) {
  const { t } = useTranslation();
  const [startInputValue, setStartInputValue] = useState("");
  const [endInputValue, setEndInputValue] = useState("");
  const [startErrorState, setStartErrorState] = useState(false);
  const [endErrorState, setEndErrorState] = useState(false);
  const [startPendingCursorPosition, setStartPendingCursorPosition] = useState(null);
  const [endPendingCursorPosition, setEndPendingCursorPosition] = useState(null);
  const NUMBER_POSITIONS = [0, 1, 3, 4, 6, 7, 8, 9];
  useEffect(() => {
    if (startPendingCursorPosition !== null && startDateInputRef.current) {
      startDateInputRef.current.setSelectionRange(
        startPendingCursorPosition,
        startPendingCursorPosition
      );
      setStartPendingCursorPosition(null);
    }
  }, [startInputValue, startPendingCursorPosition]);
  useEffect(() => {
    if (endPendingCursorPosition !== null && endDateInputRef.current) {
      endDateInputRef.current.setSelectionRange(endPendingCursorPosition, endPendingCursorPosition);
      setEndPendingCursorPosition(null);
    }
  }, [endInputValue, endPendingCursorPosition]);
  useEffect(() => {
    if (startDateString) {
      setStartInputValue(startDateString);
    } else {
      setStartInputValue("");
    }
  }, [startDateString]);
  useEffect(() => {
    if (endDateString) {
      setEndInputValue(endDateString);
    } else {
      setEndInputValue("");
    }
  }, [endDateString]);
  useEffect(() => {
    const hasErrors = startErrorState || endErrorState;
    if (onErrorStateChange) {
      onErrorStateChange(hasErrors);
    }
  }, [startErrorState, endErrorState, onErrorStateChange]);
  useEffect(() => {
    if (clearErrorsTrigger > 0) {
      setStartErrorState(false);
      setEndErrorState(false);
    }
  }, [clearErrorsTrigger]);
  useEffect(() => {
    if (resetTrigger > 0) {
      setStartErrorState(false);
      setEndErrorState(false);
      setStartInputValue("");
      setEndInputValue("");
      onStartDateStringChange == null ? void 0 : onStartDateStringChange(null);
      onEndDateStringChange == null ? void 0 : onEndDateStringChange(null);
    }
  }, [resetTrigger]);
  const validateDate = (date, isStartDate) => {
    if (!date) return false;
    if (minDate && moment(date).isBefore(minDate, "day")) {
      return false;
    }
    if (maxDate && moment(date).isAfter(maxDate, "day")) {
      return false;
    }
    const inputValue = isStartDate ? startInputValue : endInputValue;
    const format = displayFormat || "DD-MM-YYYY";
    const formatMap = {
      "DD-MM-YYYY": { day: [0, 2], month: [3, 5], year: [6, 10] },
      "MM-DD-YYYY": { day: [3, 5], month: [0, 2], year: [6, 10] },
      "YYYY-MM-DD": { day: [8, 10], month: [5, 7], year: [0, 4] }
    };
    const formatInfo = formatMap[format] || formatMap["DD-MM-YYYY"];
    const day = parseInt(inputValue.substring(formatInfo.day[0], formatInfo.day[1]));
    const month = parseInt(inputValue.substring(formatInfo.month[0], formatInfo.month[1]));
    const year = parseInt(inputValue.substring(formatInfo.year[0], formatInfo.year[1]));
    if (month < 1 || month > 12) {
      return false;
    }
    const lastDayOfMonth = moment(`${year}-${month}`, "YYYY-M").daysInMonth();
    if (day < 1 || day > lastDayOfMonth) {
      return false;
    }
    if (isStartDate && endInputValue) {
      const endDate = moment(endInputValue, displayFormat, true);
      if (endDate.isValid() && moment(date).isAfter(endDate, "day")) {
        return false;
      }
    }
    if (!isStartDate && startInputValue) {
      const startDate = moment(startInputValue, displayFormat, true);
      if (startDate.isValid() && moment(date).isBefore(startDate, "day")) {
        return false;
      }
    }
    if (isOutsideRange == null ? void 0 : isOutsideRange(moment(date))) {
      return false;
    }
    return true;
  };
  const handleStartDateInputFocus = () => {
    if (!startInputValue) {
      setStartInputValue(displayFormat);
      setTimeout(() => {
        if (startDateInputRef.current) {
          startDateInputRef.current.setSelectionRange(0, 0);
        }
      }, 0);
    }
    onStartDateFocus();
  };
  const handleEndDateInputFocus = () => {
    if (!endInputValue) {
      setEndInputValue(displayFormat);
      setTimeout(() => {
        if (endDateInputRef.current) {
          endDateInputRef.current.setSelectionRange(0, 0);
        }
      }, 0);
    }
    onEndDateFocus();
  };
  const handleStartDateInputBlur = () => {
    const parsedDate = moment(startInputValue, displayFormat, true);
    if (parsedDate.isValid()) {
      const isValid = validateDate(parsedDate, true);
      setStartErrorState(!isValid);
      if (isValid) {
        onStartDateStringChange == null ? void 0 : onStartDateStringChange(parsedDate);
      }
    } else {
      setStartErrorState(true);
    }
    if (!startInputValue || startInputValue === displayFormat) {
      setStartInputValue("");
      setStartErrorState(false);
      onStartDateStringChange == null ? void 0 : onStartDateStringChange(null);
    }
  };
  const handleEndDateInputBlur = () => {
    const parsedDate = moment(endInputValue, displayFormat, true);
    if (parsedDate.isValid()) {
      const isValid = validateDate(parsedDate, false);
      setEndErrorState(!isValid);
      if (isValid) {
        onEndDateStringChange == null ? void 0 : onEndDateStringChange(parsedDate);
      }
    } else {
      setEndErrorState(true);
    }
    if (!endInputValue || endInputValue === displayFormat) {
      setEndInputValue("");
      setEndErrorState(false);
      onEndDateStringChange == null ? void 0 : onEndDateStringChange(null);
    }
  };
  const handleStartDateInputClick = () => {
    if (startDateInputRef.current) {
      const cursor = startDateInputRef.current.selectionStart;
      if (cursor >= NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1) {
        startDateInputRef.current.setSelectionRange(
          NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1,
          NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1
        );
        return;
      }
      if (!NUMBER_POSITIONS.includes(cursor)) {
        const nextPos = NUMBER_POSITIONS.find((pos) => pos >= cursor);
        const fallbackPos = NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1];
        startDateInputRef.current.setSelectionRange(
          nextPos !== void 0 ? nextPos : fallbackPos,
          nextPos !== void 0 ? nextPos : fallbackPos
        );
      }
    }
  };
  const handleEndDateInputClick = () => {
    if (endDateInputRef.current) {
      const cursor = endDateInputRef.current.selectionStart;
      if (cursor >= NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1) {
        endDateInputRef.current.setSelectionRange(
          NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1,
          NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1] + 1
        );
        return;
      }
      if (!NUMBER_POSITIONS.includes(cursor)) {
        const nextPos = NUMBER_POSITIONS.find((pos) => pos >= cursor);
        const fallbackPos = NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1];
        endDateInputRef.current.setSelectionRange(
          nextPos !== void 0 ? nextPos : fallbackPos,
          nextPos !== void 0 ? nextPos : fallbackPos
        );
      }
    }
  };
  const handleStartDateInputChange = (e) => {
    var _a;
    const input = e.target;
    const value = input.value;
    const cursorPosition = input.selectionStart;
    if (cursorPosition == null || cursorPosition < 1) return;
    const newChar = value[cursorPosition - 1];
    if (!/^\d$/.test(newChar)) return;
    const pos = cursorPosition - 1;
    if (!NUMBER_POSITIONS.includes(pos)) {
      (_a = e.preventDefault) == null ? void 0 : _a.call(e);
      setStartPendingCursorPosition(
        NUMBER_POSITIONS.find((p) => p > pos) ?? NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1]
      );
      return;
    }
    const newValue = startInputValue.slice(0, pos) + newChar + startInputValue.slice(pos + 1);
    if (newValue.length > displayFormat.length) return;
    setStartInputValue(newValue);
    onStartDateStringChange == null ? void 0 : onStartDateStringChange(newValue);
    const currentIndex = NUMBER_POSITIONS.indexOf(pos);
    if (currentIndex < NUMBER_POSITIONS.length - 1) {
      const nextPos = NUMBER_POSITIONS[currentIndex + 1];
      setStartPendingCursorPosition(nextPos);
    } else {
      const parsedDate = moment(newValue, displayFormat, true);
      const isValid = parsedDate.isValid() && validateDate(parsedDate, true);
      setStartErrorState(!isValid);
      onStartDateStringChange == null ? void 0 : onStartDateStringChange(isValid ? parsedDate : newValue);
    }
  };
  const handleEndDateInputChange = (e) => {
    var _a;
    const input = e.target;
    const value = input.value;
    const cursorPosition = input.selectionStart;
    if (cursorPosition == null || cursorPosition < 1) return;
    const newChar = value[cursorPosition - 1];
    if (!/^\d$/.test(newChar)) return;
    const pos = cursorPosition - 1;
    if (!NUMBER_POSITIONS.includes(pos)) {
      (_a = e.preventDefault) == null ? void 0 : _a.call(e);
      setEndPendingCursorPosition(
        NUMBER_POSITIONS.find((p) => p > pos) ?? NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1]
      );
      return;
    }
    const newValue = endInputValue.slice(0, pos) + newChar + endInputValue.slice(pos + 1);
    if (newValue.length > displayFormat.length) return;
    setEndInputValue(newValue);
    onEndDateStringChange == null ? void 0 : onEndDateStringChange(newValue);
    const currentIndex = NUMBER_POSITIONS.indexOf(pos);
    if (currentIndex < NUMBER_POSITIONS.length - 1) {
      const nextPos = NUMBER_POSITIONS[currentIndex + 1];
      setEndPendingCursorPosition(nextPos);
    } else {
      const parsedDate = moment(newValue, displayFormat, true);
      const isValid = parsedDate.isValid() && validateDate(parsedDate, false);
      setEndErrorState(!isValid);
      onEndDateStringChange == null ? void 0 : onEndDateStringChange(isValid ? parsedDate : newValue);
    }
  };
  const handleStartDateKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") {
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      const caret = startDateInputRef.current.selectionStart;
      const deletePos = [...NUMBER_POSITIONS].reverse().find((p) => p < caret);
      if (deletePos == null) return;
      const newValue = startInputValue.slice(0, deletePos) + displayFormat[deletePos] + // "D" | "M" | "Y"
      startInputValue.slice(deletePos + 1);
      setStartInputValue(newValue);
      onStartDateStringChange == null ? void 0 : onStartDateStringChange(newValue);
      let nextCaret = deletePos;
      while (nextCaret > 0 && !NUMBER_POSITIONS.includes(nextCaret - 1)) {
        nextCaret--;
      }
      setStartPendingCursorPosition(nextCaret);
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };
  const handleEndDateKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") {
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      const caret = endDateInputRef.current.selectionStart;
      const deletePos = [...NUMBER_POSITIONS].reverse().find((p) => p < caret);
      if (deletePos == null) return;
      const newValue = endInputValue.slice(0, deletePos) + displayFormat[deletePos] + // "D" | "M" | "Y"
      endInputValue.slice(deletePos + 1);
      setEndInputValue(newValue);
      onEndDateStringChange == null ? void 0 : onEndDateStringChange(newValue);
      let nextCaret = deletePos;
      while (nextCaret > 0 && !NUMBER_POSITIONS.includes(nextCaret - 1)) {
        nextCaret--;
      }
      setEndPendingCursorPosition(nextCaret);
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: inputContainerRef,
      className: `dateRangePicker-input-container ${isDisabled ? "dateRangePicker-input-disabled" : ""}
      ${isError || startErrorState || endErrorState ? "impact-dateRangePicker-error" : ""}`,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: startDateInputRef,
            placeholder: t("dateRangePicker.startPlaceholder"),
            readOnly,
            type: "text",
            value: startInputValue,
            onBlur: handleStartDateInputBlur,
            onChange: handleStartDateInputChange,
            onClick: handleStartDateInputClick,
            onFocus: handleStartDateInputFocus,
            onKeyDown: handleStartDateKeyDown,
            ...startDateInputProps,
            className: "dateRangePicker-input-start-date",
            disabled: isDisabled
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: endDateInputRef,
            placeholder: t("dateRangePicker.endPlaceholder"),
            readOnly,
            type: "text",
            value: endInputValue,
            onBlur: handleEndDateInputBlur,
            onChange: handleEndDateInputChange,
            onClick: handleEndDateInputClick,
            onFocus: handleEndDateInputFocus,
            onKeyDown: handleEndDateKeyDown,
            ...endDateInputProps,
            className: "dateRangePicker-input-end-date",
            disabled: isDisabled
          }
        ),
        customIcon ? /* @__PURE__ */ jsx(
          "span",
          {
            className: "end-date-icon",
            style: {
              position: "absolute",
              right: 10,
              top: "0px",
              transform: "translateY(-50%)",
              cursor: isDisabled ? "" : "pointer",
              opacity: isDisabled ? 0.5 : 1
            },
            children: customIcon
          }
        ) : /* @__PURE__ */ jsx(
          "span",
          {
            className: "end-date-icon",
            style: {
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: isDisabled ? "" : "pointer",
              width: 14,
              height: 14,
              background: `url(${calendarIcon}) no-repeat center/contain`,
              opacity: isDisabled ? 0.5 : 1
            },
            onClick: (e) => {
              e.stopPropagation();
              if (startDateInputRef.current && !isDisabled) {
                startDateInputRef.current.focus();
              }
            }
          }
        )
      ]
    }
  );
}
export {
  DateRangePickerInput
};
