import { useTranslation } from 'react-i18next';
import { StatusTabCard } from '@shared/components/primitives/StatusTabCard';
import type { StatusTabCardLayer, StatusTabCardTheme } from '@shared/components/primitives/StatusTabCard';
import type { ClusterPlanTabKey } from '../types';
import tabs from '@shared/styles/statusTabList.module.css';

import allGlyphNormal from '@assets/icons/planning/status-tabs/all-glyph-normal.png';
import allGlyphActive from '@assets/icons/planning/status-tabs/all-glyph-active.png';
import draftGlyphNormal from '@assets/icons/planning/status-tabs/draft-glyph-normal.png';
import draftGlyphActive from '@assets/icons/planning/status-tabs/draft-glyph-active.png';
import draftBadgeNormal from '@assets/icons/planning/status-tabs/draft-badge-normal.png';
import draftBadgeActive from '@assets/icons/planning/status-tabs/draft-badge-active.png';
import inprogressGlyphNormal from '@assets/icons/planning/status-tabs/inprogress-glyph-normal.png';
import inprogressGlyphActive from '@assets/icons/planning/status-tabs/inprogress-glyph-active.png';
import inprogressBadgeNormal from '@assets/icons/planning/status-tabs/inprogress-badge-normal.png';
import inprogressBadgeActive from '@assets/icons/planning/status-tabs/inprogress-badge-active.png';
import approvedGlyphNormal from '@assets/icons/planning/status-tabs/approved-glyph-normal.png';
import approvedGlyphActive from '@assets/icons/planning/status-tabs/approved-glyph-active.png';
import approvedBadgeNormal from '@assets/icons/planning/status-tabs/approved-badge-normal.png';
import approvedBadgeActive from '@assets/icons/planning/status-tabs/approved-badge-active.png';

const TABS: ClusterPlanTabKey[] = ['all', 'inputNeeded', 'awaitingApproval', 'approved'];

const THEMES: Record<ClusterPlanTabKey, StatusTabCardTheme> = {
  all: { accent: '#cff0f8', border: '#20accf', surface: '#e9f7fc' },
  awaitingApproval: { accent: '#dddfd3', border: '#aaac8e', surface: '#edede7' },
  inputNeeded: { accent: '#f6e3c8', border: '#d3922d', surface: '#fbf3e6' },
  approved: { accent: '#c4e8d5', border: '#3bb273', surface: '#ebf7f1' },
};

interface TabIconConfig {
  icon: StatusTabCardLayer;
  badge?: StatusTabCardLayer;
}

const ICONS: Record<ClusterPlanTabKey, TabIconConfig> = {
  all: {
    icon: { normal: allGlyphNormal, active: allGlyphActive, left: 11, top: 4 },
  },
  awaitingApproval: {
    icon: { normal: draftGlyphNormal, active: draftGlyphActive, left: 10, top: 3 },
    badge: { normal: draftBadgeNormal, active: draftBadgeActive, left: 30, top: 8 },
  },
  inputNeeded: {
    icon: { normal: inprogressGlyphNormal, active: inprogressGlyphActive, left: 10, top: 3 },
    badge: { normal: inprogressBadgeNormal, active: inprogressBadgeActive, left: 31, top: 9 },
  },
  approved: {
    icon: { normal: approvedGlyphNormal, active: approvedGlyphActive, left: 8, top: 5 },
    badge: { normal: approvedBadgeNormal, active: approvedBadgeActive, left: 27, top: 9 },
  },
};

export interface ClusterStatusCardsProps {
  activeTab: ClusterPlanTabKey;
  counts: Record<ClusterPlanTabKey, number>;
  onChange: (tab: ClusterPlanTabKey) => void;
}

export function ClusterStatusCards({ activeTab, counts, onChange }: ClusterStatusCardsProps) {
  const { t } = useTranslation('clustering');

  return (
    <div className={tabs.tabs} role="tablist" aria-label={t('tabs.label')}>
      {TABS.map((tab) => {
        const { icon, badge } = ICONS[tab];
        return (
          <StatusTabCard
            key={tab}
            label={t(`tabs.${tab}`)}
            count={String(counts[tab] ?? 0).padStart(2, '0')}
            countLabel={t('tabs.count', { count: counts[tab] ?? 0 })}
            selected={tab === activeTab}
            theme={THEMES[tab]}
            icon={icon}
            badge={badge}
            onClick={() => onChange(tab)}
          />
        );
      })}
    </div>
  );
}
