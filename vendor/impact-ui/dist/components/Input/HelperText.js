import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import useFormControl from "../../node_modules/@mui/material/FormControl/useFormControl.js";
import FormHelperText from "../../node_modules/@mui/material/FormHelperText/FormHelperText.js";
function HelperText({ helper, focusedText }) {
  const formControlContext = useFormControl();
  const focused = (formControlContext == null ? void 0 : formControlContext.focused) ?? false;
  const helperText = useMemo(() => {
    if (focused && focusedText) {
      return focusedText;
    }
    return helper;
  }, [focused, focusedText, helper]);
  return /* @__PURE__ */ jsx(FormHelperText, { children: helperText });
}
export {
  HelperText as default
};
