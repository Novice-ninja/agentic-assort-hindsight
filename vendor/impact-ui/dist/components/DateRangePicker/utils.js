const rangeSelectorTypes = [
  { id: "custom", value: "custom", label: "Custom" },
  { id: "last7Days", value: "last7Days", label: "Last 7 Days" },
  { id: "week", value: "week", label: "Week" },
  { id: "month", value: "month", label: "Month" },
  { id: "quarter", value: "quarter", label: "Quarter" },
  { id: "year", value: "year", label: "Year" }
];
const getRangeSelectorTypes = (t) => [
  { id: "custom", value: "custom", label: t("dateRangePicker.rangeCustom") },
  {
    id: "last7Days",
    value: "last7Days",
    label: t("dateRangePicker.rangeLast7Days")
  },
  { id: "week", value: "week", label: t("dateRangePicker.rangeWeek") },
  { id: "month", value: "month", label: t("dateRangePicker.rangeMonth") },
  { id: "quarter", value: "quarter", label: t("dateRangePicker.rangeQuarter") },
  { id: "year", value: "year", label: t("dateRangePicker.rangeYear") }
];
const setStartDateOffset = (selectedRange, day) => {
  switch (selectedRange) {
    case "last7Days":
      return day.subtract(7, "days");
    case "week":
      return day.startOf("week");
    case "month":
      return day.startOf("month");
    case "quarter":
      return day.startOf("quarter");
    case "year":
      return day.startOf("year");
  }
};
const setEndDateOffset = (selectedRange, day) => {
  switch (selectedRange) {
    case "last7Days":
      return day.subtract(0, "days");
    case "week":
      return day.endOf("week");
    case "month":
      return day.endOf("month");
    case "quarter":
      return day.endOf("quarter");
    case "year":
      return day.endOf("year");
  }
};
const calculatePosition = ({ containerRef, setCustomPosition, showRangeSelector }) => {
  var _a;
  const containerPos = (_a = containerRef == null ? void 0 : containerRef.current) == null ? void 0 : _a.getBoundingClientRect();
  if (!containerPos) return;
  const { x } = containerPos;
  const innerWidth = window.innerWidth;
  const threshold = showRangeSelector ? 550 : 450;
  const availableSpace = innerWidth - x - 20;
  if (availableSpace < threshold) {
    setCustomPosition({
      left: "auto",
      right: 0
    });
  }
};
const formatMomentDate = (date, dateFormat = "YYYY-MM-DD") => {
  return date == null ? void 0 : date.format(dateFormat);
};
const DAY_KEY_FORMAT = "YYYY-MM-DD";
const MAX_FISCAL_WEEK_DAYS = 31;
const extendPeriod = (periods, id, startKey, endKey) => {
  if (!Number.isFinite(id)) return;
  const period = periods.get(id);
  if (!period) {
    periods.set(id, { start: startKey, end: endKey });
    return;
  }
  if (startKey < period.start) period.start = startKey;
  if (endKey > period.end) period.end = endKey;
};
const buildFiscalDayLookup = (moment, data) => {
  if (!moment || !Array.isArray(data) || data.length === 0) return null;
  const days = /* @__PURE__ */ new Map();
  const periods = { month: /* @__PURE__ */ new Map(), quarter: /* @__PURE__ */ new Map(), year: /* @__PURE__ */ new Map() };
  data.forEach((record) => {
    const begin = record == null ? void 0 : record.fiscal_week_begin_date;
    const end = record == null ? void 0 : record.fiscal_week_end_date;
    if (!Number.isFinite(begin) || !Number.isFinite(end) || end < begin) return;
    const firstDay = moment.utc(begin).startOf("day");
    const lastDay = moment.utc(end).startOf("day");
    if (lastDay.diff(firstDay, "days") >= MAX_FISCAL_WEEK_DAYS) return;
    const week = {
      start: firstDay.format(DAY_KEY_FORMAT),
      end: lastDay.format(DAY_KEY_FORMAT)
    };
    for (const day = firstDay.clone(); !day.isAfter(lastDay); day.add(1, "day")) {
      const key = day.format(DAY_KEY_FORMAT);
      if (!days.has(key)) days.set(key, { record, week });
    }
    extendPeriod(periods.month, record.fiscal_year_month, week.start, week.end);
    extendPeriod(periods.quarter, record.fiscal_year_quarter, week.start, week.end);
    if (Number.isFinite(record.fiscal_year_week)) {
      extendPeriod(periods.year, Math.floor(record.fiscal_year_week / 100), week.start, week.end);
    }
  });
  return days.size ? { days, periods } : null;
};
const getFiscalDayEntry = (lookup, day) => lookup && day ? lookup.days.get(day.format(DAY_KEY_FORMAT)) : void 0;
const getFiscalRecord = (lookup, day) => {
  var _a;
  return (_a = getFiscalDayEntry(lookup, day)) == null ? void 0 : _a.record;
};
const getFiscalWeekLabel = (record) => Number.isFinite(record == null ? void 0 : record.fiscal_year_week) ? record.fiscal_year_week % 100 : void 0;
const getFiscalRange = (lookup, selectedRange, day) => {
  const entry = getFiscalDayEntry(lookup, day);
  if (!entry) return null;
  const { record, week } = entry;
  switch (selectedRange) {
    case "week":
      return week;
    case "month":
      return lookup.periods.month.get(record.fiscal_year_month) || null;
    case "quarter":
      return lookup.periods.quarter.get(record.fiscal_year_quarter) || null;
    case "year":
      return Number.isFinite(record.fiscal_year_week) ? lookup.periods.year.get(Math.floor(record.fiscal_year_week / 100)) || null : null;
    default:
      return null;
  }
};
const getFiscalStartDateOffset = (lookup, moment, selectedRange, day) => {
  const range = getFiscalRange(lookup, selectedRange, day);
  return range ? moment(range.start, DAY_KEY_FORMAT) : setStartDateOffset(selectedRange, day);
};
const getFiscalEndDateOffset = (lookup, moment, selectedRange, day) => {
  const range = getFiscalRange(lookup, selectedRange, day);
  return range ? moment(range.end, DAY_KEY_FORMAT).endOf("day") : setEndDateOffset(selectedRange, day);
};
const getCalendarPanelYearMonth = (day, isOutsideDay) => {
  if (!day) return null;
  if (!isOutsideDay) {
    return day.year() * 100 + (day.month() + 1);
  }
  if (day.date() > 15) {
    const next = day.clone().add(1, "month");
    return next.year() * 100 + (next.month() + 1);
  }
  const prev = day.clone().subtract(1, "month");
  return prev.year() * 100 + (prev.month() + 1);
};
const isDayInFiscalPanel = (lookup, day, isOutsideDay) => {
  if (!day) return false;
  const panelYearMonth = getCalendarPanelYearMonth(day, isOutsideDay);
  const record = getFiscalRecord(lookup, day);
  if (!record || !Number.isFinite(record.fiscal_year_month)) {
    return !isOutsideDay;
  }
  return record.fiscal_year_month === panelYearMonth;
};
export {
  buildFiscalDayLookup,
  calculatePosition,
  formatMomentDate,
  getFiscalEndDateOffset,
  getFiscalRecord,
  getFiscalStartDateOffset,
  getFiscalWeekLabel,
  getRangeSelectorTypes,
  isDayInFiscalPanel,
  rangeSelectorTypes,
  setEndDateOffset,
  setStartDateOffset
};
