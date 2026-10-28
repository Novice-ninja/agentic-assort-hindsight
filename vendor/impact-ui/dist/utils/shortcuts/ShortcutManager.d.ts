import { ShortcutRegistration, ShortcutSummary } from './types';

export declare class ShortcutManager {
    private static instance;
    private registrations;
    private activeScopes;
    private listenerAttached;
    private debug;
    private sequenceTimeout;
    private _sequenceTracker;
    private _sortedCache;
    private constructor();
    static getInstance(options?: {
        debug?: boolean;
        sequenceTimeout?: number;
    }): ShortcutManager;
    static resetInstance(): void;
    private attachListener;
    private getSorted;
    private handleKeyDown;
    register(registration: ShortcutRegistration): void;
    /**
     * Programmatically invoke a registered shortcut handler by its id.
     * Returns true if the shortcut was found and fired, false otherwise.
     */
    trigger(id: string, event?: KeyboardEvent | null): boolean;
    unregister(id: string): void;
    isRegistered(id: string): boolean;
    enableScope(name: string): void;
    disableScope(name: string): void;
    isScopeActive(name: string): boolean;
    getAllShortcuts(): ShortcutSummary[];
    getShortcutsByScope(scope: string): Omit<ShortcutSummary, 'scope'>[];
    setDebug(enabled: boolean): void;
    destroy(): void;
    private debugLog;
}
//# sourceMappingURL=ShortcutManager.d.ts.map