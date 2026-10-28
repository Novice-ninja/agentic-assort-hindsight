import { demoDataset } from "./fixtures";
import type {
  ActionType,
  CaseRecord,
  Dataset,
  DecisionRecord,
  Learning,
  Observation,
  SessionState,
  Uom,
  AuthoredProvenance,
} from "./types";
export interface DraftInput extends AuthoredProvenance {
  caseId: string;
  action: ActionType;
  pairIds: string[];
  quantity?: number;
  uom?: Uom;
  reason: string;
  owner: string;
  effectiveDate: string;
  reviewDate: string;
  evidenceIds: string[];
  outgoingItemId?: string;
  incomingItemId?: string;
  destinationStoreId?: string;
  linkedSupplyId?: string;
  linkedDecisionId?: string;
  beforeScope?: string[];
  afterScope?: string[];
}
export interface DecisionActor {
  id: string;
  canApprove?: boolean;
  canExecute?: boolean;
}
export interface DecisionTransition {
  type:
    | "submit"
    | "approve"
    | "await-execution"
    | "execution-ack"
    | "review"
    | "cancel"
    | "supersede";
  note?: string;
  executionRef?: string;
  completedPairIds?: string[];
  failedPairIds?: string[];
}
export interface MutationResult<T> {
  ok: boolean;
  state: SessionState;
  record?: T;
  errors: string[];
}
const nowFor = (data: Dataset) => data.feeds.refreshedAt;
export function createInitialSession(
  dataset: Dataset = demoDataset,
): SessionState {
  return structuredClone({
    cases: dataset.cases,
    decisions: [],
    learnings: dataset.learnings,
    observations: dataset.observations,
  });
}
const failure = <T>(
  state: SessionState,
  errors: string[],
): MutationResult<T> => ({ ok: false, state, errors });
export const dateValid = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(`${value}T00:00:00Z`)) &&
  new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const active = (d: DecisionRecord) =>
  !["Cancelled", "Superseded", "Reviewed"].includes(d.state);
