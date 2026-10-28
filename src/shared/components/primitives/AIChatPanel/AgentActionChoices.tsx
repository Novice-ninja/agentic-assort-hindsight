import { useContext, useState } from 'react';
import { Button } from '@shared/components/vendor/impact-ui';
import { decodeIaString } from '@shared/utils/format';
import type { AgentActionOption } from '@shared/services/agentWs';
import { FollowUpSendLockContext } from './FollowUpSuggestions';
import styles from './AgentActionChoices.module.css';

export const AGENT_ACTION_MESSAGE_BODY_TYPE = 'actions';

export function isAgentActionMessage(bodyType: string | undefined): boolean {
  return bodyType === AGENT_ACTION_MESSAGE_BODY_TYPE;
}

export interface AgentActionChoicesProps {
  actions: readonly AgentActionOption[];
  label: string;
  onSelect: (action: AgentActionOption) => void;
}

/**
 * Options from an agent `done` frame. Rendered with Impact UI buttons in a
 * horizontal row inside the reply, above the vendor like/dislike icons.
 */
export function AgentActionChoices({
  actions,
  label,
  onSelect,
}: AgentActionChoicesProps) {
  const sendLocked = useContext(FollowUpSendLockContext);
  const [chosenId, setChosenId] = useState<string | null>(null);
  if (actions.length === 0) return null;

  const isDisabled = sendLocked || chosenId !== null;

  return (
    <div
      className={styles.row}
      data-testid="iris-actions"
      data-layout="horizontal"
      role="group"
      aria-label={label}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant ?? 'secondary'}
          size="small"
          type="default"
          htmlType="button"
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            setChosenId(action.id);
            onSelect(action);
          }}
        >
          {decodeIaString(action.label)}
        </Button>
      ))}
    </div>
  );
}
