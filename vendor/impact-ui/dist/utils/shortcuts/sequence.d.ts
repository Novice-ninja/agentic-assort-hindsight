import { ShortcutCombo } from './types';

export interface SequenceEntry {
    id: string;
    steps: ShortcutCombo[];
}
export declare class SequenceTracker {
    private _timeout;
    private _progress;
    private _timer;
    constructor(timeout?: number);
    advance<T extends SequenceEntry>(event: KeyboardEvent, entries: T[]): T | null;
    reset(): void;
    get hasActiveSequences(): boolean;
    private _startTimer;
    private _clearTimer;
}
//# sourceMappingURL=sequence.d.ts.map