const unique = <T>(a: T[]) => [...new Set(a)];
function draftErrors(
  state: SessionState,
  input: DraftInput,
  data: Dataset,
  excludeId?: string,
): string[] {
  const errors: string[] = [],
    pairs = unique(input.pairIds),
    productIds = new Set(data.products.map((p) => p.id)),
    storeIds = new Set(data.stores.map((s) => s.id));
  const validPair = (id: string) => {
    const [p, s, ...extra] = id.split(":");
    return !extra.length && productIds.has(p) && storeIds.has(s);
  };
  if (!state.cases.some((c) => c.id === input.caseId))
    errors.push("Choose an existing case.");
  if (!input.owner.trim() || !input.reason.trim())
    errors.push("An owner and reason are required.");
  if (!pairs.length || pairs.some((p) => !validPair(p)))
    errors.push("Choose exact connected SKU-store pairs.");
  if (!input.evidenceIds.length) errors.push("Link evidence before saving.");
  const evidence = new Set([
    ...pairs,
    ...data.supply
      .filter((s) =>
        s.storeId
          ? pairs.includes(`${s.itemId}:${s.storeId}`)
          : pairs.some((p) => p.split(":")[0] === s.itemId),
      )
      .map((s) => s.id),
    ...state.observations
      .filter((o) =>
        pairs.some(
          (p) =>
            o.itemIds.includes(p.split(":")[0]) &&
            o.storeIds.includes(p.split(":")[1]),
        ),
      )
      .map((o) => o.id),
    ...state.cases
      .filter((c) => pairs.includes(`${c.itemId}:${c.storeId}`))
      .map((c) => c.id),
  ]);
  if (input.evidenceIds.some((id) => !evidence.has(id)))
    errors.push(
      "Evidence must belong to the selected pairs or their linked supply/observations.",
    );
  if (!dateValid(input.effectiveDate) || !dateValid(input.reviewDate))
    errors.push("Use valid effective and review dates.");
  if (input.reviewDate < input.effectiveDate)
    errors.push("Review date must be on or after the effective date.");
  const units = unique(
    pairs.map(
      (id) => data.products.find((p) => p.id === id.split(":")[0])?.uom,
    ),
  );
  if (
    input.quantity !== undefined &&
    (!(input.quantity > 0) ||
      !Number.isFinite(input.quantity) ||
      !input.uom ||
      units.length !== 1 ||
      units[0] !== input.uom)
  )
    errors.push(
      "Quantity must be positive and match every selected SKU unit; split mixed-unit follow-ups.",
    );
  if (
    ["Chase existing inbound", "Transfer", "Bulk out"].includes(input.action) &&
    input.quantity === undefined
  )
    errors.push("Supply follow-up requires a positive compatible quantity.");
  if (input.action === "Chase existing inbound") {
    const inbound = data.supply.filter(
      (s) =>
        s.kind === "open-order" &&
        s.storeId &&
        pairs.includes(`${s.itemId}:${s.storeId}`) &&
        (s.id === input.linkedSupplyId || input.evidenceIds.includes(s.id)) &&
        s.uom === input.uom,
    );
    if (
      !inbound.length ||
      (input.quantity || 0) > inbound.reduce((n, s) => n + s.quantity, 0)
    )
      errors.push(
        "Chase only the linked existing inbound quantity; do not create a second order.",
      );
  }
  if (["Transfer", "Bulk out"].includes(input.action)) {
    const snapshots = pairs.map((id) => {
      const [p, s] = id.split(":");
      return data.inventory
        .filter(
          (i) =>
            i.itemId === p && i.storeId === s && i.asOf <= input.effectiveDate,
        )
        .sort((a, b) => a.asOf.localeCompare(b.asOf))
        .at(-1);
    });
    if (
      snapshots.some(
        (s) =>
          !s ||
          s.sellable === null ||
          s.sellable < 0 ||
          s.quality !== "complete",
      ) ||
      (input.quantity || 0) >
        snapshots.reduce((n, s) => n + (s?.sellable || 0), 0)
    )
      errors.push("Quantity exceeds known nonnegative sellable source stock.");
  }
  if (
    input.action === "Transfer" &&
    (!input.destinationStoreId ||
      !storeIds.has(input.destinationStoreId) ||
      pairs.some((p) => p.split(":")[1] === input.destinationStoreId))
  )
    errors.push(
      "Choose a connected destination different from every source store.",
    );
  const membership = (itemId: string, storeId: string) =>
    data.rangeEvents
      .filter(
        (e) =>
          e.itemId === itemId &&
          e.storeId === storeId &&
          e.effectiveOn <= input.effectiveDate,
      )
      .sort(
        (a, b) =>
          a.effectiveOn.localeCompare(b.effectiveOn) ||
          a.id.localeCompare(b.id),
      )
      .at(-1);
  if (
    pairs.some((id) => {
      const st = data.stores.find((s) => s.id === id.split(":")[1]);
      return st?.closedOn && st.closedOn <= input.effectiveDate;
    }) &&
    !["Bulk out", "Transfer", "Stop buy"].includes(input.action)
  )
    errors.push(
      "This range action includes a closed store; retain historical evidence but choose an executable scope.",
    );
  if (
    input.action === "Add" &&
    pairs.some((id) => {
      const [p, s] = id.split(":"),
        m = membership(p, s);
      return !m || m.eligibility !== "eligible" || m.range === "ranged";
    })
  )
    errors.push(
      "Add requires known eligible pairs that are not already ranged.",
    );
  if (
    input.action === "Drop" &&
    pairs.some((id) => {
      const [p, s] = id.split(":");
      return membership(p, s)?.range !== "ranged";
    })
  )
    errors.push(
      "Drop requires known currently ranged pairs at the effective date.",
    );
  if (input.action === "Swap") {
    if (
      !input.outgoingItemId ||
      !input.incomingItemId ||
      input.outgoingItemId === input.incomingItemId ||
      !productIds.has(input.incomingItemId) ||
      !pairs.every((p) => p.split(":")[0] === input.outgoingItemId)
    )
      errors.push(
        "Swap needs different connected incoming/outgoing SKUs and exact outgoing pairs.",
      );
    else if (
      pairs.some((id) => {
        const store = id.split(":")[1],
          out = membership(input.outgoingItemId!, store),
          incoming = membership(input.incomingItemId!, store);
        return (
          out?.range !== "ranged" ||
          incoming?.eligibility !== "eligible" ||
          incoming.range === "ranged"
        );
      })
    )
      errors.push(
        "Swap requires ranged outgoing pairs and known eligible, not-already-ranged incoming pairs at the same stores.",
      );
  }
  if (
    input.linkedDecisionId &&
    !state.decisions.some((d) => d.id === input.linkedDecisionId)
  )
    errors.push("Linked decision does not exist.");
  if (
    state.decisions.some(
      (d) =>
        d.id !== excludeId &&
        active(d) &&
        d.action === input.action &&
        d.pairIds.some((p) => pairs.includes(p)),
    )
  )
    errors.push(
      "A pending decision already requests this action for an overlapping pair.",
    );
  return errors;
}
export function saveDecisionDraft(
  state: SessionState,
  input: DraftInput,
  nowISO?: string,
  dataset: Dataset = demoDataset,
): MutationResult<DecisionRecord> {
  const errors = draftErrors(state, input, dataset);
  if (errors.length) return failure(state, errors);
  const at = nowISO || nowFor(dataset);
  const numbers = state.decisions
    .map((d) => Number(d.id.replace(/^D/, "")))
    .filter(Number.isFinite);
  const record: DecisionRecord = {
    ...structuredClone(input),
    pairIds: unique(input.pairIds),
    id: `D${String(Math.max(0, ...numbers) + 1).padStart(3, "0")}`,
    state: "Draft",
    createdAt: at,
    updatedAt: at,
    author: input.author || input.owner,
    recordedAt: input.recordedAt || at,
    completedPairIds: [],
    failedPairIds: [],
    acknowledgementRefs: [],
    history: [
      {
        at,
        actor: input.owner,
        state: "Draft",
        note: "Saved draft only; no order or execution was created.",
      },
    ],
  };
  return {
    ok: true,
    state: {
      ...state,
      decisions: [...state.decisions, record],
      cases: state.cases.map((c) =>
        c.id === input.caseId ? { ...c, state: "In review" } : c,
      ),
    },
    record,
    errors: [],
  };
}
export function editDecisionDraft(
  state: SessionState,
  id: string,
  input: DraftInput,
  nowISO?: string,
  dataset: Dataset = demoDataset,
): MutationResult<DecisionRecord> {
  const current = state.decisions.find((d) => d.id === id);
  if (!current || current.state !== "Draft")
    return failure(state, ["Only an existing draft can be edited."]);
  const errors = draftErrors(state, input, dataset, id);
  if (errors.length) return failure(state, errors);
  const at = nowISO || nowFor(dataset);
  const record: DecisionRecord = {
    ...current,
    ...structuredClone(input),
    pairIds: unique(input.pairIds),
    updatedAt: at,
    history: [
      ...current.history,
      {
        at,
        actor: input.owner,
        state: "Draft",
        note: "Draft revalidated and edited; execution unchanged.",
      },
    ],
  };
  return {
    ok: true,
    state: {
      ...state,
      decisions: state.decisions.map((d) => (d.id === id ? record : d)),
    },
    record,
    errors: [],
  };
}
export function advanceDecision(
  state: SessionState,
  id: string,
  event: DecisionTransition,
  actor: DecisionActor,
  nowISO = demoDataset.feeds.refreshedAt,
): MutationResult<DecisionRecord> {
  const current = state.decisions.find((d) => d.id === id);
  if (!current) return failure(state, ["Decision not found."]);
  const next = structuredClone(current),
    errors: string[] = [];
  if (!actor.id.trim()) errors.push("An identified actor is required.");
  if (event.type === "submit") {
    if (current.state !== "Draft")
      errors.push("Only a draft can be submitted.");
    else next.state = "Awaiting approval";
  }
  if (event.type === "approve") {
    if (!actor.canApprove) errors.push("Approval permission required.");
    if (current.state !== "Awaiting approval")
      errors.push("Decision must await approval.");
    else next.state = "Approved";
  }
  if (event.type === "await-execution") {
    if (current.state !== "Approved")
      errors.push("Approval is required first.");
    else next.state = "Awaiting execution";
  }
  if (event.type === "execution-ack") {
    if (!actor.canExecute)
      errors.push("Execution acknowledgement permission required.");
    if (
      ![
        "Approved",
        "Awaiting execution",
        "Partially executed",
        "Executed",
      ].includes(current.state)
    )
      errors.push("Decision is not ready for acknowledgement.");
    if (!event.executionRef?.trim())
      errors.push("An external execution reference is required.");
    const completed = unique(event.completedPairIds || []),
      failed = unique(event.failedPairIds || []);
    if ([...completed, ...failed].some((p) => !current.pairIds.includes(p)))
      errors.push("Acknowledgement contains a pair outside approved scope.");
    if (completed.some((p) => failed.includes(p)))
      errors.push("A pair cannot complete and fail in one acknowledgement.");
    if (!completed.length && !failed.length)
      errors.push("Provide completed or failed pairs.");
    next.completedPairIds = unique([...current.completedPairIds, ...completed]);
    next.failedPairIds = unique([...current.failedPairIds, ...failed]).filter(
      (p) => !next.completedPairIds.includes(p),
    );
    next.executionRef = event.executionRef;
    next.acknowledgementRefs = unique([
      ...(current.acknowledgementRefs || []),
      event.executionRef || "",
    ]);
    next.state =
      next.completedPairIds.length === current.pairIds.length
        ? "Executed"
        : "Partially executed";
    if (
      !errors.length &&
      JSON.stringify(next.completedPairIds) ===
        JSON.stringify(current.completedPairIds) &&
      JSON.stringify(next.failedPairIds) ===
        JSON.stringify(current.failedPairIds) &&
      (current.acknowledgementRefs || []).includes(event.executionRef!)
    )
      return { ok: true, state, record: current, errors: [] };
  }
  if (event.type === "review") {
    if (!["Executed", "Partially executed"].includes(current.state))
      errors.push("Execution acknowledgement required before review.");
    if (!event.note?.trim()) errors.push("Record outcome and limitations.");
    next.state = "Reviewed";
  }
  if (event.type === "cancel" || event.type === "supersede") {
    if (["Reviewed", "Cancelled", "Superseded"].includes(current.state))
      errors.push("Terminal decisions remain auditable.");
    next.state = event.type === "cancel" ? "Cancelled" : "Superseded";
  }
  if (errors.length) return failure(state, errors);
  next.updatedAt = nowISO;
  next.history.push({
    at: nowISO,
    actor: actor.id,
    state: next.state,
    note:
      event.note ||
      "Explicit local demo acknowledgement; no external integration called.",
  });
  return {
    ok: true,
    state: {
      ...state,
      decisions: state.decisions.map((d) => (d.id === id ? next : d)),
    },
    record: next,
    errors: [],
  };
}
export function saveObservation(
  state: SessionState,
  input: Omit<Observation, "id">,
): MutationResult<Observation> {
  if (
    !input.text.trim() ||
    !input.author.trim() ||
    !input.source.trim() ||
    !dateValid(input.observedOn) ||
    !Number.isFinite(Date.parse(input.recordedOn))
  )
    return failure(state, [
      "Observation needs text, author, valid dates and a source.",
    ]);
  const record: Observation = {
    ...structuredClone(input),
    recordedAt: input.recordedAt || input.recordedOn,
    id: `O${String(state.observations.length + 1).padStart(3, "0")}`,
  };
  return {
    ok: true,
    state: { ...state, observations: [...state.observations, record] },
    record,
    errors: [],
  };
}
export function saveLearning(
  state: SessionState,
  input: Omit<Learning, "id">,
): MutationResult<Learning> {
  if (
    !input.reviewId ||
    !input.version ||
    !input.question.trim() ||
    !input.owner.trim() ||
    !input.evidenceIds.length
  )
    return failure(state, [
      "Learning needs review/version, question, owner and evidence.",
    ]);
  if (
    input.state === "Accepted" &&
    (!input.conclusion.trim() || !input.reviewedBy?.trim())
  )
    return failure(state, [
      "Accepted learning needs a reviewed conclusion and identified reviewer.",
    ]);
  const record: Learning = {
    ...structuredClone(input),
    author: input.author || input.owner,
    recordedAt: input.recordedAt || demoDataset.feeds.refreshedAt,
    id: `L${String(state.learnings.length + 1).padStart(3, "0")}`,
  };
  return {
    ok: true,
    state: { ...state, learnings: [...state.learnings, record] },
    record,
    errors: [],
  };
}
export function saveCase(
  state: SessionState,
  input: CaseRecord,
  dataset: Dataset = demoDataset,
): MutationResult<CaseRecord> {
  if (
    !dataset.products.some((p) => p.id === input.itemId) ||
    !dataset.stores.some((s) => s.id === input.storeId) ||
    !input.title.trim() ||
    !input.owner.trim() ||
    !dateValid(input.reviewDate) ||
    !input.evidenceIds.length
  )
    return failure(state, [
      "Case needs a connected pair, title, owner, valid review date and evidence.",
    ]);
  const prior = state.cases.find(
    (c) =>
      c.itemId === input.itemId &&
      c.storeId === input.storeId &&
      c.state !== "Resolved",
  );
  const signal = {
    ruleId: input.ruleId,
    ruleVersion: input.ruleVersion,
    metric: input.metric,
    actual: input.actual,
    threshold: input.threshold,
    evidenceIds: input.evidenceIds,
    evaluatedAt: input.evaluatedAt,
  };
  const record = prior
    ? {
        ...prior,
        evidenceIds: unique([...prior.evidenceIds, ...input.evidenceIds]),
        signals: [...(prior.signals || []), signal].filter(
          (s, i, a) =>
            a.findIndex(
              (x) =>
                x.ruleId === s.ruleId &&
                x.ruleVersion === s.ruleVersion &&
                x.evaluatedAt === s.evaluatedAt,
            ) === i,
        ),
      }
    : structuredClone(input);
  return {
    ok: true,
    state: {
      ...state,
      cases: prior
        ? state.cases.map((c) => (c.id === prior.id ? record : c))
        : [...state.cases, record],
    },
    record,
    errors: [],
  };
}
