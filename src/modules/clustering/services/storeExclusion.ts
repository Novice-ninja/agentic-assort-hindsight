import type { StoreClusterAssignment } from '../types';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export const DEFAULT_EXCLUSION_WEEKS = 8;

export function weeksOpen(openedOn: string, asOf: Date): number {
  const opened = new Date(openedOn).getTime();
  return (asOf.getTime() - opened) / MS_PER_WEEK;
}

export function isNewStore(
  openedOn: string,
  asOf: Date,
  weeks: number = DEFAULT_EXCLUSION_WEEKS,
): boolean {
  return weeksOpen(openedOn, asOf) < weeks;
}

export function applyStoreExclusion(
  assignments: StoreClusterAssignment[],
  weeks: number = DEFAULT_EXCLUSION_WEEKS,
  asOf: Date = new Date(),
): StoreClusterAssignment[] {
  return assignments.map((assignment) => {
    const excluded = isNewStore(assignment.openedOn, asOf, weeks);
    return {
      ...assignment,
      excluded,
      exclusionReasonKey: excluded ? 'finalize.exclusion.openWeeks' : assignment.exclusionReasonKey,
    };
  });
}

export function coverageFromAssignments(assignments: StoreClusterAssignment[]): {
  included: number;
  excluded: number;
} {
  const excluded = assignments.filter((row) => row.excluded).length;
  return { included: assignments.length - excluded, excluded };
}
