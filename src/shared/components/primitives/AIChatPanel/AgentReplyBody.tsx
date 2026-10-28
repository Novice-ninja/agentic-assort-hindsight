import { useCallback, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgentFileData, AgentResult, AgentTableData } from '@shared/services/agentWs';
import { downloadAgentFile } from '@shared/services/agentWs';
import { decodeIaString } from '@shared/utils/format';
import { IconButton } from '../IconButton';
import { AgentReplyChart } from './AgentReplyChart';
import { formatAgentCell } from './agentResultFormat';
import { prepareAgentReplyHtml } from './agentReplyHtml';
import { ReplyViewToggle } from './ReplyViewToggle';
import {
  groupReplyBlocks,
  readReplyViewSelection,
  resolveReplyView,
  writeReplyViewSelection,
  type ReplyViewId,
} from './replyViewGroups';
import styles from './AgentReplyBody.module.css';

export interface AgentReplyBodyProps {
  result: AgentResult[];
  /** Shown when the agent finished without anything renderable. */
  fallbackText: string;
  /** Bare prose from the done frame, used only when every text block is empty. */
  feedback?: string;
  emptyChartLabel: string;
  emptyTableLabel: string;
  chartDataCaption: (title: string) => string;
  /** Stable id for this reply so the selected view survives remounts. */
  replyId?: string;
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 11L4.25 7.25L5.3 6.1625L7.25 8.1125V2H8.75V8.1125L10.7 6.1625L11.75 7.25L8 11ZM3.5 14C3.0875 14 2.73438 13.8531 2.44063 13.5594C2.14687 13.2656 2 12.9125 2 12.5V10.25H3.5V12.5H12.5V10.25H14V12.5C14 12.9125 13.8531 13.2656 13.5594 13.5594C13.2656 13.8531 12.9125 14 12.5 14H3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AgentReplyFile({ file }: { file: AgentFileData }) {
  const { t } = useTranslation('common');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const onDownload = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await downloadAgentFile(file);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }, [busy, file]);

  const label = t('iris.downloadFile', {
    defaultValue: 'Download {{filename}}',
    filename: file.filename,
  });

  return (
    <div className={styles.fileRow} data-testid="iris-reply-file">
      <span className={styles.fileName} title={file.filename}>
        {file.filename}
      </span>
      <IconButton
        size="small"
        aria-label={label}
        aria-busy={busy || undefined}
        disabled={busy}
        data-testid="iris-reply-file-download"
        onClick={() => {
          void onDownload();
        }}
      >
        <DownloadIcon />
      </IconButton>
      {failed ? (
        <span className={styles.fileError} role="status">
          {t('iris.downloadFailed', 'Download failed. Try again.')}
        </span>
      ) : null}
    </div>
  );
}

