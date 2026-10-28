import { useTranslation } from 'react-i18next';
import type { PipelineStagePreview } from '../../types';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import waveBgSvg from '@assets/icons/planning/review-wave-bg.svg';
import stageActiveBgSvg from '@assets/icons/planning/stage-active-bg.svg';
import connectorLineSvg from '@assets/icons/planning/stage-connector-line.svg';
import stageArrowGif from '@assets/icons/planning/stage-arrow.gif';
import agentBadgeIconSvg from '@assets/icons/planning/agent-badge-icon.svg';
import styles from './AgentPreview.module.css';

export interface AgentPreviewProps {
  stages: PipelineStagePreview[];
}

export function AgentPreview({ stages }: AgentPreviewProps) {
  const { t } = useTranslation('planning');

  if (stages.length === 0) {
    return (
      <p className={styles.empty} data-testid="create-plan-agent-preview-empty">
        {t('agent.selectScenarioFirst')}
      </p>
    );
  }

  const minInnerWidth = 24 + stages.length * 284 + (stages.length - 1) * 27 + 24;

  return (
    <section
      className={styles.preview}
      aria-label={t('agent.title')}
      data-testid="create-plan-agent-preview"
    >
      <div className={styles.previewInner} style={{ minWidth: minInnerWidth }}>
        {/* Wave background */}
        <div className={styles.waveBg}>
          <img
            src={waveBgSvg}
            alt=""
            aria-hidden="true"
            className={styles.waveBgImg}
          />
        </div>

        {/* Dashed connector line */}
        <div className={styles.connectorLine} style={{ width: Math.max(0, (stages.length - 1) * 311) }}>
          <img
            src={connectorLineSvg}
            alt=""
            aria-hidden="true"
            className={styles.connectorLineImg}
          />
        </div>

        {/* Arrow between stage 1 and 2 */}
        {stages.length > 1 && (
          <div className={styles.stageArrow}>
            <img
              src={stageArrowGif}
              alt=""
              aria-hidden="true"
              className={styles.stageArrowImg}
            />
          </div>
        )}

        {/* Stage cards */}
        <ol className={styles.stagesRow} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {stages.map((stage, idx) => {
            const isActive = idx === 0;
            const meta = t('agent.stageMeta', {
              scenario: stage.scenarioName,
              pct: stage.confidencePct,
            });

            return (
              <li
                key={stage.order}
                className={isActive ? styles.stageCardActive : styles.stageCardInactive}
                data-testid={`create-plan-agent-stage-${stage.order}`}
              >
                {/* Card background */}
                {isActive ? (
                  <img
                    src={stageActiveBgSvg}
                    alt=""
                    aria-hidden="true"
                    className={styles.stageActiveBg}
                  />
                ) : (
                  <div className={styles.stageInactiveBg} />
                )}

                {/* Content */}
                <div className={styles.stageContent}>
                  <div className={styles.stageTitleRow}>
                    <span className={isActive ? styles.stageBadgeActive : styles.stageBadgeInactive}>
                      <span className={styles.stageBadgeNumber}>{stage.order}</span>
                    </span>
                    <span className={isActive ? styles.stageLabelActive : styles.stageLabelInactive}>
                      {stage.label}
                    </span>
                  </div>
                  <span className={isActive ? styles.stageMetaActive : styles.stageMetaInactive}>
                    {meta}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* "What The Agent Will Do" gradient badge */}
        <div className={styles.agentBadge}>
          <img
            src={agentBadgeIconSvg}
            alt=""
            aria-hidden="true"
            className={styles.agentBadgeIcon}
          />
          <Tooltip title={t('agent.title')} variant="tertiary">
            <span className={styles.agentBadgeText}>{t('agent.title')}</span>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
