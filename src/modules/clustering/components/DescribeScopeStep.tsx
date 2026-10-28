import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAIChat } from '@shared/context';
import { Switch } from '@shared/components/vendor/impact-ui';
import { visuallyHiddenClass } from '@shared/a11y';
import sparkleIcon from '@assets/icons/hindsight/ai-sparkle-gradient.svg';
import techPattern from '@assets/icons/clustering/describe-tech-pattern.png';
import bulkInfoIcon from '@assets/icons/clustering/describe-bulk-info.svg';
import noticeInfoIcon from '@assets/icons/clustering/describe-info.svg';
import { AgentSectionStatus } from './AgentSectionStatus';
import agentFlow from './agentFlow.module.css';
import styles from './describeScope.module.css';

export interface DescribeScopeStepProps {
  /** Fires once the query has been handed to the agent (not on validation failures). */
  onGenerate?: () => void;
  /** Agent is working and this step is still the one on screen. */
  processing?: boolean;
}

/**
 * Describe & Scope — first step of the agentic create flow.
 * Generate Plan opens the shared Ask Iris panel and sends this query directly.
 */
export function DescribeScopeStep({
  onGenerate,
  processing = false,
}: DescribeScopeStepProps = {}) {
  const { t } = useTranslation('clustering');
  const { submitDescribeQuery } = useAIChat();
  const promptId = useId();
  const errorId = useId();
  const [prompt, setPrompt] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const submittedRef = useRef<string | null>(null);

  const generate = () => {
    const query = prompt.trim();
    if (!query) {
      setQueryError(t('describe.queryRequired'));
      return;
    }
    if (submittedRef.current === query) return;
    submittedRef.current = query;
    setQueryError(null);
    const accepted = submitDescribeQuery({ query });
    if (!accepted) {
      submittedRef.current = null;
      return;
    }
    onGenerate?.();
  };

  return (
    <div className={styles.step} data-testid="describe-scope-step">
      <img src={techPattern} alt="" aria-hidden="true" className={styles.backdrop} />
      <section
        className={[styles.panel, processing ? agentFlow.sectionGlow : '']
          .filter(Boolean)
          .join(' ')}
        aria-labelledby={`${promptId}-title`}
        data-highlighted={processing ? 'true' : undefined}
      >
        {processing ? <AgentSectionStatus /> : null}
        <div className={styles.panelHead}>
          <div className={styles.headingRow}>
            <h2 id={`${promptId}-title`} className={styles.title}>
              {t('describe.panelTitle')}
            </h2>
            <p className={styles.hint}>{t('describe.panelHint')}</p>
            <img src={sparkleIcon} alt="" aria-hidden="true" className={styles.sparkle} />
          </div>
          <div className={styles.bulk} data-testid="describe-bulk-creation">
            <span className={styles.bulkLabel}>
              <span className={styles.bulkText}>{t('describe.bulk')}</span>
              <img
                className={styles.bulkInfo}
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
        <div className={styles.field}>
          <label htmlFor={promptId} className={visuallyHiddenClass}>
            {t('describe.promptLabel')}
          </label>
          <input
            id={promptId}
            className={styles.input}
            type="text"
            value={prompt}
            placeholder={t('describe.placeholder')}
            aria-invalid={queryError !== null}
            aria-describedby={queryError ? errorId : undefined}
            onChange={(event) => {
              setPrompt(event.target.value);
              if (queryError) setQueryError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                generate();
              }
            }}
          />
          <button type="button" className={styles.generate} onClick={generate}>
            <img
              src={sparkleIcon}
              alt=""
              aria-hidden="true"
              className={styles.generateIcon}
              width={16}
              height={16}
            />
            {t('describe.generate')}
          </button>
        </div>
        {queryError ? (
          <p id={errorId} className={styles.error} role="alert">
            {queryError}
          </p>
        ) : null}
      </section>
      <p className={styles.notice}>
        <img
          src={noticeInfoIcon}
          alt=""
          aria-hidden="true"
          className={styles.noticeIcon}
          width={14}
          height={14}
        />
        {t('describe.notice')}
      </p>
    </div>
  );
}
