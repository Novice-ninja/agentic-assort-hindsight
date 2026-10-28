!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".chart-container{background:#fff;border-radius:8px;display:flex;flex-direction:column;gap:24px;height:100%;padding:12px 12px 0;position:relative;transform-origin:center center;transition:all .25s ease}.chart-container.above-chart-component{gap:16px}.chart-container.card-container{box-shadow:0 0 4px #0000001f}.chart-container.fullscreen-animating{animation:expandAnim .2s ease forwards}.chart-container.fullscreen-animating-out{animation:collapseAnim .2s ease forwards}.chart-container.expanded{padding:24px}.chart-container .chart-container-header{align-items:center;display:flex;justify-content:space-between}.chart-container .chart-container-header .chart-container-header-title{align-items:center;display:flex;gap:6px}.chart-container .chart-container-header .chart-container-header-title .chart-container-header-title-text{color:#0d152c;font-size:16px;font-style:normal;font-weight:600;line-height:24px}.chart-container .chart-container-header .chart-container-header-actions{align-items:center;display:flex;flex-wrap:wrap;gap:12px}.chart-container .divider-line{background:#d9dde7;height:16px;width:1px}.chart-custom-actions{align-items:center;display:flex;gap:12px}.highcharts-xaxis-labels text,.highcharts-yaxis-labels text{color:#60697d!important;font-family:Manrope,sans-serif;font-size:12px!important;font-weight:500}.highcharts-xaxis .highcharts-axis-title,.highcharts-yaxis .highcharts-axis-title{color:#60697d!important;font-family:Manrope,sans-serif;font-size:14px!important;font-style:normal;font-weight:500;line-height:20px}.tooltip-key{font-size:12px;font-weight:500;line-height:16px}.tooltip-value{font-size:14px;font-weight:600;line-height:24px}.highcharts-text-outline{stroke-width:0px}.chart-empty-state{align-items:center;display:flex;flex-direction:column;gap:8px;height:100%;justify-content:center}.chart-empty-state span{color:#7a8294;font-size:16px;font-weight:600;line-height:24px;text-align:center}.chart-skeleton{box-sizing:border-box;display:flex;flex-direction:column;height:300px;min-height:160px;padding:8px 4px 16px;width:100%}.chart-skeleton .chart-skeleton-plot{display:flex;flex:1;height:100%;min-height:0;width:100%}.chart-skeleton .chart-skeleton-plot-inner{display:flex;flex:1;flex-direction:column;gap:4px;min-height:0;min-width:0}.chart-skeleton .chart-skeleton-axis{flex-shrink:0}.chart-skeleton .chart-skeleton-axis--y{align-self:stretch;height:100%;width:2px}.chart-skeleton .chart-skeleton-axis--x{height:2px;width:100%}.chart-skeleton .chart-skeleton-bars{display:flex;flex:1;min-height:0;min-width:0}.chart-skeleton .chart-skeleton-bar{border-radius:999px}.chart-skeleton .chart-skeleton-legend-item{border-radius:999px;height:10px}.chart-skeleton .chart-skeleton-plot--column{align-items:stretch;flex-direction:row;gap:8px}.chart-skeleton .chart-skeleton-plot--column .chart-skeleton-bars{align-items:flex-end;flex-direction:row;gap:8px;justify-content:space-around;padding:0 8px 0 4px}.chart-skeleton .chart-skeleton-plot--column .chart-skeleton-bar--column{flex:1;max-width:36px;min-width:12px}.chart-skeleton .chart-skeleton-plot--bar{align-items:stretch;flex-direction:row;gap:8px}.chart-skeleton .chart-skeleton-plot--bar .chart-skeleton-bars{flex-direction:column;gap:10px;justify-content:space-around;padding:4px 0 0 4px}.chart-skeleton .chart-skeleton-plot--bar .chart-skeleton-bar--bar{border-radius:999px;height:14px;max-width:100%;min-width:40px}.chart-skeleton .chart-skeleton-plot--line{align-items:stretch;flex-direction:row;gap:8px}.chart-skeleton .chart-skeleton-plot--line .chart-skeleton-bars{flex-direction:column;gap:18px;justify-content:space-evenly;padding:12px 8px 8px 4px}.chart-skeleton .chart-skeleton-plot--line .chart-skeleton-bar--line{align-self:flex-start;border-radius:999px;height:14px;max-width:100%;min-width:48px}.chart-skeleton .chart-skeleton-plot--circular{align-items:center;flex-direction:column;gap:20px;justify-content:center}.chart-skeleton .chart-skeleton-plot--circular .chart-skeleton-circle{border-radius:50%;flex-shrink:0;height:180px;width:180px}.chart-skeleton .chart-skeleton-plot--circular .chart-skeleton-donut{border-radius:50%;flex-shrink:0;height:180px;-webkit-mask-image:radial-gradient(farthest-side,#0000 calc(58% - .5px),#000 calc(58% + .5px));mask-image:radial-gradient(farthest-side,#0000 calc(58% - .5px),#000 calc(58% + .5px));width:180px}.chart-skeleton .chart-skeleton-plot--circular .chart-skeleton-donut--semi{border-radius:180px 180px 0 0;height:90px;-webkit-mask-image:radial-gradient(farthest-side at 50% 100%,#0000 calc(58% - .5px),#000 calc(58% + .5px));mask-image:radial-gradient(farthest-side at 50% 100%,#0000 calc(58% - .5px),#000 calc(58% + .5px))}.chart-skeleton .chart-skeleton-plot--circular .chart-skeleton-legend{align-items:center;display:flex;flex-wrap:wrap;gap:12px;justify-content:center}@keyframes expandAnim{0%{opacity:.6;transform:scale(.98)}to{opacity:1;transform:scale(1)}}@keyframes collapseAnim{0%{opacity:1;transform:scale(1)}to{opacity:.6;transform:scale(.98)}}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import React__default, { useState, useRef, useEffect, useMemo } from "react";
import Highcharts from "highcharts/esm/highcharts.js";
import "highcharts/esm/highcharts-3d.js";
import "highcharts/esm/highcharts-more.js";
import "highcharts/esm/modules/heatmap.js";
import "highcharts/esm/modules/stock.js";
import "highcharts/esm/modules/venn.js";
import "highcharts/esm/modules/treemap.js";
import "highcharts/esm/modules/exporting.js";
import "highcharts/esm/modules/export-data.js";
import "highcharts/esm/modules/offline-exporting.js";
import { ChartDropdown as ChartDropdown_default, CollapseNew as CollapseNew_default, ExpandIcon as ExpandIcon_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import default_1 from "../../node_modules/@mui/icons-material/TableChartOutlined.js";
import * as borderRadiusModule from "highcharts-border-radius";
import * as highchartsReactModule from "highcharts-react-official";
import { getAssetUrl } from "../../utils/assetBase.js";

import { Button } from "../Button/index.js";
import { Menu } from "../Menu/index.js";
import { Tooltip } from "../Tooltip/index.js";
import default_1$1 from "../../node_modules/@mui/icons-material/FileDownloadOutlined.js";
import { ChartSkeleton } from "./ChartSkeleton.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const EmptyStateImage = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/emptyStateImage.svg"), ...props });
const interopDefault = (mod) => {
  let value = mod;
  while (value && typeof value === "object" && !value.$$typeof && value.default) {
    value = value.default;
  }
  return value;
};
const HighchartsReact = interopDefault(highchartsReactModule);
const borderRadius = interopDefault(borderRadiusModule);
if (typeof Highcharts === "object" && typeof borderRadius === "function") {
  borderRadius(Highcharts);
}
const Chart = ({
  graphType = "column",
  xAxisCategories,
  xAxisTitle,
  yAxisTitle,
  seriesData,
  graphTitle,
  stackedColumn = false,
  is3D = false,
  showSubTitle = false,
  onChartDownload = () => {
  },
  fallbackContent = null,
  topRightOptions = null,
  showSwitchButton = false,
  showChartTypeDropdown = false,
  showDownloadButton = true,
  chartTypesOptions = [],
  selectedChart,
  chartMenuProps,
  showScrollX = false,
  topLeftOptions = null,
  cardContainer = true,
  subtitleText = "",
  legendXPosition = null,
  legendYPosition = null,
  xAxisTitlePositionY = null,
  customTooltipFormatter = null,
  sharedTooltip = false,
  showchart = true,
  setShowChart = () => {
  },
  plotOptionsEvents,
  customSystemButton = null,
  handleChartExpand = () => {
  },
  chartMarginBottom = 150,
  showHeader = true,
  height = null,
  width = null,
  showExpandButton = true,
  showDownloadMenu = true,
  showBuiltInDownloadOptions = true,
  downloadMenuOptions = [],
  customLegend = null,
  customLegendStyle = null,
  yAxisTitleRight,
  chartOptions = {},
  titleOptions = {},
  xAxisOptions = {},
  yAxisOptions = {},
  yAxisLeftOptions = {},
  yAxisRightOptions = {},
  zAxisOptions = {},
  tooltipOptions = {},
  plotOptionsOptions = {},
  subtitleOptions = {},
  creditsOptions = {},
  legendOptions = {},
  colorAxisOptions = {},
  seriesOptions = null,
  additionalOptions = {},
  hoveredXAxisIndex = null,
  exportingOptions = {},
  aboveChartComponent = null,
  isEmpty = false,
  isLoading = false,
  shimmerDirection = "auto",
  topSubHeader = null
}) => {
  var _a;
  const { t } = useTranslation();
  const resolvedXAxisTitle = xAxisTitle ?? t("chart.xAxisTitle");
  const resolvedYAxisTitle = yAxisTitle ?? t("chart.yAxisTitle");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showChartList, setShowChartList] = useState(false);
  const [selectMenuAnchor, setSelectMenuAnchor] = useState(null);
  const [showDownloadList, setShowDownloadList] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const chartComponentRef = useRef(null);
  const containerRef = useRef(null);
  const getBuiltInDownloadOptions = () => {
    var _a2, _b;
    const chart = (_a2 = chartComponentRef.current) == null ? void 0 : _a2.chart;
    if (!chart) return [];
    const globalExporting = Highcharts.getOptions().exporting || {};
    const instanceExporting = ((_b = chart.options) == null ? void 0 : _b.exporting) || {};
    const menuItemDefs = {
      ...globalExporting.menuItemDefinitions || {},
      ...instanceExporting.menuItemDefinitions || {}
    };
    const formatKey = (str) => {
      const withSpaces = str.replace(/([a-z])([A-Z])/g, "$1 $2");
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    };
    return Object.keys(menuItemDefs).filter(
      (item) => typeof item === "string" && item !== "separator" && item !== "viewFullscreen" && (item.startsWith("download") || item === "printChart")
    ).map((item) => {
      var _a3;
      return {
        label: ((_a3 = menuItemDefs[item]) == null ? void 0 : _a3.text) || formatKey(item),
        value: item,
        onClick: () => {
          if (typeof menuItemDefs[item].onclick === "function") {
            menuItemDefs[item].onclick.call(chart);
          }
          setShowDownloadList(false);
        }
      };
    });
  };
  const enterFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;
    setIsAnimating(true);
    elem.classList.add("fullscreen-animating");
    setTimeout(() => {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      setIsExpanded(true);
      handleChartExpand(true);
      elem.classList.remove("fullscreen-animating");
    }, 200);
  };
  const exitFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;
    setIsAnimating(true);
    elem.classList.add("fullscreen-animating-out");
    setTimeout(() => {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsExpanded(false);
      handleChartExpand(false);
      elem.classList.remove("fullscreen-animating-out");
    }, 200);
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if (!fs) {
        setIsExpanded(false);
        handleChartExpand(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);
  useEffect(() => {
    if (!chartComponentRef.current) return;
    const chart = chartComponentRef.current.chart;
    const updateSize = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      chart.setSize(
        windowWidth < 768 ? windowWidth - 40 : null,
        isExpanded ? windowHeight - 98 : "auto",
        false
      );
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [isExpanded]);
  useEffect(() => {
    if (!chartComponentRef.current) return;
    const chart = chartComponentRef.current.chart;
    if (!chart) return;
    if (hoveredXAxisIndex !== null && hoveredXAxisIndex !== void 0) {
      const points = chart.series.reduce((acc, series) => {
        var _a2;
        const point = (_a2 = series.points) == null ? void 0 : _a2[hoveredXAxisIndex];
        if (point) acc.push(point);
        return acc;
      }, []);
      if (points.length > 0) {
        chart.tooltip.refresh(sharedTooltip ? points : points[0]);
        chart.xAxis[0].drawCrosshair(null, points[0]);
      }
    } else {
      chart.tooltip.hide();
      chart.xAxis[0].hideCrosshair();
    }
  }, [hoveredXAxisIndex, sharedTooltip]);
  function safeStringify(value, fallback) {
    try {
      if (!value) return fallback;
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  const graphData = useMemo(
    () => ({
      chart: {
        type: graphType,
        scrollablePlotArea: {
          minWidth: showScrollX ? (xAxisCategories == null ? void 0 : xAxisCategories.length) * 80 : void 0,
          opacity: 1,
          scrollPositionX: 0
        },
        marginBottom: chartMarginBottom,
        width,
        style: { fontFamily: "Manrope, sans-serif" },
        height: isExpanded ? window.innerHeight - 108 : height || "auto",
        options3d: is3D ? {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 550,
          viewDistance: 10
        } : void 0,
        ...chartOptions || {}
      },
      title: {
        text: null,
        // remove title
        ...titleOptions || {}
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: false
          }
        },
        ...exportingOptions || {}
      },
      xAxis: {
        categories: xAxisCategories,
        crosshair: true,
        lineColor: "#D9DDE7",
        title: {
          text: resolvedXAxisTitle,
          align: "middle",
          reserveSpace: true,
          y: xAxisTitlePositionY ? xAxisTitlePositionY : showScrollX ? graphType === "scatter3d" ? 130 : 40 : 3
        },
        labels: {
          autoRotation: [-45, -60],
          // Highcharts will choose best rotation automatically
          rotation: void 0,
          style: {
            whiteSpace: "nowrap"
          }
        },
        ...xAxisOptions || {}
      },
      yAxis: [
        {
          // Left axis
          title: {
            text: resolvedYAxisTitle,
            x: -12,
            align: "middle",
            margin: 16
          },
          lineWidth: 1,
          lineColor: "#D9DDE7",
          gridLineDashStyle: "Dash",
          gridLineWidth: 1,
          gridLineColor: "#D9DDE7",
          labels: {},
          opposite: false,
          ...yAxisOptions || {},
          ...yAxisLeftOptions || {}
        },
        ...yAxisTitleRight ? [
          {
            title: {
              text: yAxisTitleRight,
              x: 12,
              align: "middle",
              margin: 16
            },
            lineWidth: 1,
            lineColor: "#D9DDE7",
            gridLineDashStyle: "Dash",
            gridLineWidth: 1,
            gridLineColor: "#D9DDE7",
            labels: {},
            opposite: true,
            ...yAxisOptions || {},
            ...yAxisRightOptions || {}
          }
        ] : []
      ],
      zAxis: is3D ? {
        min: 0,
        max: 10,
        ...zAxisOptions || {}
      } : zAxisOptions && Object.keys(zAxisOptions).length ? zAxisOptions : void 0,
      tooltip: {
        useHTML: true,
        className: "custom-tooltip",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 0,
        borderColor: "transparent",
        outside: false,
        shared: sharedTooltip,
        shadow: {
          color: "rgba(0, 0, 0, 0.2)",
          offsetX: 2,
          offsetY: 2,
          opacity: 0.3
        },
        style: {
          fontFamily: "'Manrope', sans-serif",
          color: "#1F2B4D"
        },
        positioner(labelWidth, labelHeight, point) {
          const chart = this.chart;
          const left = chart.plotLeft;
          const right = chart.plotLeft + chart.plotWidth;
          const top = chart.plotTop;
          const bottom = chart.plotTop + chart.plotHeight;
          let x = point.plotX + left - labelWidth / 2;
          let y = point.plotY + top - labelHeight - 10;
          if (x < left) {
            x = left + 5;
          }
          if (y < top) {
            y = top + 5;
          }
          if (x + labelWidth > right) {
            x = right - labelWidth - 5;
          }
          if (y + labelHeight > bottom) {
            y = bottom - labelHeight - 5;
          }
          return { x, y };
        },
        formatter: function() {
          if (customTooltipFormatter) {
            return customTooltipFormatter(this);
          } else if (this.point.value !== void 0) {
            return `
            <span class="tooltip-key">${t("chart.tooltipX")} ${this.point.x} ${t("chart.tooltipY")} ${this.point.y}</span><br/>
            <b class="tooltip-value">${t("chart.tooltipValue")} ${this.point.value}</b>`;
          } else {
            return `
            <span style="color:${this.color};"">●</span>
            <span class="tooltip-key">${this.key}: </span>
            <b class="tooltip-value">${this.y.toLocaleString()}</b>
          `;
          }
        },
        ...tooltipOptions || {}
      },
      plotOptions: {
        scatter3d: {
          width: 10,
          height: 10,
          depth: 10,
          marker: { radius: 4, symbol: "circle" }
        },
        column: {
          pointPadding: 0.2,
          groupPadding: 0.1,
          borderWidth: 0,
          borderRadius: 8,
          stacking: stackedColumn ? "normal" : null
        },
        areaspline: { fillOpacity: 0.25 },
        heatmap: { borderWidth: 1, borderColor: "#ffffff" },
        series: {
          states: { hover: { backgroundColor: null } },
          ...plotOptionsEvents
        },
        pie: {
          // Semi-donut chart customization
          startAngle: graphType === "semidonut" ? -90 : 0,
          endAngle: graphType === "semidonut" ? 90 : 360,
          center: ["50%", graphType === "semidonut" ? "75%" : "50%"],
          size: "100%",
          innerSize: "70%",
          borderRadius: 6,
          dataLabels: { enabled: true, distance: 20 }
        },
        bar: {
          stacking: "normal",
          pointWidth: 25,
          borderRadius: 5
        },
        ...plotOptionsOptions || {}
      },
      subtitle: showSubTitle ? {
        text: subtitleText,
        verticalAlign: "middle",
        floating: true,
        y: -10,
        style: { fontSize: "24px", fontWeight: "500", color: "#1F2B4D" },
        ...subtitleOptions || {}
      } : subtitleOptions && Object.keys(subtitleOptions).length ? subtitleOptions : void 0,
      credits: { enabled: false, ...creditsOptions || {} },
      legend: {
        enabled: !customLegend,
        symbolRadius: 2,
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
        itemDistance: 24,
        symbolPadding: 6,
        margin: 40,
        x: legendXPosition,
        y: legendYPosition,
        itemStyle: {
          color: "#60697D",
          fontFamily: "Manrope, sans-serif",
          fontSize: "12px",
          fontWeight: "500",
          lineHeight: "16px",
          padding: "20px"
        },
        itemHoverStyle: {
          color: "#0d152c"
        },
        navigation: {
          activeColor: "#3E576F",
          animation: true,
          arrowSize: 12
        },
        ...legendOptions || {}
      },
      series: seriesOptions ?? seriesData,
      colorAxis: graphType === "heatmap" || graphType === "bubble" || graphType === "packedbubble" || graphType === "treemap" ? {
        minColor: "#ffffff",
        maxColor: "#658EC4",
        ...colorAxisOptions || {}
      } : colorAxisOptions && Object.keys(colorAxisOptions).length ? colorAxisOptions : void 0,
      ...additionalOptions || {}
    }),
    [
      graphType,
      xAxisCategories,
      resolvedXAxisTitle,
      resolvedYAxisTitle,
      t,
      seriesData,
      stackedColumn,
      is3D,
      isExpanded,
      showScrollX,
      height,
      width,
      customLegend,
      titleOptions,
      xAxisOptions,
      yAxisOptions,
      yAxisLeftOptions,
      yAxisRightOptions,
      zAxisOptions,
      tooltipOptions,
      plotOptionsOptions,
      subtitleOptions,
      creditsOptions,
      legendOptions,
      colorAxisOptions,
      seriesOptions,
      additionalOptions
    ]
  );
  return /* @__PURE__ */ jsx(Fragment, { children: showchart ? /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `chart-container ${isExpanded ? "expanded" : ""} ${isAnimating ? "animating" : ""} ${cardContainer ? "card-container" : ""} ${aboveChartComponent ? "above-chart-component" : ""}`,
      style: width ? { width } : {},
      children: [
        showHeader && /* @__PURE__ */ jsxs("div", { className: "chart-container-header", children: [
          /* @__PURE__ */ jsxs("div", { className: "chart-container-header-title", children: [
            /* @__PURE__ */ jsx("span", { className: "chart-container-header-title-text", children: graphTitle }),
            !!topLeftOptions && topLeftOptions !== null && /* @__PURE__ */ jsx("div", { className: "divider-line" }),
            topLeftOptions && topLeftOptions
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "chart-container-header-actions", children: [
            topRightOptions && /* @__PURE__ */ jsx("div", { className: "chart-custom-actions", children: React__default.isValidElement(topRightOptions) ? topRightOptions : null }),
            !!topRightOptions && topRightOptions !== null && /* @__PURE__ */ jsx("div", { className: "divider-line" }),
            showSwitchButton && !isExpanded && /* @__PURE__ */ jsx(Tooltip, { title: t("chart.switchToTable"), variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: /* @__PURE__ */ jsx(default_1, {}),
                variant: "text",
                onClick: () => {
                  setShowChart(!showchart);
                }
              }
            ) }),
            showChartTypeDropdown && /* @__PURE__ */ jsx(Tooltip, { title: t("chart.changeType"), variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: /* @__PURE__ */ jsx(ChartDropdown_default, {}),
                variant: "text",
                onClick: (event) => {
                  setShowChartList((prev) => !prev);
                  setSelectMenuAnchor(event.currentTarget);
                }
              }
            ) }),
            showDownloadButton && /* @__PURE__ */ jsx(Tooltip, { title: t("chart.download"), variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: /* @__PURE__ */ jsx(default_1$1, {}),
                variant: "text",
                onClick: (event) => {
                  if (showDownloadMenu) {
                    setShowDownloadList((prev) => !prev);
                    setDownloadMenuAnchor(event.currentTarget);
                  } else {
                    onChartDownload(event);
                  }
                }
              }
            ) }),
            customSystemButton && customSystemButton,
            showExpandButton && /* @__PURE__ */ jsx(Tooltip, { title: t("chart.expand"), variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: isExpanded ? /* @__PURE__ */ jsx(CollapseNew_default, {}) : /* @__PURE__ */ jsx(ExpandIcon_default, {}),
                variant: "text",
                onClick: () => {
                  if (isExpanded) exitFullscreen();
                  else enterFullscreen();
                }
              }
            ) })
          ] })
        ] }),
        aboveChartComponent && aboveChartComponent,
        /* @__PURE__ */ jsx(
          Menu,
          {
            anchorEl: selectMenuAnchor,
            iconPlacement: "left",
            MenuProps: {
              transformOrigin: { vertical: "top", horizontal: "right" },
              anchorOrigin: { vertical: "bottom", horizontal: "right" }
            },
            open: showChartList,
            options: chartTypesOptions,
            selected: selectedChart,
            onClose: () => {
              setShowChartList(false);
            },
            ...chartMenuProps
          }
        ),
        showDownloadMenu && /* @__PURE__ */ jsx(
          Menu,
          {
            anchorEl: downloadMenuAnchor,
            iconPlacement: "left",
            MenuProps: {
              transformOrigin: { vertical: "top", horizontal: "right" },
              anchorOrigin: { vertical: "bottom", horizontal: "right" }
            },
            open: showDownloadList,
            options: [
              ...showBuiltInDownloadOptions ? getBuiltInDownloadOptions() : [],
              ...downloadMenuOptions
            ],
            onClose: () => {
              setShowDownloadList(false);
            }
          }
        ),
        topSubHeader && topSubHeader,
        isLoading ? /* @__PURE__ */ jsx(
          ChartSkeleton,
          {
            graphType,
            height,
            shimmerDirection
          }
        ) : isEmpty ? /* @__PURE__ */ jsxs("div", { className: "chart-empty-state", children: [
          /* @__PURE__ */ jsx(EmptyStateImage, {}),
          /* @__PURE__ */ jsx("span", { children: t("table.noData") })
        ] }) : /* @__PURE__ */ jsx(
          HighchartsReact,
          {
            ref: chartComponentRef,
            highcharts: Highcharts,
            options: graphData
          },
          safeStringify(graphData, "graph") + isExpanded
        ),
        customLegend && /* @__PURE__ */ jsx(
          "div",
          {
            className: "chart-custom-legend",
            style: {
              marginBottom: 12,
              marginTop: -32,
              ...customLegendStyle || {}
            },
            children: React__default.isValidElement(customLegend) ? customLegend : typeof customLegend === "function" ? customLegend((_a = chartComponentRef.current) == null ? void 0 : _a.chart) : null
          }
        )
      ]
    }
  ) : fallbackContent });
};
export {
  Chart
};
