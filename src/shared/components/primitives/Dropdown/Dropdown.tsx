import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SelectOption, SelectProps } from '@shared/components/vendor/impact-ui';
import { ImpactSelect } from '@shared/components/vendor/impact-ui';

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Simplified props for common use cases.
 * All other Impact UI Select props can be passed through via `selectProps`.
 */
export interface DropdownProps {
  /** Heading/Label of the Select */
  label?: string;
  /** Label placement */
  labelOrientation?: 'top' | 'left';
  /** Options array */
  options: DropdownOption[];
  /** Currently selected values (string array for convenience) */
  value: string[];
  /** Change handler receiving the selected values as string array */
  onChange: (selected: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Allow multiple selections */
  isMulti?: boolean;
  /** Show clear button */
  isClearable?: boolean;
  /** Disable the select */
  disabled?: boolean;
  /** Show search input inside dropdown */
  isWithSearch?: boolean;
  /** Show "Select All" checkbox (multi-select). Also enables Impact UI `toggleSelectAll`. */
  isWithSelectAll?: boolean;
  /** Show selected options as tags below the select */
  isWithSelectedOptionTags?: boolean;
  /** Mark as required */
  isRequired?: boolean;
  /** Mark as error state */
  isError?: boolean;
  /** Helper text for error state */
  helperText?: string;
  /** Show loading state */
  isLoading?: boolean;
  /** Show icon in select trigger */
  isWithIcon?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Width of the select */
  width?: string | number;
  /** Min width of the select */
  minWidth?: string;
  /** Unique ID */
  selectId?: string;
  /** No options message */
  noOptionMessage?: string;
  /** Render dropdown in a portal */
  withPortal?: boolean;
  /** Portal container */
  portalContainer?: HTMLElement;
  /** Portal className */
  dropDownPortalClassName?: string;
  /** Dropdown position */
  dropdownPosition?: string;
  /** Close when clicking outside */
  isCloseWhenClickOutside?: boolean;
  /** Callback when dropdown opens */
  onDropdownOpen?: () => void;
  /** Callback when dropdown closes */
  onDropdownClose?: () => void;
  /** Callback on search input */
  onSearch?: (query: string) => void;
  /** Callback on search blur */
  onSearchBlur?: () => void;
  /** Callback when scrolled to bottom of menu */
  onMenuScrollToBottom?: () => void;
  /** Callback when select-all is triggered */
  onSelectAll?: () => void;
  /** Callback when clear-all is triggered */
  onClearAll?: () => void;
  /** Whether more options are loading (infinite scroll) */
  isLoadingMore?: boolean;
  /** Show footer message */
  showFooterMessage?: boolean;
  /** Selection action labels */
  selectionLabels?: Record<string, string>;
  /** Default value */
  defaultValue?: SelectOption | SelectOption[] | null;
  /** Wrapper className */
  className?: string;
  /** Any additional props forwarded directly to Impact UI Select */
  selectProps?: Partial<SelectProps>;
  'aria-label'?: string;
  'data-testid'?: string;
}

export function Dropdown({
  label = '',
  labelOrientation = 'top',
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isMulti = false,
  isClearable = true,
  disabled = false,
  isWithSearch = false,
  isWithSelectAll = false,
  isWithSelectedOptionTags = false,
  isRequired = false,
  isError = false,
  helperText,
  isLoading = false,
  isWithIcon = false,
  icon,
  searchPlaceholder,
  width,
  minWidth,
  selectId,
  noOptionMessage,
  withPortal = false,
  portalContainer,
  dropDownPortalClassName,
  dropdownPosition,
  isCloseWhenClickOutside = true,
  onDropdownOpen,
  onDropdownClose,
  onSearch,
  onSearchBlur,
  onMenuScrollToBottom,
  onSelectAll,
  onClearAll,
  isLoadingMore,
  showFooterMessage,
  selectionLabels,
  defaultValue,
  className,
  selectProps,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: DropdownProps) {
  const [isOpen, setIsOpenRaw] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const scrollPosRef = useRef<number>(0);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (withPortal && open) {
        scrollPosRef.current = window.scrollY;
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPosRef.current, behavior: 'instant' as ScrollBehavior });
        });
      }
      setIsOpenRaw(open);
    },
    [withPortal],
  );

  const impactOptions: SelectOption[] = useMemo(
    () => options.map((opt) => ({ label: opt.label, value: opt.value })),
    [options],
  );

  const prevOptionsRef = useRef<string>('');

  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(impactOptions);

  useEffect(() => {
    const optionsString = JSON.stringify(impactOptions);
    if (prevOptionsRef.current !== optionsString) {
      prevOptionsRef.current = optionsString;
      setCurrentOptions(impactOptions);
    }
  }, [impactOptions]);

  /**
   * Derive the controlled selection from the `value` prop, then keep a local copy the vendor can
   * mutate via `setSelectedOptions`. A `useEffect` syncs the local copy whenever the parent's
   * `value` changes, so the vendor always reflects the authoritative state.
   */
  const controlledSelection: SelectOption | SelectOption[] = useMemo(() => {
    const matched = value
      .map((v) => options.find((o) => o.value === v))
      .filter((o): o is DropdownOption => o !== undefined)
      .map((o) => ({ label: o.label, value: o.value }));

    if (isMulti) return matched;
    return matched[0] ?? [];
  }, [value, options, isMulti]);

  const [localSelection, setLocalSelection] = useState<SelectOption | SelectOption[]>(
    controlledSelection,
  );

  useEffect(() => {
    setLocalSelection(controlledSelection);
  }, [controlledSelection]);

  useEffect(() => {
    if (!isMulti || !isWithSelectAll) return;
    setIsSelectAll(
      options.length > 0 &&
        value.length === options.length &&
        options.every((option) => value.includes(option.value)),
    );
  }, [isMulti, isWithSelectAll, options, value]);

  const handleChange = useCallback(
    (selected: SelectOption | SelectOption[] | null) => {
      if (selected === null || selected === undefined) {
        onChange([]);
        return;
      }

      const chosen = Array.isArray(selected) ? selected : [selected];
      onChange(
        chosen
          .filter((option) => option?.value !== undefined)
          .map((option) => String(option.value)),
      );
    },
    [onChange],
  );

  const handleSelectAll = useCallback(
    (event?: { target?: { checked?: boolean } }) => {
      const checked = event?.target?.checked;
      if (checked === false) {
        onChange([]);
        setIsSelectAll(false);
        onClearAll?.();
        return;
      }
      onChange(options.map((o) => o.value));
      setIsSelectAll(true);
      onSelectAll?.();
    },
    [options, onChange, onSelectAll, onClearAll],
  );
  const handleClearAll = useCallback(() => {
    onChange([]);
    setIsSelectAll(false);
    onClearAll?.();
  }, [onChange, onClearAll]);

  const computedWidth = width
    ? typeof width === 'number'
      ? `${width}px`
      : width
    : undefined;

  return (
    <div className={className} data-testid={testId}>
      <ImpactSelect
        aria-label={ariaLabel}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        label={label}
        labelOrientation={labelOrientation}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        isDisabled={disabled}
        isRequired={isRequired}
        isError={isError}
        helperText={helperText}
        isLoading={isLoading}
        isWithIcon={isWithIcon}
        icon={icon}
        isWithSearch={isWithSearch}
        isWithSelectAll={isWithSelectAll}
        toggleSelectAll={isWithSelectAll}
        isWithSelectedOptionTags={isWithSelectedOptionTags}
        isSelectAll={isSelectAll}
        setIsSelectAll={setIsSelectAll}
        initialOptions={impactOptions}
        currentOptions={currentOptions}
        setCurrentOptions={setCurrentOptions}
        selectedOptions={localSelection}
        setSelectedOptions={(val: SelectOption | SelectOption[] | null) =>
          setLocalSelection(val ?? [])
        }
        handleChange={handleChange}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        onSearch={onSearch}
        onSearchBlur={onSearchBlur}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        onMenuScrollToBottom={onMenuScrollToBottom}
        isCloseWhenClickOutside={isCloseWhenClickOutside}
        searchPlaceholder={searchPlaceholder}
        width={computedWidth}
        minWidth={minWidth}
        selectId={selectId}
        noOptionMessage={noOptionMessage}
        withPortal={withPortal}
        portalContainer={portalContainer}
        dropDownPortalClassName={dropDownPortalClassName}
        dropdownPosition={dropdownPosition}
        isLoadingMore={isLoadingMore}
        showFooterMessage={showFooterMessage}
        selectionLabels={selectionLabels}
        defaultValue={defaultValue}
        {...selectProps}
      />
    </div>
  );
}
