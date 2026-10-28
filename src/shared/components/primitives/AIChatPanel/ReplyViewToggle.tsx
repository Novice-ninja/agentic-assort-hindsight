import { useRef, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../IconButton';
import { Tooltip } from '../Tooltip';
import { ReplyViewIcon } from './replyViewIcons';
import type { ReplyViewId } from './replyViewGroups';
import styles from './ReplyViewToggle.module.css';

export interface ReplyViewToggleItem {
  id: ReplyViewId;
  label: string;
}

export interface ReplyViewToggleProps {
  views: readonly ReplyViewToggleItem[];
  selected: ReplyViewId;
  onSelect: (id: ReplyViewId) => void;
  ariaLabel: string;
  tabId: (id: ReplyViewId) => string;
  panelId: (id: ReplyViewId) => string;
}

export function ReplyViewToggle({
  views,
  selected,
  onSelect,
  ariaLabel,
  tabId,
  panelId,
}: ReplyViewToggleProps) {
  const { i18n } = useTranslation('common');
  const rtl = i18n.dir() === 'rtl';
  const tabRefs = useRef(new Map<ReplyViewId, HTMLButtonElement>());

  function moveFocus(next: ReplyViewId) {
    onSelect(next);
    tabRefs.current.get(next)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const ids = views.map((view) => view.id);
    const index = ids.indexOf(selected);
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next: ReplyViewId | undefined;

    if (event.key === forward) {
      next = ids[(index + 1) % ids.length];
    } else if (event.key === backward) {
      next = ids[(index - 1 + ids.length) % ids.length];
    } else if (event.key === 'Home') {
      next = ids[0];
    } else if (event.key === 'End') {
      next = ids[ids.length - 1];
    }

    if (next === undefined) return;
    event.preventDefault();
    moveFocus(next);
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label={ariaLabel} data-testid="iris-reply-views">
      {views.map((view) => {
        const isSelected = view.id === selected;
        return (
          <Tooltip key={view.id} content={view.label}>
            <IconButton
              ref={(node) => {
                if (node === null) tabRefs.current.delete(view.id);
                else tabRefs.current.set(view.id, node);
              }}
              size="small"
              role="tab"
              id={tabId(view.id)}
              className={[styles.tab, isSelected ? styles.tabSelected : '']
                .filter(Boolean)
                .join(' ')}
              aria-label={view.label}
              aria-selected={isSelected}
              aria-controls={panelId(view.id)}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(view.id)}
              onKeyDown={onKeyDown}
            >
              <span className={styles.icon}>
                <ReplyViewIcon view={view.id} />
              </span>
            </IconButton>
          </Tooltip>
        );
      })}
    </div>
  );
}
