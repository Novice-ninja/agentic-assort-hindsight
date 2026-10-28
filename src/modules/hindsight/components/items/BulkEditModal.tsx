import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@shared/components';
import { Popover } from '@shared/components/vendor/impact-ui';
import productIcon from '@assets/icons/hindsight/bulk-edit/product.svg';
import bannerDecoration from '@assets/icons/hindsight/bulk-edit/banner-decoration.svg';
import { RECOMMENDATION_CHOICES } from '../../types';
import styles from './BulkEditModal.module.css';

export interface BulkEditModalProps {
  open: boolean;
  /** Element the popover is positioned against. Required by Impact UI Popover. */
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** Distinct articles checked in the active view. */
  selectedItemCount: number;
  /** Table rows those articles expand to (may exceed item count). */
  selectedRowCount: number;
  /** True while the override request is in flight. */
  applying?: boolean;
  onApply: (choice: string) => void;
}

/**
 * Pop-up that sets Keep or Drop on every checked article in one write.
 *
 * Options stay limited to what `POST /v1/plans/by-item/recommendation` accepts as choosable
 * buckets (`keep` / `drop`). Shop may appear on single-item controls elsewhere but is not a
 * bulk override the endpoint can express.
 */
export function BulkEditModal({
  open,
  anchorEl,
  onClose,
  selectedItemCount,
  selectedRowCount,
  applying = false,
  onApply,
}: BulkEditModalProps) {
  const { t } = useTranslation('hindsight');
  const [choice, setChoice] = useState<string>('');

  useEffect(() => {
    if (open) setChoice('');
  }, [open]);

  const options = useMemo(
    () =>
      RECOMMENDATION_CHOICES.map((value) => ({
        value,
        label: t(`items.verdict.${value}`),
      })),
    [t],
  );

  const canApply = !applying && selectedItemCount > 0 && choice.length > 0;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      title={t('items.bulkEdit.title')}
      primaryButtonLabel={t('items.bulkEdit.apply')}
      onPrimaryButtonClick={() => onApply(choice)}
      primaryButtonProps={{
        size: 'medium',
        disabled: !canApply,
        'aria-busy': applying,
        'data-testid': 'hindsight-bulk-edit-apply',
        loading: applying,
        icon: applying ? <></> : undefined,
      }}
      slotProps={{
        paper: {
          sx: {
            width: 472,
            boxShadow: '0 0 30px 6px rgba(0, 0, 0, 0.10)',
            marginTop: '8px',
            '& .popover-content': { gap: '8px' },
            '& .popover-header': { marginBottom: '4px' },
          },
        },
      }}
      data-testid="hindsight-bulk-edit-modal"
    >
      <div className={styles.body}>
        <div className={styles.banner} role="status">
          <span className={styles.bannerIcon} aria-hidden="true">
            <img src={productIcon} alt="" width={20} height={20} />
          </span>
          <div className={styles.bannerCopy}>
            <p className={styles.bannerPrimary}>
              {t('items.bulkEdit.appliedToItems', { count: selectedItemCount })}
            </p>
            <p className={styles.bannerSecondary}>
              {t('items.bulkEdit.appliedToRows', {
                changes: 1,
                count: selectedRowCount,
              })}
            </p>
          </div>
          <span className={styles.bannerDecor} aria-hidden="true">
            <img src={bannerDecoration} alt="" width={180.874} height={169.332} />
          </span>
        </div>

        <Dropdown
          label={t('items.columns.recommendation')}
          labelOrientation="top"
          aria-label={t('items.columns.recommendation')}
          options={options}
          value={choice.length > 0 ? [choice] : []}
          placeholder={t('items.bulkEdit.selectPlaceholder')}
          isMulti={false}
          isClearable={false}
          disabled={applying}
          width={289}
          onChange={(selected) => setChoice(selected[0] ?? '')}
          withPortal
          portalContainer={typeof document !== 'undefined' ? document.body : undefined}
          data-testid="hindsight-bulk-edit-recommendation"
        />
      </div>
    </Popover>
  );
}
