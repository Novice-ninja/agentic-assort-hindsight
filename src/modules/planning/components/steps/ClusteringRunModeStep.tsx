import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactBadge as Badge } from '@shared/components/vendor/impact-ui';
import { focusRingClass, useId } from '@shared/a11y';
import {
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  type ClusteringScenario,
  type ClusteringTag,
  type PlanDraft,
  type RunMode,
  type SegmentBadge,
} from '../../types';
import styles from './wizardSteps.module.css';
import revenueTieredIcon from '@assets/icons/planning/revenue-tiered-icon.png';
import formatGeographyIcon from '@assets/icons/planning/format-geography-icon.png';
import stPerformanceIcon from '@assets/icons/planning/st-performance-icon.png';
import gatedModeIcon from '@assets/icons/planning/gated-mode-icon.png';
import autonomousIcon from '@assets/icons/planning/autonomous-icon.png';

export interface ClusteringRunModeStepProps {
  draft: PlanDraft;
  scenarios: ClusteringScenario[];
  update: (patch: Partial<PlanDraft>) => void;
}

const SCENARIO_ICONS: Record<string, string> = {
  'cs-revenue': revenueTieredIcon,
  'cs-format': formatGeographyIcon,
  'cs-st': stPerformanceIcon,
};

const SCENARIO_ICON_BG: Record<string, string> = {
  'cs-revenue': '#FFFBE5',
  'cs-format': '#F5F9EC',
  'cs-st': '#ECEEFD',
};

const SCENARIO_CONF_COLOR: Record<string, string> = {
  'cs-revenue': '#26734B',
  'cs-format': '#9D831C',
  'cs-st': '#9D831C',
};

type BadgeColor = 'info' | 'success' | 'warning' | 'error' | undefined;

const TAG_BADGE_COLOR: Record<ClusteringTag, BadgeColor> = {
  recommended: 'info',
  alternative: undefined,
  experimental: undefined,
};

const RUN_MODE_ICONS: Record<RunMode, string> = {
  gated: gatedModeIcon,
  autonomous: autonomousIcon,
};

const RUN_MODE_ICON_BG: Record<RunMode, string> = {
  gated: '#E9F7FC',
  autonomous: '#FCF8EA',
};

const RUN_MODES: RunMode[] = ['gated', 'autonomous'];

const SEGMENT_BADGE_COLOR: Record<string, BadgeColor> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  default: undefined,
};

