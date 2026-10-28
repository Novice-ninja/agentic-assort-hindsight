import { SwitchProps } from './Switch.types';

/**
 * Switch component for toggling between two states (on/off).
 * Supports optional labels on either side of the switch.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Basic switch
 * const [enabled, setEnabled] = useState(false);
 * <Switch value={enabled} onChange={(e) => setEnabled(e.target.checked)} />
 *
 * // Switch with labels
 * <Switch
 *   value={notifications}
 *   leftLabel="Off"
 *   rightLabel="On"
 *   onChange={handleChange}
 * />
 *
 * // Switch with right label only
 * <Switch
 *   value={darkMode}
 *   rightLabel="Enable dark mode"
 *   onChange={toggleDarkMode}
 * />
 */
export declare const Switch: import('react').ForwardRefExoticComponent<Omit<SwitchProps, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=index.d.ts.map