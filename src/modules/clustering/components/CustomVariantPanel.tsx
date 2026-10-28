import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chips, Panel, Skeleton } from '@shared/components/vendor/impact-ui';
import type { ClusteringAttribute } from '../types';
import styles from './customVariant.module.css';

const CATEGORIES = ['performance', 'product', 'store'] as const;

const SKELETON_PILLS = [96, 110, 88, 102, 94] as const;

export interface CustomVariantPanelProps {
  open: boolean;
  attributes: ClusteringAttribute[];
  loading: boolean;
  saving: boolean;
  loadFailed: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
}

function chipLabel(attr: ClusteringAttribute, t: (key: string, opts?: { defaultValue?: string }) => string) {
  return t(attr.labelKey, { defaultValue: attr.label ?? attr.id });
}

export function CustomVariantPanel({
  open,
  attributes,
  loading,
  saving,
  loadFailed,
  onClose,
  onSave,
}: CustomVariantPanelProps) {
  const { t } = useTranslation('clustering');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) setSelectedIds([]);
  }, [open]);

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const selectedRows = attributes.filter((attr) => selectedIds.includes(attr.id));
  const saveDisabled = loading || loadFailed || saving || selectedIds.length === 0;

  const close = () => onClose();

  return (
    <Panel
      open={open}
      setIsOpen={(next) => {
        if (!next) close();
      }}
      onClose={close}
      anchor="right"
      width={692}
      className={styles.panel}
      title={t('review.customVariantsTitle')}
      secondaryButtonLabel={t('review.cancel')}
      onSecondaryButtonClick={close}
      primaryButtonLabel={t('footer.save')}
      onPrimaryButtonClick={() => {
        if (saveDisabled) return;
        onSave(selectedIds);
      }}
      primaryButtonProps={{ disabled: saveDisabled, loading: saving }}
    >
      {loading ? (
        <div className={styles.body} aria-busy="true" data-testid="custom-variant-skeleton">
          {CATEGORIES.map((category) => (
            <div key={category} className={styles.group}>
              <Skeleton variant="text" width={140} height={21} />
              <div className={styles.chipRow}>
                {SKELETON_PILLS.map((width, index) => (
                  <Skeleton key={index} variant="pill" width={width} height={32} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.body}>
          <p className={styles.subtitle}>{t('review.customVariantsSubtitle')}</p>
          {CATEGORIES.map((category) => {
            const rows = attributes.filter((attr) => attr.category === category);
            if (rows.length === 0) return null;
            return (
              <div key={category} className={styles.group}>
                <p className={styles.groupTitle}>{t(`review.${category}`)}</p>
                <div className={styles.chipRow}>
                  {rows.map((attr) => (
                    <Chips
                      key={attr.id}
                      type="multi"
                      label={chipLabel(attr, t)}
                      isActive={selectedIds.includes(attr.id)}
                      onClick={() => toggle(attr.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <div className={styles.selectedWell}>
            <p className={styles.selectedTitle}>{t('review.selectedAttributes')}</p>
            <div className={styles.chipRow}>
              {selectedRows.map((attr) => (
                <Chips
                  key={`selected-${attr.id}`}
                  type="multi"
                  label={chipLabel(attr, t)}
                  isActive
                  onClick={() => toggle(attr.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
