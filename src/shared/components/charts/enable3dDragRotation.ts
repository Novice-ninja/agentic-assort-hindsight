/**
 * Drag-to-rotate for a Highcharts 3D chart. Passed as `chart.events.load`.
 * Highcharts stays inside this adapter so modules never import it directly.
 */
import Highcharts from 'highcharts/esm/highcharts.js';

const SENSITIVITY = 5;

type PointerPosition = {
  chartX: number;
  chartY: number;
};

type Unbind = () => void;

type AddEvent = (
  element: object,
  type: string,
  handler: (event: unknown) => void,
) => Unbind | void;

type DragChart = {
  container: object;
  pointer: {
    normalize: (event: unknown) => PointerPosition;
  };
  options: {
    chart?: {
      options3d?: {
        alpha?: number;
        beta?: number;
      };
    };
  };
  update: (
    options: { chart: { options3d: { alpha: number; beta: number } } },
    redraw?: boolean,
    oneToOne?: boolean,
    animation?: boolean,
  ) => void;
};

function asUnbind(unbind: Unbind | void): Unbind | undefined {
  return typeof unbind === 'function' ? unbind : undefined;
}

/**
 * Binds drag rotation using the supplied Highcharts `addEvent`. Exported so tests can
 * pass a fake binder; `enable3dDragRotation` uses the real one.
 */
export function attach3dDragRotation(chart: DragChart, addEvent: AddEvent): void {
  let unbindDrag: Unbind | undefined;

  const dragStart = (eventStart: unknown) => {
    const start = chart.pointer.normalize(eventStart);
    const posX = start.chartX;
    const posY = start.chartY;
    const alpha = chart.options.chart?.options3d?.alpha ?? 0;
    const beta = chart.options.chart?.options3d?.beta ?? 0;
    const handlers: Array<Unbind | undefined> = [];

    const drag = (event: unknown) => {
      const point = chart.pointer.normalize(event);
      chart.update(
        {
          chart: {
            options3d: {
              alpha: alpha + (point.chartY - posY) / SENSITIVITY,
              beta: beta + (posX - point.chartX) / SENSITIVITY,
            },
          },
        },
        undefined,
        undefined,
        false,
      );
    };

    const unbindAll = () => {
      handlers.forEach((unbind) => unbind?.());
      handlers.length = 0;
      unbindDrag = undefined;
    };

    unbindDrag = unbindAll;
    handlers.push(asUnbind(addEvent(document, 'mousemove', drag)));
    handlers.push(asUnbind(addEvent(document, 'touchmove', drag)));
    handlers.push(asUnbind(addEvent(document, 'mouseup', unbindAll)));
    handlers.push(asUnbind(addEvent(document, 'touchend', unbindAll)));
  };

  const containerUnbinders = [
    asUnbind(addEvent(chart.container, 'mousedown', dragStart)),
    asUnbind(addEvent(chart.container, 'touchstart', dragStart)),
  ];

  const unbindContainer = () => {
    unbindDrag?.();
    containerUnbinders.forEach((unbind) => unbind?.());
  };

  asUnbind(addEvent(chart, 'destroy', unbindContainer));
}

/** Highcharts calls this with the chart as `this` once the plot has loaded. */
export function enable3dDragRotation(this: DragChart): void {
  const addEvent = (Highcharts as { addEvent?: AddEvent }).addEvent;
  if (typeof addEvent !== 'function') return;
  attach3dDragRotation(this, addEvent);
}
