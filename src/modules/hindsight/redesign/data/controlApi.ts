/** Isolated original four-by-four spec controls; never used as the main demo master. */
import * as s from "./selectors";
import * as m from "./session";
import { controlDataset, getControlScenarioDataset } from "./controlFixtures";
import type { Dataset, Scope, Mode } from "./types";
const data = (scope: Scope, d?: Dataset) =>
  d || getControlScenarioDataset(scope.scenario);
export const createDefaultScope = (mode: Mode = "in-season") => ({
  ...s.createDefaultScope(mode, controlDataset),
  stockAsOf: mode === "plr" ? "2026-02-22" : "2026-03-29",
  rangeAsOf: mode === "plr" ? "2026-02-22" : "2026-03-29",
});
export const selectScopedPairs = (scope: Scope, d?: Dataset) =>
  s.selectScopedPairs(scope, data(scope, d));
export const resolveWorkspace = (scope: Scope, d?: Dataset) =>
  s.resolveWorkspace(scope, data(scope, d));
export const getItemRows = (scope: Scope, d?: Dataset) =>
  s.getItemRows(scope, data(scope, d));
export const getStoreRows = (scope: Scope, d?: Dataset) =>
  s.getStoreRows(scope, data(scope, d));
export const getPairFact = (i: string, t: string, scope: Scope, d?: Dataset) =>
  s.getPairFact(i, t, scope, data(scope, d));
export const getMixRows = (scope: Scope, lens: string, d?: Dataset) =>
  s.getMixRows(scope, lens, data(scope, d));
export const getTrend = (
  scope: Scope,
  metric?: "sales" | "quantity" | "gmRate",
  grain?: "week" | "month",
  d?: Dataset,
) => s.getTrend(scope, metric, grain, data(scope, d));
export const getBreadth = (scope: Scope, d?: Dataset) =>
  s.getBreadth(scope, data(scope, d));
export const getPlrReview = (scope: Scope, d?: Dataset) =>
  s.getPlrReview(scope, data(scope, d));
export const coverageWeekIds = (scope: Scope, d?: Dataset) =>
  s.coverageWeekIds(scope, data(scope, d));
export const comparisonWeekIds = (scope: Scope, d?: Dataset) =>
  s.comparisonWeekIds(scope, data(scope, d));
export const scopeSignature = (scope: Scope) =>
  s.scopeSignature(scope, controlDataset);
export const aggregatePairs = s.aggregatePairs;
export const withSession = s.withSession;
export const createInitialSession = () =>
  m.createInitialSession(controlDataset);
export const saveDecisionDraft = (
  state: Parameters<typeof m.saveDecisionDraft>[0],
  input: m.DraftInput,
  now?: string,
  dataset: Dataset = controlDataset,
) => m.saveDecisionDraft(state, input, now, dataset);
export const advanceDecision = m.advanceDecision;
export const saveObservation = m.saveObservation;
export const saveLearning = m.saveLearning;
