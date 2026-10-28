const DEFAULT_AVATAR_COLORS = [
  "#B28B63",
  "#977CC1",
  "#658EC4",
  "#8C906A",
  "#7A8294",
  "#DB8229",
  "#917A69",
  "#82637B",
  "#BF9F22",
  "#48ACB2"
];
function hashString(input) {
  const str = String(input ?? "").toLowerCase().trim();
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
  }
  hash = hash + (hash << 13) >>> 0;
  hash ^= hash >>> 7;
  hash = hash + (hash << 3) >>> 0;
  hash ^= hash >>> 17;
  hash = hash + (hash << 5) >>> 0;
  return hash >>> 0;
}
function getUserAvatarColor(userKey, palette = DEFAULT_AVATAR_COLORS) {
  const colors = Array.isArray(palette) && palette.length > 0 ? palette : DEFAULT_AVATAR_COLORS;
  if (!userKey) {
    return colors[0];
  }
  const idx = hashString(userKey) % colors.length;
  return colors[idx];
}
export {
  DEFAULT_AVATAR_COLORS,
  getUserAvatarColor
};
