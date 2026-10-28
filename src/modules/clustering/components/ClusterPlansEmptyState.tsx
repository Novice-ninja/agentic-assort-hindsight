import { useTranslation } from 'react-i18next';
import { ImpactEmptyState } from '@shared/components/vendor/impact-ui';

export interface ClusterPlansEmptyStateProps {
  variant: 'noPlans' | 'filtered';
  canCreate: boolean;
  onCreate: () => void;
}

export function ClusterPlansEmptyState({
  variant,
  canCreate,
  onCreate,
}: ClusterPlansEmptyStateProps) {
  const { t } = useTranslation('clustering');

  const showPrimary = variant === 'noPlans' && canCreate;

  return (
    <div data-testid={`cluster-plans-empty-state-${variant}`}>
      <ImpactEmptyState
        heading={t(`empty.${variant}Title`)}
        description={t(`empty.${variant}Body`)}
        onPrimaryButtonClick={showPrimary ? onCreate : undefined}
      />
    </div>
  );
}
