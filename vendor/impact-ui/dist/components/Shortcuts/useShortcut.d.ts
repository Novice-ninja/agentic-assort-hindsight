import { ShortcutBinding } from '../../utils/shortcuts';

type SharedOptions = Omit<ShortcutBinding, 'keys' | 'handler'>;
export declare function useShortcut(keysOrBindings: string | ShortcutBinding[], handlerOrShared?: ((event: KeyboardEvent) => void) | SharedOptions, singleOptions?: SharedOptions): void;
export {};
//# sourceMappingURL=useShortcut.d.ts.map