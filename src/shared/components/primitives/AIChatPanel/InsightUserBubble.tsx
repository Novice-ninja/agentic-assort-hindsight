import { createElement } from 'react';
import type { ChatMessage } from '@shared/components/vendor/impact-ui';
import { chatMessageTimeFields } from './chatTimeStamp';
import styles from './InsightUserBubble.module.css';

export interface InsightBubbleContent {
  titleHtml: string;
  bodyHtml: string;
}

/**
 * Styled user bubble for Season Narrative → Ask Iris.
 * Impact UI renders user messages from `bodyText` (ReactNode), not `jsx`.
 */
export function buildInsightUserMessage(content: InsightBubbleContent): ChatMessage {
  const children = [];
  if (content.titleHtml.trim().length > 0) {
    children.push(
      createElement('div', {
        className: styles.title,
        dangerouslySetInnerHTML: { __html: content.titleHtml },
      }),
    );
  }
  if (content.bodyHtml.trim().length > 0) {
    children.push(
      createElement('div', {
        className: styles.body,
        dangerouslySetInnerHTML: { __html: content.bodyHtml },
      }),
    );
  }

  return {
    userType: 'user',
    bodyType: 'text',
    ...chatMessageTimeFields(),
    bodyText: createElement(
      'div',
      { className: styles.bubble, 'data-testid': 'iris-insight-user-bubble' },
      ...children,
    ),
  };
}

export function buildPlainUserMessage(text: string): ChatMessage {
  return {
    userType: 'user',
    bodyType: 'text',
    bodyText: text,
    ...chatMessageTimeFields(),
  };
}
