import { AG_GRID_LOCALE_DE, AG_GRID_LOCALE_EN } from "@ag-grid-community/locale";
import deDE from "./de-DE.json.js";
import enUS from "./en-US.json.js";
import { getAssetUrl } from "../utils/assetBase.js";
const ourDictionaries = {
  "en-US": enUS,
  "de-DE": deDE
};
const AGLocaleMap = {
  "en-US": AG_GRID_LOCALE_EN,
  "de-DE": AG_GRID_LOCALE_DE
};
const BASE_LOCALE = "en-US";
const LOCALE_REGISTRY = {
  "en-US": {
    label: "English (US) - EN",
    icon: getAssetUrl("icons/flagUS.svg"),
    iconLabel: "EN"
  },
  "de-DE": {
    label: "Deutsch - DE",
    icon: getAssetUrl("icons/flagGermany.svg"),
    iconLabel: "DE"
  }
};
export {
  AGLocaleMap,
  BASE_LOCALE,
  LOCALE_REGISTRY,
  enUS,
  ourDictionaries
};