/* Pixel-perfect confidence slider matching the Figma design exactly */
interface ConfidenceMark {
  value: number;
  label: string;
}
interface ConfidenceSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  marks?: ConfidenceMark[];
  disabled?: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function ConfidenceSlider({
  label,
  min,
  max,
  value,
  onChange,
  marks = [],
  disabled = false,
}: ConfidenceSliderProps) {
  const labelId = useId('conf-label');
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const pct = ((clamp(value, min, max) - min) / (max - min)) * 100;
  const set = useCallback(
    (v: number) => onChange(clamp(v, min, max)),
    [onChange, min, max],
  );

  const computeValue = useCallback(
    (clientX: number) => {
      const rect = trackRef.current!.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + ratio * (max - min));
    },
    [min, max],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
      set(computeValue(e.clientX));
    },
    [disabled, computeValue, set],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !dragging) return;
      set(computeValue(e.clientX));
    },
    [disabled, dragging, computeValue, set],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        set(value + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        set(value - 1);
        break;
      case 'PageUp':
        e.preventDefault();
        set(value + 10);
        break;
      case 'PageDown':
        e.preventDefault();
        set(value - 10);
        break;
      case 'Home':
        e.preventDefault();
        set(min);
        break;
      case 'End':
        e.preventDefault();
        set(max);
        break;
      default:
    }
  };

  return (
    <div className={styles.confidenceSection} data-testid="create-plan-confidence-slider">
      <div className={styles.confidenceHeader}>
        <span id={labelId} className={styles.confidenceLabel}>
          {label}
        </span>
        <span className={styles.confidenceValue}>{value}%</span>
      </div>
      <div
        ref={trackRef}
        className={[styles.confidenceTrack, dragging && styles.confidenceTrackDragging]
          .filter(Boolean)
          .join(' ')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        // `disabled` is not valid on a div — dim + block interaction instead.
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        aria-disabled={disabled || undefined}
      >
        <div
          className={styles.confidenceLeftTrack}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        <div
          className={styles.confidenceThumb}
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-labelledby={labelId}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}%`}
          onKeyDown={onKeyDown}
          data-testid="create-plan-confidence-thumb"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" fill="white" stroke="#4259EE" strokeWidth="4" />
          </svg>
        </div>
        <div
          className={styles.confidenceRightTrack}
          style={{ width: `${100 - pct}%` }}
          aria-hidden="true"
        />
      </div>
      {marks.length > 0 && (
        <div className={styles.confidenceMarks}>
          {marks.map((m) => (
            <button
              key={m.value}
              type="button"
              className={styles.confidenceMark}
              onClick={() => set(m.value)}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden="true"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClusteringRunModeStep({
  draft,
  scenarios,
  update,
}: ClusteringRunModeStepProps) {
  const { t } = useTranslation('planning');

  return (
    <div className={styles.step} data-testid="create-plan-clustering">
      {/* Store Clustering Scenario */}
      <div className={styles.sectionWrapper}>
        <span className={styles.sectionTitle}>{t('clustering.scenario')}</span>
        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label={t('clustering.scenario')}
          data-testid="create-plan-scenario-group"
        >
          {scenarios.map((scenario) => {
            const selected = scenario.id === draft.clusteringScenarioId;
            const iconSrc = scenario.iconUrl
              ? SCENARIO_ICONS[scenario.id] || scenario.iconUrl
              : SCENARIO_ICONS[scenario.id];
            const iconBg = scenario.iconBg || SCENARIO_ICON_BG[scenario.id] || '#ECEEFD';
            const confColor =
              scenario.confidenceColor || SCENARIO_CONF_COLOR[scenario.id] || '#9D831C';
            const segments: SegmentBadge[] =
              scenario.segments ||
              scenario.segmentBreakdown.split(',').map((s) => ({ label: s.trim() }));

            return (
              <button
                key={scenario.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={[
                  styles.scenarioCard,
                  selected && styles.selected,
                  focusRingClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => update({ clusteringScenarioId: scenario.id })}
                data-testid={`create-plan-scenario-${scenario.id}`}
              >
                {/* Row 1: icon + content + radio */}
                <div className={styles.scenarioTopRow}>
                  {iconSrc && (
                    <div
                      className={styles.scenarioIconWrap}
                      style={{ backgroundColor: iconBg }}
                    >
                      <img
                        src={iconSrc}
                        alt=""
                        className={styles.scenarioIconImg}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className={styles.scenarioContent}>
                    <div className={styles.scenarioTitleRow}>
                      <span className={styles.scenarioNameConfidence}>
                        <span className={styles.scenarioName}>{scenario.name} </span>
                        <span
                          className={styles.confidenceText}
                          style={{ color: confColor }}
                        >
                          ({scenario.confidencePct}% Congf)
                        </span>
                      </span>
                      <Badge
                        label={t(`clusteringTags.${scenario.tag}`)}
                        color={TAG_BADGE_COLOR[scenario.tag]}
                        variant="subtle"
                        size="small"
                      />
                    </div>
                    <span className={styles.scenarioDesc}>{scenario.description}</span>
                  </div>
                  <div
                    className={[styles.radioCircle, selected && styles.checked]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  />
                </div>

                {/* Row 2: segment badges */}
                <div className={styles.segmentRow}>
                  {segments.map((seg) => (
                    <Badge
                      key={seg.label}
                      label={seg.label}
                      color={SEGMENT_BADGE_COLOR[seg.color || 'default']}
                      variant="subtle"
                      size="small"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Run Mode */}
      <div className={styles.sectionWrapper}>
        <span className={styles.sectionTitle}>{t('clustering.runMode')}</span>
        <div
          className={styles.modeRow}
          role="radiogroup"
          aria-label={t('clustering.runMode')}
          data-testid="create-plan-run-mode-group"
        >
          {RUN_MODES.map((mode) => {
            const selected = mode === draft.runMode;
            return (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={selected}
                className={[
                  styles.runModeCard,
                  selected && styles.selected,
                  focusRingClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => update({ runMode: mode })}
                data-testid={`create-plan-run-mode-${mode}`}
                disabled={mode === 'autonomous'} // TODO: Remove this once the agentic mode is implemented
              >
                <div
                  className={styles.runModeIconWrap}
                  style={{ backgroundColor: RUN_MODE_ICON_BG[mode] }}
                >
                  <img
                    src={RUN_MODE_ICONS[mode]}
                    alt=""
                    className={styles.runModeIconImg}
                    aria-hidden="true"
                  />
                </div>
                <div className={styles.runModeContent}>
                  <div className={styles.runModeTitleRow}>
                    <span className={styles.runModeName}>
                      {t(`runModes.${mode}.title`)}
                    </span>
                    {mode === 'gated' && (
                      <Badge
                        label={t('clusteringTags.recommended')}
                        color="info"
                        variant="subtle"
                        size="small"
                      />
                    )}
                  </div>
                  <span className={styles.runModeDesc}>
                    {t(`runModes.${mode}.description`)}
                  </span>
                </div>
                <div
                  className={[styles.radioCircle, selected && styles.checked]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Confidence Threshold */}
      <ConfidenceSlider
        label={t('clustering.confidenceThreshold')}
        min={CONFIDENCE_MIN}
        max={CONFIDENCE_MAX}
        value={draft.confidenceThreshold}
        onChange={(value) => update({ confidenceThreshold: value })}
        marks={[
          { value: 60, label: t('clustering.marks.autonomous') },
          { value: 80, label: t('clustering.marks.recommended') },
          { value: 95, label: t('clustering.marks.strict') },
        ]}
        disabled={draft.runMode === 'gated'}
      />
    </div>
  );
}
