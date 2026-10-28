import { ChipProps as MUIChipProps } from '@mui/material/Chip';
import { BaseComponentProps } from '../../types';

/**
 * Chip selection types that determine the visual indicator style
 */
export type ChipType = 'default' | 'single' | 'multi';
export interface ChipsProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIChipProps, 'onClick' | 'label'> {
    /**
     * The text content displayed inside the chip.
     * This is required and will be passed to the onClick callback.
     * @example
     * <Chips label="JavaScript" />
     * <Chips label="Category A" />
     */
    label: string;
    /**
     * Callback function triggered when the chip is clicked.
     * Receives the chip's label as an argument.
     * @param label - The label text of the clicked chip
     * @example
     * <Chips
     *   label="React"
     *   onClick={(label) => console.log(`Selected: ${label}`)}
     * />
     */
    onClick?: (label: string) => void;
    /**
     * When true, the chip is non-interactive and displays in a muted style.
     * Disabled chips cannot be clicked or selected.
     * @default false
     * @example
     * <Chips label="Unavailable" disabled />
     */
    disabled?: boolean;
    /**
     * The type of chip which determines its visual selection indicator.
     * - 'default': No selection indicator, simple chip
     * - 'single': Shows a radio button indicator (for single selection scenarios)
     * - 'multi': Shows a checkbox indicator (for multiple selection scenarios)
     * @default 'default'
     * @example
     * // For single selection (like radio buttons)
     * <Chips type="single" label="Option A" isActive={selected === 'A'} />
     *
     * // For multiple selection (like checkboxes)
     * <Chips type="multi" label="Feature X" isActive={features.includes('X')} />
     */
    type?: ChipType;
    /**
     * When true, displays the chip in its selected/active state.
     * The visual appearance depends on the `type` prop:
     * - 'single': Shows filled radio indicator
     * - 'multi': Shows checked checkbox indicator
     * - 'default': Shows highlighted border
     * @default false
     * @example
     * const [selected, setSelected] = useState<string[]>([]);
     *
     * <Chips
     *   type="multi"
     *   label="TypeScript"
     *   isActive={selected.includes('TypeScript')}
     *   onClick={(label) => toggleSelection(label)}
     * />
     */
    isActive?: boolean;
}
//# sourceMappingURL=Chips.types.d.ts.map