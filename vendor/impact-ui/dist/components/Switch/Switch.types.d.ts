import { SwitchProps as MUISwitchProps } from '@mui/material/Switch';
import { BaseComponentProps } from '../../types';

export interface SwitchProps extends Omit<BaseComponentProps, 'children'>, Omit<MUISwitchProps, 'checked' | 'value'> {
    /**
     * The current state of the switch (on/off).
     * When true, the switch is in the "on" position.
     * This is a controlled component - you must manage this state externally.
     * @example
     * const [enabled, setEnabled] = useState(false);
     *
     * <Switch
     *   value={enabled}
     *   onChange={(e) => setEnabled(e.target.checked)}
     * />
     */
    value?: boolean;
    /**
     * Optional label displayed on the left side of the switch.
     * Useful for labeling the "off" state or providing context.
     * The label color changes based on the switch state.
     * @example
     * <Switch leftLabel="Off" rightLabel="On" value={isEnabled} />
     * <Switch leftLabel="Disabled" value={false} />
     */
    leftLabel?: string;
    /**
     * Optional label displayed on the right side of the switch.
     * Useful for labeling the "on" state or providing context.
     * The label color changes based on the switch state.
     * @example
     * <Switch rightLabel="Enable notifications" value={notifications} />
     * <Switch leftLabel="No" rightLabel="Yes" value={answer} />
     */
    rightLabel?: string;
    /**
     * When true, the switch is non-interactive and displays in a muted style.
     * The visual state (on/off) is preserved but cannot be changed.
     * @default false
     * @example
     * <Switch
     *   value={true}
     *   disabled
     *   rightLabel="Feature locked"
     * />
     */
    disabled?: boolean;
    /**
     * Callback function triggered when the switch state changes.
     * Receives the standard React change event.
     * @param event - The change event from the underlying input element
     * @example
     * const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     *   setEnabled(event.target.checked);
     * };
     *
     * <Switch value={enabled} onChange={handleChange} />
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * Accessible label for screen readers.
     * Required when no visible label is provided via leftLabel or rightLabel.
     * @example
     * <Switch value={darkMode} onChange={toggleDarkMode} aria-label="Toggle dark mode" />
     */
    'aria-label'?: string;
    /**
     * ID of an element that labels the switch for accessibility.
     * Use when the label is rendered separately from the component.
     * @example
     * <label id="notifications-label">Email Notifications</label>
     * <Switch value={notifications} aria-labelledby="notifications-label" />
     */
    'aria-labelledby'?: string;
}
//# sourceMappingURL=Switch.types.d.ts.map