import moment from "moment";
const toLocalMoment = (timestamp) => {
  if (!timestamp) return null;
  const localTime = moment.utc(timestamp).local();
  return localTime.isValid() ? localTime : null;
};
const formatChatHeaderTimestamp = (timestamp) => {
  const localTime = toLocalMoment(timestamp);
  if (!localTime) return "";
  return localTime.format("MMM D, YYYY [at] hh:mm A");
};
export {
  formatChatHeaderTimestamp
};
