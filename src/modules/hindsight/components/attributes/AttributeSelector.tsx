import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusTabCard } from '@shared/components/primitives/StatusTabCard';
import type { StatusTabCardTheme, StatusTabCardLayer } from '@shared/components/primitives/StatusTabCard';
import { useLabel } from '../../hooks';
import type { AttributeDefinition } from '../../types';
import styles from './AttributeSelector.module.css';

import brandGlyphNormal from '@assets/icons/hindsight/status-tabs/brand-glyph-normal.png';
import brandGlyphActive from '@assets/icons/hindsight/status-tabs/brand-glyph-active.png';
import colourGlyphNormal from '@assets/icons/hindsight/status-tabs/colour-glyph-normal.png';
import colourGlyphActive from '@assets/icons/hindsight/status-tabs/colour-glyph-active.png';
import collarGlyphNormal from '@assets/icons/hindsight/status-tabs/collar-glyph-normal.png';
import collarGlyphActive from '@assets/icons/hindsight/status-tabs/collar-glyph-active.png';
import necklineGlyphNormal from '@assets/icons/hindsight/status-tabs/neckline-glyph-normal.png';
import necklineGlyphActive from '@assets/icons/hindsight/status-tabs/neckline-glyph-active.png';
import sleeveLengthGlyphNormal from '@assets/icons/hindsight/status-tabs/sleeve-length-glyph-normal.png';
import sleeveLengthGlyphActive from '@assets/icons/hindsight/status-tabs/sleeve-length-glyph-active.png';

const SKELETON_COUNT = 5;

export interface AttributeSelectorProps {
  attributes: AttributeDefinition[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

const ATTRIBUTE_THEMES: Record<string, StatusTabCardTheme> = {
  brand: { accent: '#cff0f8', border: '#20accf', surface: '#e9f7fc' },
  colour: { accent: '#f0dffb', border: '#ae57ea', surface: '#f6edfd' },
  collar: { accent: '#dddfd3', border: '#aaac8e', surface: '#edede7' },
  neckline: { accent: '#f8e5d3', border: '#e29c55', surface: '#fbf2e9' },
  'sleeve-length': { accent: '#c4e8d5', border: '#3bb273', surface: '#ebf7f1' },
};

const ATTRIBUTE_ICONS: Record<string, StatusTabCardLayer> = {
  brand: { normal: brandGlyphNormal, active: brandGlyphActive, left: 10, top: 4 },
  colour: { normal: colourGlyphNormal, active: colourGlyphActive, left: 10, top: 3 },
  collar: { normal: collarGlyphNormal, active: collarGlyphActive, left: 10, top: 3 },
  neckline: { normal: necklineGlyphNormal, active: necklineGlyphActive, left: 8, top: 5 },
  'sleeve-length': { normal: sleeveLengthGlyphNormal, active: sleeveLengthGlyphActive, left: 8, top: 5 },
};

const DEFAULT_THEME: StatusTabCardTheme = { accent: '#cff0f8', border: '#20accf', surface: '#e9f7fc' };
const DEFAULT_ICON: StatusTabCardLayer = { normal: brandGlyphNormal, active: brandGlyphActive, left: 10, top: 4 };

const COUNT_BY_ATTRIBUTE: Record<string, string> = {
  brand: '09',
  colour: '03',
  collar: '03',
  neckline: '01',
  'sleeve-length': '02',
};

export function displayLabel(value: string, id: string): string {
  if (id === 'brand') return 'Brands';
  if (id === 'colour') return 'Color';
  if (id === 'sleeve-length') return 'Sleeve Length';
  return value;
}

/**
 * The attribute a planner is analysing.
 *
 * A real tab list rather than a row of buttons: one arrow key moves between attributes and
 * only the selected chip is in the tab sequence, so reaching the widgets below never means
 * tabbing through every attribute first.
 */
export function AttributeSelector({ attributes, activeId, onSelect, loading }: AttributeSelectorProps) {
  const { t, i18n } = useTranslation('hindsight');
  const label = useLabel();
  const listRef = useRef<HTMLDivElement>(null);
  const rtl = i18n.dir() === 'rtl';

  function focusTab(index: number) {
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]').item(index)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (attributes.length === 0) return;

    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';

    const current = attributes.findIndex((attribute) => attribute.id === activeId);
    const from = current === -1 ? 0 : current;

    let next: number;
    if (event.key === forward) {
      next = (from + 1) % attributes.length;
    } else if (event.key === backward) {
      next = (from - 1 + attributes.length) % attributes.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = attributes.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onSelect(attributes[next].id);
    focusTab(next);
  }

  if (loading) {
    return (
      <div
        className={styles.skeletonTabs}
        role="status"
        aria-label={t('states.loading')}
        data-testid="hindsight-attribute-selector"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={`skel-${i}`} className={styles.skeletonCard} aria-hidden="true">
            <div className={styles.skeletonContent}>
              <div className={[styles.skeletonIcon, styles.skeletonBone].join(' ')} />
              <div className={[styles.skeletonLabel, styles.skeletonBone].join(' ')} />
            </div>
            <div className={[styles.skeletonCount, styles.skeletonBone].join(' ')} />
          </div>
        ))}
        <span className={styles.visuallyHidden}>{t('states.loading')}</span>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className={styles.tabs}
      role="tablist"
      aria-label={t('attributes.selectorLabel')}
      data-testid="hindsight-attribute-selector"
    >
      {attributes.map((attribute) => {
        const selected = attribute.id === activeId;
        const theme = ATTRIBUTE_THEMES[attribute.id] ?? DEFAULT_THEME;
        const icon = ATTRIBUTE_ICONS[attribute.id] ?? DEFAULT_ICON;
        const countStr = COUNT_BY_ATTRIBUTE[attribute.id] ?? String(attribute.valueCount).padStart(2, '0');

        return (
          <StatusTabCard
            key={attribute.id}
            label={displayLabel(label(attribute.labelKey), attribute.id)}
            count={countStr}
            countLabel={t('attributes.count', { count: attribute.valueCount })}
            selected={selected}
            theme={theme}
            icon={icon}
            onClick={() => onSelect(attribute.id)}
            onKeyDown={onKeyDown}
            tabIndex={selected ? 0 : -1}
            data-testid={`hindsight-attribute-tab-${attribute.id}`}
          />
        );
      })}
    </div>
  );
}
