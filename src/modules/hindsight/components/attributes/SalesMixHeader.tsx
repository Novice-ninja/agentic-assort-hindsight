import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import salesMixIcon from '@assets/icons/hindsight/sales-mix.svg';
import { ImpactSelect, type SelectOption } from '@shared/components/vendor/impact-ui';
import { useLabel } from '../../hooks';
import type { AttributeDefinition } from '../../types';
import { displayLabel } from './attributeLabel';
import styles from './SalesMixHeader.module.css';

export interface SalesMixHeaderProps {
  attributes: AttributeDefinition[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

/**
 * Sales Mix header: replaces the attribute tab strip with a banner holding a searchable,
 * single-select dropdown of the same attributes. Selecting one fires `onSelect` exactly as a tab did.
 */
export function SalesMixHeader({
  attributes,
  activeId,
  onSelect,
  loading = false,
}: SalesMixHeaderProps) {
  const { t } = useTranslation('hindsight');
  const label = useLabel();
  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo<SelectOption[]>(
    () =>
      attributes.map((attribute) => ({
        value: attribute.id,
        label: displayLabel(label(attribute.labelKey), attribute.id),
      })),
    [attributes, label],
  );
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(options);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const controlledSelection = useMemo(
    () => options.find((option) => option.value === activeId) ?? [],
    [options, activeId],
  );
  // The vendor Select calls setSelectedOptions unconditionally, so it needs real state to write to.
  const [selectedOptions, setSelectedOptions] = useState<SelectOption | SelectOption[]>(
    controlledSelection,
  );

  useEffect(() => {
    setSelectedOptions(controlledSelection);
  }, [controlledSelection]);

  useEffect(() => {
    setCurrentOptions(options);
  }, [options]);

  return (
    <div className={styles.header} data-testid="hindsight-attribute-selector">
      <div className={styles.lead}>
        <img src={salesMixIcon} alt="" aria-hidden="true" className={styles.icon} />
        <span className={styles.title}>{t('salesMix.title')}</span>
        <span className={styles.subtitle}>{t('salesMix.subtitle')}</span>
      </div>

      <ImpactSelect
        label={t('attributes.selectorLabel')}
        labelOrientation="left"
        isMulti={false}
        isWithSearch
        isLoading={loading}
        initialOptions={options}
        currentOptions={currentOptions}
        setCurrentOptions={setCurrentOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={(next) => setSelectedOptions(next ?? [])}
        isSelectAll={isSelectAll}
        setIsSelectAll={setIsSelectAll}
        handleChange={(next) => {
          const chosen = Array.isArray(next) ? next[0] : next;
          if (chosen?.value && chosen.value !== activeId) onSelect(String(chosen.value));
          setIsOpen(false);
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCloseWhenClickOutside
        withPortal
        portalContainer={typeof document !== 'undefined' ? document.body : undefined}
        width={280}
        selectId="hindsight-sales-mix-select"
      />
    </div>
  );
}
