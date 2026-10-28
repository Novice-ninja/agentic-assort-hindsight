const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${ampm}`;
};
const getDateLabel = (dateString, t, locale) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = /* @__PURE__ */ new Date();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(today.getDate() - 1);
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return t ? t("chatBot.dateSeparator.today") : "Today";
  if (isYesterday) return t ? t("chatBot.dateSeparator.yesterday") : "Yesterday";
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
export {
  formatAMPM,
  getDateLabel
};