function AgentReplyTable({
  data,
  emptyLabel,
}: {
  data: AgentTableData;
  emptyLabel: string;
}) {
  if (data.columns.length === 0 || data.rows.length === 0) {
    return <p className={styles.fallback}>{emptyLabel}</p>;
  }

  return (
    <div className={styles.tableWrap} data-testid="iris-reply-table">
      <table className={styles.table}>
        {data.title !== undefined && data.title.length > 0 ? (
          <caption className={styles.tableCaption}>{decodeIaString(data.title)}</caption>
        ) : null}
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column.key} scope="col">
                {decodeIaString(column.header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {data.columns.map((column) => (
                <td key={column.key}>
                  {formatAgentCell(row[column.key], column.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgentReplyText({ html, fallbackText }: { html: string; fallbackText: string }) {
  if (html.length === 0) {
    return <p className={styles.fallback}>{fallbackText}</p>;
  }

  return (
    <div
      className={styles.body}
      data-testid="iris-reply-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function AgentReplyBlock({
  block,
  fallbackText,
  emptyChartLabel,
  emptyTableLabel,
  chartDataCaption,
}: {
  block: AgentResult;
  fallbackText: string;
  emptyChartLabel: string;
  emptyTableLabel: string;
  chartDataCaption: (title: string) => string;
}) {
  if (block.content_type === 'chart') {
    return (
      <AgentReplyChart
        data={block.data}
        emptyLabel={emptyChartLabel}
        dataTableCaption={chartDataCaption(block.data.title)}
      />
    );
  }

  if (block.content_type === 'table') {
    return <AgentReplyTable data={block.data} emptyLabel={emptyTableLabel} />;
  }

  if (block.content_type === 'file') {
    return <AgentReplyFile file={block.data} />;
  }

  return (
    <AgentReplyText
      html={prepareAgentReplyHtml(block.data)}
      fallbackText={fallbackText}
    />
  );
}

function renderBlocks(
  blocks: readonly AgentResult[],
  labels: Pick<
    AgentReplyBodyProps,
    'fallbackText' | 'emptyChartLabel' | 'emptyTableLabel' | 'chartDataCaption'
  >,
) {
  if (blocks.length === 1) {
    return (
      <AgentReplyBlock
        block={blocks[0]}
        fallbackText={labels.fallbackText}
        emptyChartLabel={labels.emptyChartLabel}
        emptyTableLabel={labels.emptyTableLabel}
        chartDataCaption={labels.chartDataCaption}
      />
    );
  }

  return (
    <div className={styles.stack} data-testid="iris-reply-stack">
      {blocks.map((block, index) => (
        <AgentReplyBlock
          key={`${block.content_type}-${index}`}
          block={block}
          fallbackText={labels.fallbackText}
          emptyChartLabel={labels.emptyChartLabel}
          emptyTableLabel={labels.emptyTableLabel}
          chartDataCaption={labels.chartDataCaption}
        />
      ))}
    </div>
  );
}

function renderFileAttachments(files: readonly AgentFileData[]) {
  if (files.length === 0) return null;
  return (
    <div className={styles.files} data-testid="iris-reply-files">
      {files.map((file) => (
        <AgentReplyFile key={`${file.url}-${file.filename}`} file={file} />
      ))}
    </div>
  );
}

/**
 * Renders one agent reply. Mixed types get a per-card view toggle; a single
 * type still stacks its blocks vertically as before.
 *
 * File attachments always sit under the selected view so a CSV download stays
 * reachable when text and charts share a toggle.
 *
 * Chart markup is never injected as HTML — it goes through `AgentReplyChart`
 * and the shared chart adapter. HTML tables inside a text block are sanitised
 * and styled as descendants of the text body.
 */
export function AgentReplyBody({
  result,
  fallbackText,
  feedback,
  emptyChartLabel,
  emptyTableLabel,
  chartDataCaption,
  replyId,
}: AgentReplyBodyProps) {
  const { t } = useTranslation('common');
  const uid = useId();
  const [preferred, setPreferred] = useState<ReplyViewId | undefined>(() =>
    replyId ? readReplyViewSelection(replyId) : undefined,
  );

  const blocks = useMemo(
    () =>
      result.filter(
        (block) => !(block.content_type === 'text' && block.data.trim().length === 0),
      ),
    [result],
  );
  const fileBlocks = useMemo(
    () => blocks.filter((block): block is { content_type: 'file'; data: AgentFileData } =>
      block.content_type === 'file',
    ),
    [blocks],
  );
  const viewBlocks = useMemo(
    () => blocks.filter((block) => block.content_type !== 'file'),
    [blocks],
  );
  const groups = useMemo(() => groupReplyBlocks(viewBlocks), [viewBlocks]);
  const selected = resolveReplyView(groups, preferred);
  const selectedGroup = groups.find((group) => group.id === selected);
  const files = fileBlocks.map((block) => block.data);

  const labels = { fallbackText, emptyChartLabel, emptyTableLabel, chartDataCaption };

  if (viewBlocks.length === 0 && files.length === 0) {
    return (
      <AgentReplyText
        html={prepareAgentReplyHtml(feedback)}
        fallbackText={fallbackText}
      />
    );
  }

  if (viewBlocks.length === 0) {
    return renderFileAttachments(files);
  }

  if (groups.length < 2 || selected === null || selectedGroup === undefined) {
    return (
      <>
        {renderBlocks(viewBlocks, labels)}
        {renderFileAttachments(files)}
      </>
    );
  }

  const tabId = (id: ReplyViewId) => `iris-reply-tab-${uid}-${id}`;
  const panelId = (id: ReplyViewId) => `iris-reply-panel-${uid}-${id}`;

  return (
    <div className={styles.viewed} data-testid="iris-reply-views-root">
      <ReplyViewToggle
        views={groups.map((group) => {
          const label = t(`iris.replyView.${group.id}`);
          return {
            id: group.id,
            label:
              group.blocks.length > 1
                ? t('iris.replyView.withCount', { label, count: group.blocks.length })
                : label,
          };
        })}
        selected={selected}
        onSelect={(id) => {
          setPreferred(id);
          if (replyId) writeReplyViewSelection(replyId, id);
        }}
        ariaLabel={t('iris.replyView.viewsLabel')}
        tabId={tabId}
        panelId={panelId}
      />
      <div
        role="tabpanel"
        id={panelId(selected)}
        aria-labelledby={tabId(selected)}
        className={styles.panel}
      >
        {renderBlocks(selectedGroup.blocks, labels)}
        {renderFileAttachments(files)}
      </div>
    </div>
  );
}
