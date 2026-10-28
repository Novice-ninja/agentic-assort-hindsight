function toInnerHTML(content) {
  if (content == null) {
    return { __html: "" };
  }
  if (typeof content === "string") {
    return { __html: content };
  }
  try {
    if (typeof Element !== "undefined" && content instanceof Element) {
      return { __html: content.innerHTML };
    }
    if (typeof Node !== "undefined" && content instanceof Node) {
      const div = document.createElement("div");
      div.appendChild(content.cloneNode(true));
      return { __html: div.innerHTML };
    }
  } catch {
  }
  try {
    return { __html: String(content) };
  } catch {
    return { __html: "" };
  }
}
export {
  toInnerHTML
};
