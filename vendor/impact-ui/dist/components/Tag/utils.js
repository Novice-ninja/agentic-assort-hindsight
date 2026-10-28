const getSize = (size) => {
  switch (size) {
    case "large":
      return "impact-tag-large";
    case "medium":
      return "impact-tag-medium";
    case "small":
      return "impact-tag-small";
    default:
      return "impact-tag-large";
  }
};
export {
  getSize
};
