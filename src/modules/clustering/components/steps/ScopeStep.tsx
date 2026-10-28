import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChangeEvent, FocusEvent } from 'react';
import type { HierarchyLevelDef, HierarchyScopeEntry } from '@modules/planning/types';
import { ImpactInput as Input, Switch } from '@shared/components/vendor/impact-ui';
import sections from '@shared/styles/wizardSections.module.css';
import bulkInfoIcon from '@assets/icons/clustering/describe-bulk-info.svg';
import channelStorefrontIcon from '@assets/icons/clustering/channel-storefront.png';
import { clusterNameError, NAME_MAX_LENGTH } from '../../services/scopeValidation';
import { useChannelOptions } from '../../hooks/useChannelOptions';
import { useClusterProductScope } from '../../hooks/useClusterProductScope';
import type { ChannelOption, ClusterDraft, ScopeCatalogues } from '../../types';
import { ProductHierarchySection } from '../ProductHierarchySection';
import {
  ReferencePeriodSection,
  type ReferencePeriodSectionProps,
} from '../ReferencePeriodSection';
import { RunModeCards } from '../RunModeCards';
import { ScopeCardGroup } from '../ScopeCardGroup';
import { SeasonCards } from '../SeasonCards';
import scope from '../scope.module.css';

function withoutExcludedChannels(
  channels: readonly ChannelOption[],
  excludeChannels: readonly string[],
): ChannelOption[] {
  const excluded = new Set(
    excludeChannels.map((key) => key.trim().toLowerCase()).filter((key) => key.length > 0),
  );
  if (excluded.size === 0) return [...channels];
  return channels.filter((channel) => {
    const keys = [channel.id, channel.label ?? ''];
    return !keys.some((key) => excluded.has(key.trim().toLowerCase()));
  });
}

export interface ScopeStepProps {
  draft: ClusterDraft;
  catalogues: ScopeCatalogues;
  /** True while the shared seasons API has not resolved. */
  seasonsLoading?: boolean;
  /**
   * Reference Period (`/season_info` for the selected season). Owned by the page; the section
   * is only rendered while a season is selected. Omitted in isolated renders.
   */
  referencePeriods?: ReferencePeriodSectionProps;
  nameError?: string | null;
  onNameBlur: (name: string) => void;
  onChange: (patch: Partial<ClusterDraft>) => void;
  /** Loaded `/filters/config` levels, so mandatory ones (Category) gate Go to Review. */
  onHierarchyLevelsChange?: (levels: readonly HierarchyLevelDef[]) => void;
}

export function ScopeStep({
  draft,
  catalogues,
  seasonsLoading,
  referencePeriods,
  nameError,
  onNameBlur,
  onChange,
  onHierarchyLevelsChange,
}: ScopeStepProps) {
  const { t } = useTranslation('clustering');
  const onHierarchyScopeChange = useCallback(
    (hierarchyScope: HierarchyScopeEntry[]) => {
      onChange({ hierarchyScope });
    },
    [onChange],
  );
  // `/filters/config?config_key=cluster_config` + `/filters/values` (product + channel)
  // live here so Review / Finalize / Sign-Off never mount them.
  const productScope = useClusterProductScope(draft.hierarchyScope, onHierarchyScopeChange);
  useEffect(() => {
    if (!onHierarchyLevelsChange || productScope.levelsStatus !== 'succeeded') return;
    onHierarchyLevelsChange(productScope.levels);
  }, [onHierarchyLevelsChange, productScope.levels, productScope.levelsStatus]);
  const { channels, status: channelsStatus } = useChannelOptions();
  const configPending =
    productScope.levelsStatus === 'idle' || productScope.levelsStatus === 'loading';
  const channelsLoading =
    channelsStatus === 'idle' || channelsStatus === 'loading' || configPending;
  const visibleChannels = useMemo(
    () =>
      productScope.levelsStatus === 'succeeded'
        ? withoutExcludedChannels(channels, productScope.excludedChannelKeys)
        : channels,
    [channels, productScope.excludedChannelKeys, productScope.levelsStatus],
  );
  useEffect(() => {
    if (channelsLoading || !draft.channelId) return;
    if (visibleChannels.some((channel) => channel.id === draft.channelId)) return;
    onChange({ channelId: null });
  }, [channelsLoading, draft.channelId, onChange, visibleChannels]);
  const nameIssue = clusterNameError(draft.name);
  const nameHelper =
    nameIssue === 'invalidChars'
      ? t('scope.nameInvalidChars')
      : nameIssue === 'tooLong'
        ? t('scope.nameTooLong')
        : (nameError ?? '');

  return (
    <div className={sections.step}>
      <div className={sections.sectionWrapper}>
        <div className={scope.planDetailsHeader}>
          <span className={[sections.sectionTitle, scope.planDetailsTitle].join(' ')}>
            {t('scope.planDetails')}
          </span>
          <div className={scope.bulkCreation} data-testid="scope-bulk-creation">
            <span className={scope.bulkCreationLabel}>
              <span className={scope.bulkCreationText}>{t('describe.bulk')}</span>
              <img
                className={scope.bulkCreationInfo}
                src={bulkInfoIcon}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
              />
            </span>
            <Switch value={false} disabled aria-label={t('describe.bulk')} />
          </div>
        </div>
        <div className={scope.nameField}>
          <Input
            id="clusterName"
            name="clusterName"
            label={t('scope.clusterName')}
            placeholder={t('scope.clusterNamePlaceholder')}
            value={draft.name}
            isRequired
            isError={Boolean(nameHelper)}
            isHelperText={Boolean(nameHelper)}
            helperText={nameHelper}
            inputProps={{
              maxLength: NAME_MAX_LENGTH,
              onBlur: (e: FocusEvent<HTMLInputElement>) => onNameBlur(e.currentTarget.value),
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ name: e.target.value })}
          />
        </div>
      </div>
      <RunModeCards
        value={draft.runMode ?? 'gated'}
        onChange={(runMode) => onChange({ runMode })}
      />
      <ProductHierarchySection productScope={productScope} />
      <SeasonCards
        seasons={catalogues.seasons}
        value={draft.seasonId}
        loading={seasonsLoading}
        onChange={(seasonId) => onChange({ seasonId })}
      />
      {draft.seasonId && referencePeriods ? <ReferencePeriodSection {...referencePeriods} /> : null}
      <ScopeCardGroup
        legend={t('scope.channel')}
        required
        name="channel"
        value={draft.channelId}
        onChange={(channelId) => onChange({ channelId })}
        loading={channelsLoading}
        options={visibleChannels.map((channel) => ({
          id: channel.id,
          title: channel.label ?? channel.id,
          icon: channelStorefrontIcon,
        }))}
      />
    </div>
  );
}
