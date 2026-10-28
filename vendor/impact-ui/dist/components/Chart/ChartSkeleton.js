import { jsx, jsxs } from "react/jsx-runtime";
import { Skeleton } from "../Skeleton/index.js";
const COLUMN_BAR_HEIGHTS = [45, 70, 55, 85, 40, 65, 75, 50, 60, 90];
const BAR_WIDTHS = [92, 78, 88, 64, 72];
const LINE_BAR_WIDTHS = [88, 72, 80, 58];
const LEGEND_WIDTHS = [64, 80, 56];
const getDefaultShimmerDirection = (graphType) => {
  const type = (graphType || "column").toLowerCase();
  if (type === "column" || type === "waterfall" || type === "candlestick" || type === "heatmap" || type === "treemap") {
    return "btt";
  }
  if (type === "bar") {
    return "ltr";
  }
  if (type === "pie" || type === "semidonut" || type === "venn" || type === "bubble" || type === "packedbubble" || type === "scatter" || type === "scatter3d") {
    return "circular";
  }
  return "ltr";
};
const resolveShimmerDirection = (shimmerDirection, graphType) => {
  if (shimmerDirection && shimmerDirection !== "auto") {
    return shimmerDirection;
  }
  return getDefaultShimmerDirection(graphType);
};
const AxisFrame = ({ children, orientation = "column", direction }) => /* @__PURE__ */ jsxs("div", { className: `chart-skeleton-plot chart-skeleton-plot--${orientation}`, children: [
  /* @__PURE__ */ jsx(
    Skeleton,
    {
      borderRadius: 0,
      className: "chart-skeleton-axis chart-skeleton-axis--y",
      direction,
      height: "100%",
      variant: "rectangular",
      width: 2
    }
  ),
  /* @__PURE__ */ jsxs("div", { className: "chart-skeleton-plot-inner", children: [
    /* @__PURE__ */ jsx("div", { className: "chart-skeleton-bars", children }),
    /* @__PURE__ */ jsx(
      Skeleton,
      {
        borderRadius: 0,
        className: "chart-skeleton-axis chart-skeleton-axis--x",
        direction,
        height: 2,
        variant: "rectangular",
        width: "100%"
      }
    )
  ] })
] });
const ColumnSkeleton = ({ direction }) => /* @__PURE__ */ jsx(AxisFrame, { direction, orientation: "column", children: COLUMN_BAR_HEIGHTS.map((height, index) => /* @__PURE__ */ jsx(
  Skeleton,
  {
    borderRadius: 8,
    className: "chart-skeleton-bar chart-skeleton-bar--column",
    direction,
    height: `${height}%`,
    variant: "pill",
    width: "auto"
  },
  `column-bar-${index}`
)) });
const BarSkeleton = ({ direction }) => /* @__PURE__ */ jsx(AxisFrame, { direction, orientation: "bar", children: BAR_WIDTHS.map((width, index) => /* @__PURE__ */ jsx(
  Skeleton,
  {
    className: "chart-skeleton-bar chart-skeleton-bar--bar",
    direction,
    height: 14,
    variant: "pill",
    width: `${width}%`
  },
  `bar-${index}`
)) });
const LineSkeleton = ({ direction }) => /* @__PURE__ */ jsx(AxisFrame, { direction, orientation: "line", children: LINE_BAR_WIDTHS.map((width, index) => /* @__PURE__ */ jsx(
  Skeleton,
  {
    className: "chart-skeleton-bar chart-skeleton-bar--line",
    direction,
    height: 14,
    variant: "pill",
    width: `${width}%`
  },
  `line-bar-${index}`
)) });
const DonutSkeleton = ({
  direction,
  variant = "donut"
}) => {
  const isSemi = variant === "semidonut";
  return /* @__PURE__ */ jsxs("div", { className: "chart-skeleton-plot chart-skeleton-plot--circular", children: [
    /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: `chart-skeleton-donut${isSemi ? " chart-skeleton-donut--semi" : ""}`,
        direction,
        height: isSemi ? 90 : 180,
        variant: "circular",
        width: 180
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "chart-skeleton-legend", children: LEGEND_WIDTHS.map((width, index) => /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: "chart-skeleton-legend-item",
        direction: "ltr",
        height: 10,
        variant: "pill",
        width
      },
      `legend-${index}`
    )) })
  ] });
};
const CircularPlotSkeleton = ({ direction }) => /* @__PURE__ */ jsxs("div", { className: "chart-skeleton-plot chart-skeleton-plot--circular", children: [
  /* @__PURE__ */ jsx(
    Skeleton,
    {
      className: "chart-skeleton-circle",
      direction,
      height: 180,
      variant: "circular",
      width: 180
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "chart-skeleton-legend", children: LEGEND_WIDTHS.map((width, index) => /* @__PURE__ */ jsx(
    Skeleton,
    {
      className: "chart-skeleton-legend-item",
      direction: "ltr",
      height: 10,
      variant: "pill",
      width
    },
    `legend-${index}`
  )) })
] });
const getSkeletonByType = (graphType, direction) => {
  const type = (graphType || "column").toLowerCase();
  if (type === "bar") {
    return /* @__PURE__ */ jsx(BarSkeleton, { direction });
  }
  if (type === "line" || type === "area" || type === "area line") {
    return /* @__PURE__ */ jsx(LineSkeleton, { direction });
  }
  if (type === "pie") {
    return /* @__PURE__ */ jsx(DonutSkeleton, { direction, variant: "donut" });
  }
  if (type === "semidonut") {
    return /* @__PURE__ */ jsx(DonutSkeleton, { direction, variant: "semidonut" });
  }
  if (type === "venn" || type === "bubble" || type === "packedbubble" || type === "scatter" || type === "scatter3d") {
    return /* @__PURE__ */ jsx(CircularPlotSkeleton, { direction });
  }
  return /* @__PURE__ */ jsx(ColumnSkeleton, { direction });
};
function ChartSkeleton({
  graphType = "column",
  height = null,
  shimmerDirection = "auto"
}) {
  const style = height ? { height } : void 0;
  const direction = resolveShimmerDirection(shimmerDirection, graphType);
  return /* @__PURE__ */ jsx("div", { "aria-busy": "true", "aria-live": "polite", className: "chart-skeleton", style, children: getSkeletonByType(graphType, direction) });
}
ChartSkeleton.displayName = "ChartSkeleton";
export {
  ChartSkeleton,
  getDefaultShimmerDirection
};
