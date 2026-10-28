import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useCallback, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "../../i18n/useTranslation.js";
const FORMAT_MAP = {
  "DD-MM-YYYY": { day: [0, 2], month: [3, 5], year: [6, 10] },
  "MM-DD-YYYY": { day: [3, 5], month: [0, 2], year: [6, 10] },
  "YYYY-MM-DD": { day: [8, 10], month: [5, 7], year: [0, 4] }
};
const NUMBER_POSITIONS_DD_MM_YYYY = [0, 1, 3, 4, 6, 7, 8, 9];
const NUMBER_POSITIONS_YYYY_MM_DD = [0, 1, 2, 3, 5, 6, 8, 9];
const DatePickerInput = forwardRef(
  ({
    dateString,
    placeholder,
    isDisabled,
    isError,
    inputContainerRef,
    displayFormat = "DD-MM-YYYY",
    onDateStringChange,
    minDate,
    maxDate,
    onCancel,
    readOnly = false,
    customIcon,
    inputProps,
    setIsOpen,
    isOpen,
    selectedDate: _selectedDate,
    id,
    "data-testid": dataTestId,
    ...rest
  }, ref) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const [errorState, setErrorState] = useState(false);
    const [pendingCursorPosition, setPendingCursorPosition] = useState(null);
    const NUMBER_POSITIONS = displayFormat === "YYYY-MM-DD" ? NUMBER_POSITIONS_YYYY_MM_DD : NUMBER_POSITIONS_DD_MM_YYYY;
    const setInputRef = useCallback(
      (node) => {
        inputRef.current = node;
        if (!ref) return;
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        const legacyRef = ref;
        if (legacyRef.inputRef) {
          legacyRef.inputRef.current = node;
          return;
        }
        legacyRef.current = node;
      },
      [ref]
    );
    useEffect(() => {
      if (onCancel !== void 0 && onCancel > 0) {
        setErrorState(false);
        setInputValue("");
      }
    }, [onCancel]);
    useEffect(() => {
      if (pendingCursorPosition !== null && inputRef.current) {
        inputRef.current.setSelectionRange(pendingCursorPosition, pendingCursorPosition);
        setPendingCursorPosition(null);
      }
    }, [inputValue, pendingCursorPosition]);
    useEffect(() => {
      setInputValue(dateString || "");
    }, [dateString]);
    useEffect(() => {
      if (readOnly) {
        return;
      }
      if (!inputValue && isFocused) {
        setInputValue(displayFormat);
        setPendingCursorPosition(NUMBER_POSITIONS[0] ?? null);
      }
    }, [isFocused, displayFormat, NUMBER_POSITIONS, readOnly, inputValue]);
    const validateDate = useCallback(
      (date, currentInputValue) => {
        if (!date) return false;
        try {
          const momentDate = typeof date === "string" ? moment(date, displayFormat, true) : moment(date);
          if (!momentDate.isValid()) return false;
          if (minDate && momentDate.isBefore(minDate, "day")) return false;
          if (maxDate && momentDate.isAfter(maxDate, "day")) return false;
          const format = displayFormat || "DD-MM-YYYY";
          const formatInfo = FORMAT_MAP[format] ?? FORMAT_MAP["DD-MM-YYYY"];
          if (!formatInfo) return false;
          const day = parseInt(currentInputValue.substring(formatInfo.day[0], formatInfo.day[1]), 10) || 0;
          const month = parseInt(currentInputValue.substring(formatInfo.month[0], formatInfo.month[1]), 10) || 0;
          const year = parseInt(currentInputValue.substring(formatInfo.year[0], formatInfo.year[1]), 10) || 0;
          if (month < 1 || month > 12) return false;
          const lastDayOfMonth = moment(`${year}-${month}`, "YYYY-M").daysInMonth();
          if (day < 1 || day > lastDayOfMonth) return false;
          return true;
        } catch {
          return false;
        }
      },
      [displayFormat, minDate, maxDate]
    );
    const handleDateInputFocus = () => {
      setIsFocused(true);
      setIsOpen(true);
      if (!inputValue && !readOnly) {
        setInputValue(displayFormat);
      }
      if (inputRef.current) {
        inputRef.current.setSelectionRange(0, 0);
      }
    };
    const handleDateInputBlur = () => {
      setIsFocused(false);
      try {
        const parsedDate = moment(inputValue, displayFormat, true);
        if (parsedDate.isValid()) {
          const isValid = validateDate(parsedDate, inputValue);
          setErrorState(!isValid);
          if (isValid) {
            onDateStringChange == null ? void 0 : onDateStringChange(parsedDate);
          }
        } else {
          setErrorState(true);
        }
        if (!inputValue || inputValue === displayFormat) {
          setInputValue("");
          setErrorState(false);
          onDateStringChange == null ? void 0 : onDateStringChange(null);
        }
      } catch {
        setErrorState(true);
      }
    };
    const handleInputClick = () => {
      setIsOpen(true);
      if (inputRef.current) {
        const cursor = inputRef.current.selectionStart ?? 0;
        const lastIdx = NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1];
        const lastPos = (lastIdx ?? 0) + 1;
        if (cursor >= lastPos) {
          inputRef.current.setSelectionRange(lastPos, lastPos);
          return;
        }
        if (!NUMBER_POSITIONS.includes(cursor)) {
          const nextPos = NUMBER_POSITIONS.find((p) => p >= cursor) ?? lastIdx ?? 0;
          inputRef.current.setSelectionRange(nextPos, nextPos);
        }
      }
    };
    const handleInputChange = (e) => {
      try {
        const input = e.target;
        const value = input.value;
        const cursorPosition = input.selectionStart;
        if (cursorPosition == null || cursorPosition < 1) return;
        const newChar = value[cursorPosition - 1];
        if (newChar == null || !/^\d$/.test(newChar)) return;
        const pos = cursorPosition - 1;
        if (!NUMBER_POSITIONS.includes(pos)) {
          e.preventDefault();
          const next = NUMBER_POSITIONS.find((p) => p > pos) ?? NUMBER_POSITIONS[NUMBER_POSITIONS.length - 1];
          setPendingCursorPosition(next ?? null);
          return;
        }
        const newValue = inputValue.slice(0, pos) + newChar + inputValue.slice(pos + 1);
        if (newValue.length > displayFormat.length) return;
        setInputValue(newValue);
        onDateStringChange == null ? void 0 : onDateStringChange(newValue);
        const currentIndex = NUMBER_POSITIONS.indexOf(pos);
        if (currentIndex < NUMBER_POSITIONS.length - 1) {
          const next = NUMBER_POSITIONS[currentIndex + 1];
          setPendingCursorPosition(next ?? null);
        } else {
          const parsedDate = moment(newValue, displayFormat, true);
          const isValid = parsedDate.isValid() && validateDate(parsedDate, newValue);
          setErrorState(!isValid);
          onDateStringChange == null ? void 0 : onDateStringChange(isValid ? parsedDate : newValue);
        }
      } catch {
        setErrorState(true);
      }
    };
    const handleKeyDown = (e) => {
      var _a;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Tab") return;
      if (e.key === "Enter" && !isOpen) {
        setIsOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        const caret = ((_a = inputRef.current) == null ? void 0 : _a.selectionStart) ?? 0;
        const deletePos = [...NUMBER_POSITIONS].reverse().find((p) => p < caret);
        if (deletePos == null) return;
        const sep = displayFormat[deletePos] ?? "";
        const newValue = inputValue.slice(0, deletePos) + sep + inputValue.slice(deletePos + 1);
        setInputValue(newValue);
        onDateStringChange == null ? void 0 : onDateStringChange(newValue);
        let nextCaret = deletePos;
        while (nextCaret > 0 && !NUMBER_POSITIONS.includes(nextCaret - 1)) {
          nextCaret--;
        }
        setPendingCursorPosition(nextCaret);
        return;
      }
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };
    const showError = Boolean(isError ?? errorState);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: inputContainerRef,
        className: `datePicker-input-container ${isDisabled ? "datePicker-input-disabled" : ""} ${showError ? "impact-datePicker-error" : ""} ${customIcon ? "datePicker-input-container-custom-icon" : ""}`.trim(),
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: setInputRef,
              className: "impact-datepicker-date-input",
              "data-testid": dataTestId,
              disabled: isDisabled,
              id,
              placeholder: placeholder ?? t("datePicker.selectDate"),
              readOnly,
              type: "text",
              value: inputValue,
              onBlur: handleDateInputBlur,
              onChange: handleInputChange,
              onClick: handleInputClick,
              onFocus: handleDateInputFocus,
              onKeyDown: handleKeyDown,
              ...inputProps,
              ...rest
            }
          ),
          customIcon
        ]
      }
    );
  }
);
DatePickerInput.displayName = "DatePickerInput";
export {
  DatePickerInput
};
