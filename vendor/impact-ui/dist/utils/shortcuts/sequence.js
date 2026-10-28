import { matchShortcut } from "./match.js";
class SequenceTracker {
  constructor(timeout = 1e3) {
    this._progress = /* @__PURE__ */ new Map();
    this._timer = null;
    this._timeout = timeout;
  }
  advance(event, entries) {
    this._clearTimer();
    let matched = null;
    let anyActive = false;
    for (const entry of entries) {
      const step = this._progress.get(entry.id) ?? 0;
      const combo = entry.steps[step];
      if (!combo) {
        this._progress.delete(entry.id);
        continue;
      }
      if (matchShortcut(event, combo)) {
        const nextStep = step + 1;
        if (nextStep >= entry.steps.length) {
          matched = entry;
          this._progress.delete(entry.id);
        } else {
          this._progress.set(entry.id, nextStep);
          anyActive = true;
        }
      } else {
        this._progress.delete(entry.id);
      }
    }
    if (matched) {
      this.reset();
      return matched;
    }
    if (anyActive) {
      this._startTimer();
    }
    return null;
  }
  reset() {
    this._progress.clear();
    this._clearTimer();
  }
  get hasActiveSequences() {
    return this._progress.size > 0;
  }
  _startTimer() {
    this._timer = setTimeout(() => {
      this.reset();
    }, this._timeout);
  }
  _clearTimer() {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
export {
  SequenceTracker
};
