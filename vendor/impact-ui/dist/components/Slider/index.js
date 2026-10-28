!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode(".slider-container{display:flex;flex-direction:column;gap:2px;min-height:calc(100% + 20px)}.impact_slider_layout{display:flex;gap:16px}.impact_slider_layout .input_layout_style .MuiFormControl-root .MuiInputBase-root{background-color:#fff;border:1px solid #c3c8d4;border-radius:8px;height:32px;width:75px}.impact_slider_layout .input_layout_style .MuiFormControl-root .MuiInputBase-root:focus,.impact_slider_layout .input_layout_style .MuiFormControl-root .MuiInputBase-root:hover{border:1px solid #4259ee}.impact_slider_layout .input_layout_style .MuiFormControl-root .MuiInputBase-root fieldset{border:none!important}.impact_slider_layout .impact_slider_layout_heading{font-size:22px;font-weight:400;line-height:30.05px}.impact_slider_layout.header-top{flex-direction:column}.impact_slider_layout.header-left{align-items:center;flex-direction:row;gap:32px}.impact_slider_layout.input-position-inline{align-items:flex-end!important;gap:24px}.impact_slider_layout.input-position-inline .impact_slider_main_container{flex:1}.impact_slider_layout.input-position-inline .input_layout_style{flex-shrink:0}.impact_slider_layout.input-position-bottom{flex-direction:column;gap:16px}.impact_slider_layout.input-position-bottom .impact_slider_main_container{width:100%}.impact_slider_layout.input-position-bottom .input_layout_style{align-self:flex-end}.impact_slider_layout .impact_slider_container{width:390px}.impact_slider_layout .impact_slider_container .impact_slider_labelname{color:#60697d;display:block;font-size:12px;font-weight:500;margin-bottom:8px;margin-top:8px}.impact_slider_layout .impact_slider_container .impact_slider_main_container{align-items:center;display:flex;gap:16px;position:relative}.impact_slider_layout .impact_slider_container .impact_slider_main_container .impact_slider_threshold_marker{background-color:#e74b1c;border-radius:1px;height:8px;pointer-events:none;position:absolute;top:50%;transform:translate(-50%,-50%);width:2px;z-index:1}.impact_slider_layout .impact_slider_container .impact_slider_main_container .MuiSlider-root{color:#4259ee;height:4px}.impact_slider_layout .impact_slider_container .impact_slider_main_container .MuiSlider-rail{background:#d9dde7;opacity:1}.impact_slider_layout .impact_slider_container .impact_slider_main_container .MuiSlider-thumb:hover{box-shadow:none}.impact_slider_layout .impact_slider_container .impact_slider_main_container .MuiSlider-valueLabel{background-color:#0d152c;color:#fff}.impact_slider_layout .impact_slider_container .impact_slider_main_container_disabled{pointer-events:none}.impact_slider_layout .impact_slider_container .impact_slider_main_container_disabled .MuiSlider-root{color:#c3c8d4;height:4px}.impact_slider_layout .impact_slider_container .impact_slider_main_container_disabled .MuiSlider-rail{background:#c3c8d4;opacity:1}.impact_slider_layout .impact_slider_disabled .MuiSlider-root{color:#d9dde7!important}.impact_slider_layout .impact_slider_disabled .MuiInputBase-root{background:#f2f4fb;border:1px solid #d9dde7;color:#d9dde7}.impact_slider_layout .impact_slider_disabled .MuiInputBase-root:focus,.impact_slider_layout .impact_slider_disabled .MuiInputBase-root:hover{border:1px solid #d9dde7!important}.impact_slider_layout .impact_slider_disabled .MuiInputBase-root fieldset{border:none!important}.impact_slider_layout .input_layout_style.ranged form{align-items:center;display:flex}.impact_slider_layout .input_layout_style.ranged form .MuiFormControl-root{align-items:center;display:flex;flex-direction:row;flex-grow:1;justify-content:space-between}.impact_slider_layout .input_layout_style.single form{align-items:center;display:flex;justify-content:center}.impact_slider_layout .input_layout_style.single form .MuiFormControl-root{width:120px}.MuiSlider-thumb,.MuiSlider-thumb:before{box-shadow:none!important}.MuiSlider-thumb:active,.MuiSlider-thumb:hover{box-shadow:none!important;z-index:2}.MuiSlider-thumb.Mui-focusVisible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee)!important;outline:none;transition:box-shadow .15s ease-in-out;z-index:2}.Mui-disabled{pointer-events:none}.Mui-disabled.MuiOutlinedInput-root fieldset,.Mui-disabled.MuiOutlinedInput-root:focus-within fieldset,.Mui-disabled.MuiOutlinedInput-root:hover fieldset{border-color:#e0e0e0!important}.slider-info-message{align-items:center;color:#e15554;display:flex;font-size:12px;gap:6px;height:20px;opacity:1;padding-left:91px;transform:translateY(0);transition:opacity .2s ease-out,transform .2s ease-out}.slider-info-message.hidden{opacity:0;pointer-events:none;transform:translateY(-4px)}.slider-info-message .slider-info-icon{flex-shrink:0;font-size:14px}.slider-info-message .slider-info-text{font-weight:500;line-height:16px}.slider-info-placeholder{height:20px;width:100%}")),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/InfoOutlined.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import FormControl from "../../node_modules/@mui/material/FormControl/FormControl.js";
import OutlinedInput from "../../node_modules/@mui/material/OutlinedInput/OutlinedInput.js";
import Slider$1 from "../../node_modules/@mui/material/Slider/Slider.js";
const DEFAULT_BELOW_THRESHOLD_COLOR = "#4259ee";
const DEFAULT_ABOVE_THRESHOLD_COLOR = "#ED9998";
function isRangedValue(value) {
  return Array.isArray(value) && value.length === 2;
}
function Slider({
  headerOrientation: _headerOrientation = "top",
  header,
  label,
  value = 0,
  onChange,
  required,
  disabled,
  min = 0,
  max = 100,
  variant = "default",
  inputPosition = "inline",
  colorChangeThreshold,
  valueFormat,
  messageTimeout = 5e3,
  className,
  id,
  "data-testid": dataTestId,
  ...sliderProps
}) {
  const { t } = useTranslation();
  const [infoMessage, setInfoMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [rightInputFocused, setRightInputFocused] = useState(false);
  const [formattedValue, setFormattedValue] = useState(
    Array.isArray(value) ? value.map(String) : String(value)
  );
  const isRanged = variant === "ranged" && isRangedValue(value);
  const primaryValue = isRangedValue(value) ? value[0] : value;
  const secondaryValue = isRangedValue(value) ? value[1] : value;
  const { isAboveThreshold, trackSplitPercent, thresholdMarkerLeft } = useMemo(() => {
    const valueForThresh = Array.isArray(value) ? Math.max(...value) : value;
    if (colorChangeThreshold == null) {
      return { isAboveThreshold: false, trackSplitPercent: 0, thresholdMarkerLeft: null };
    }
    const ranged = Array.isArray(value) && value.length === 2;
    const primary = ranged ? value[0] : void 0;
    const secondary = ranged ? value[1] : void 0;
    const aboveThresh = valueForThresh > colorChangeThreshold;
    let split;
    if (ranged && primary != null && secondary != null) {
      if (colorChangeThreshold <= primary) split = 0;
      else if (colorChangeThreshold >= secondary) split = 100;
      else split = (colorChangeThreshold - primary) / (secondary - primary) * 100;
    } else {
      split = aboveThresh && valueForThresh > min ? (colorChangeThreshold - min) / (valueForThresh - min) * 100 : 0;
    }
    const markerLeft = colorChangeThreshold > min && colorChangeThreshold < max ? (colorChangeThreshold - min) / (max - min) * 100 : null;
    return {
      isAboveThreshold: aboveThresh,
      trackSplitPercent: split,
      thresholdMarkerLeft: markerLeft
    };
  }, [value, min, max, colorChangeThreshold]);
  useEffect(() => {
    if (!valueFormat) return;
    const [pos, symbol] = valueFormat;
    const formatSingle = (val) => pos === "left" ? `${symbol}${val}` : `${val}${symbol}`;
    setFormattedValue(
      Array.isArray(value) ? value.map((v) => formatSingle(v)) : formatSingle(value)
    );
  }, [valueFormat, value]);
  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false);
      }, messageTimeout);
      return () => {
        clearTimeout(timer);
      };
    }
    return void 0;
  }, [showInfo, messageTimeout]);
  const handleInputChange = (e, key) => {
    const inputVal = e.target.value;
    if (showInfo) {
      setShowInfo(false);
      setInfoMessage("");
    }
    if (Number.isNaN(Number(inputVal))) {
      setInfoMessage(t("slider.invalidNumber"));
      setShowInfo(true);
      return;
    }
    const num = Number(inputVal);
    if (key === "min") {
      if (num < min) {
        setInfoMessage(t("slider.valueAtLeast", { min }));
        setShowInfo(true);
        return;
      }
      if (isRanged && num > secondaryValue) {
        setInfoMessage(t("slider.initialLessThanMax"));
        setShowInfo(true);
        return;
      }
      onChange == null ? void 0 : onChange(e, isRanged ? [num, secondaryValue] : num, 0);
    } else if (key === "max") {
      if (num > max) {
        setInfoMessage(t("slider.valueNotExceed", { max }));
        setShowInfo(true);
        return;
      }
      if (isRanged && num < primaryValue) {
        setInfoMessage(t("slider.maxGreaterThanInitial"));
        setShowInfo(true);
        return;
      }
      onChange == null ? void 0 : onChange(e, isRanged ? [primaryValue, num] : num, 1);
    } else {
      onChange == null ? void 0 : onChange(e, num);
    }
  };
  const getDisplayValue = (raw, formatted, index) => {
    if (index != null) {
      const isFocused = index === 0 ? focusedInput : rightInputFocused;
      if (!isFocused && valueFormat && Array.isArray(formatted)) return formatted[index];
      return raw;
    }
    if (!focusedInput && valueFormat && typeof formatted === "string") return formatted;
    return raw;
  };
  const layoutClass = ["impact_slider_layout", `input-position-${inputPosition}`, className ?? ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: "slider-container", "data-testid": dataTestId, id, children: [
    /* @__PURE__ */ jsxs("div", { className: layoutClass, children: [
      isRanged && inputPosition === "inline" && /* @__PURE__ */ jsx("div", { className: "input_layout_style ranged ranged-start", children: /* @__PURE__ */ jsx("form", { noValidate: true, autoComplete: "off", children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        OutlinedInput,
        {
          disabled,
          inputProps: {
            "aria-label": t("slider.ariaMin"),
            "data-testid": "slider-input-min"
          },
          value: getDisplayValue(primaryValue, formattedValue, 0),
          onBlur: () => {
            setFocusedInput(null);
          },
          onChange: (e) => {
            handleInputChange(e, isRanged ? "min" : "");
          },
          onFocus: () => {
            setFocusedInput(true);
          }
        }
      ) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "impact_slider_container", children: [
        header != null && /* @__PURE__ */ jsx("div", { className: "impact_slider_layout_heading", children: header }),
        label != null && /* @__PURE__ */ jsxs("label", { className: "impact_slider_labelname", children: [
          label,
          " ",
          required && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `impact_slider_main_container ${disabled ? "impact_slider_disabled" : ""}`,
            children: [
              colorChangeThreshold != null && thresholdMarkerLeft != null && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": true,
                  className: "impact_slider_threshold_marker",
                  style: { left: `${thresholdMarkerLeft}%` }
                }
              ),
              /* @__PURE__ */ jsx(
                Slider$1,
                {
                  ...sliderProps,
                  defaultValue: value,
                  disabled,
                  max,
                  min,
                  sx: isAboveThreshold ? {
                    color: DEFAULT_BELOW_THRESHOLD_COLOR,
                    "& .MuiSlider-track": {
                      background: `linear-gradient(to right, ${DEFAULT_BELOW_THRESHOLD_COLOR} 0%, ${DEFAULT_BELOW_THRESHOLD_COLOR} ${trackSplitPercent}%, ${DEFAULT_ABOVE_THRESHOLD_COLOR} ${trackSplitPercent}%, ${DEFAULT_ABOVE_THRESHOLD_COLOR} 100%)`,
                      border: "none",
                      transition: "none"
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: DEFAULT_BELOW_THRESHOLD_COLOR,
                      zIndex: 2
                    }
                  } : void 0,
                  value,
                  onChange: (_, val, activeThumb) => onChange == null ? void 0 : onChange(_, val, activeThumb),
                  ...isRanged ? {
                    getAriaLabel: (i) => i === 0 ? t("slider.ariaMinimum") : t("slider.ariaMaximum")
                  } : { "aria-label": t("slider.ariaSlider") },
                  valueLabelDisplay: "auto"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: `input_layout_style ${isRanged ? "ranged" : "single"}`, children: /* @__PURE__ */ jsx("form", { noValidate: true, autoComplete: "off", children: /* @__PURE__ */ jsxs(FormControl, { children: [
        (!isRanged || inputPosition === "bottom") && /* @__PURE__ */ jsx(
          OutlinedInput,
          {
            disabled,
            inputProps: {
              "aria-label": isRanged ? t("slider.ariaMin") : t("slider.ariaValue"),
              "data-testid": "slider-input-value"
            },
            value: isRanged ? getDisplayValue(primaryValue, formattedValue, 0) : getDisplayValue(primaryValue, formattedValue),
            onBlur: () => {
              setFocusedInput(null);
            },
            onChange: (e) => {
              handleInputChange(e, isRanged ? "min" : "");
            },
            onFocus: () => {
              setFocusedInput(true);
            }
          }
        ),
        isRanged && /* @__PURE__ */ jsx(
          OutlinedInput,
          {
            disabled,
            inputProps: {
              "aria-label": t("slider.ariaMax"),
              "data-testid": "slider-input-max"
            },
            value: getDisplayValue(secondaryValue, formattedValue, 1),
            onBlur: () => {
              setRightInputFocused(false);
            },
            onChange: (e) => {
              handleInputChange(e, "max");
            },
            onFocus: () => {
              setRightInputFocused(true);
            }
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `slider-info-message ${!showInfo ? "hidden" : ""}`, children: showInfo && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(default_1, { className: "slider-info-icon" }),
      /* @__PURE__ */ jsx("span", { className: "slider-info-text", children: infoMessage })
    ] }) })
  ] });
}
Slider.displayName = "Slider";
export {
  Slider
};
