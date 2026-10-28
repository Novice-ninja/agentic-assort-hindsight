/**
 * Impact UI's Chart calls `chart.setSize()` from a window `resize` listener without
 * checking that Highcharts has finished creating the instance (or that it still exists
 * after a remount). Scrolling or resizing the Ask Iris panel is enough to fire that
 * path and throw `Cannot read properties of undefined (reading 'chart')` inside
 * `setAnimation`.
 *
 * This patches the shared Highcharts prototype once, so every vendor Chart on the page
 * — Overview widgets included — no-ops instead of crashing.
 */
import Highcharts from 'highcharts/esm/highcharts.js';

type HighchartsNamespace = {
  Chart?: {
    prototype: {
      setSize: (...args: unknown[]) => unknown;
    };
  };
};

type ChartInstance = {
  options?: { chart?: unknown };
  container?: unknown;
};

const namespace = Highcharts as unknown as HighchartsNamespace & {
  default?: HighchartsNamespace;
};

const proto = namespace.Chart?.prototype ?? namespace.default?.Chart?.prototype;
const original = proto?.setSize;

if (proto && typeof original === 'function' && !(original as { __irisGuarded?: boolean }).__irisGuarded) {
  const guardedSetSize = function guardedSetSize(this: ChartInstance, ...args: unknown[]) {
    if (this?.options?.chart === undefined || this.container == null) {
      return this;
    }
    try {
      return original.apply(this, args);
    } catch {
      return this;
    }
  };

  (guardedSetSize as { __irisGuarded?: boolean }).__irisGuarded = true;
  proto.setSize = guardedSetSize;
}
