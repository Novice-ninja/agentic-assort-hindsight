import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components/vendor/impact-ui';

export type CopilotPresentation = 'expanded' | 'minimized';

const HEADER_ACTIONS = '.chatbot-modal-wrapper .right_close_save_icon_container';
const ICON_BASE =
  'https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons';
const COLLAPSE_ICON = `${ICON_BASE}/Collapse.svg`;
const EXPAND_ICON = `${ICON_BASE}/expand-icon.svg`;

export interface DescribeCopilotChromeProps {
  presentation: CopilotPresentation;
  onToggle: () => void;
}

/**
 * Minimize/maximize for Describe Your Plan. Portals into the existing chat header
 * so the sparkle mark stays and the same session stays mounted.
 */
export function DescribeCopilotChrome({
  presentation,
  onToggle,
}: DescribeCopilotChromeProps) {
  const { t } = useTranslation('common');
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);
  const [looked, setLooked] = useState(false);
  const minimized = presentation === 'minimized';
  const label = minimized ? t('iris.maximizeCopilot') : t('iris.minimizeCopilot');

  useLayoutEffect(() => {
    setActionsSlot(document.querySelector<HTMLElement>(HEADER_ACTIONS));
    setLooked(true);
  }, [presentation]);

  const toggle = (
    <Button
      className="cluster-copilot-presentation"
      aria-label={label}
      data-testid="cluster-copilot-presentation"
      htmlType="button"
      icon={
        <img
          alt=""
          draggable={false}
          height={16}
          src={minimized ? EXPAND_ICON : COLLAPSE_ICON}
          width={16}
        />
      }
      size="small"
      type="default"
      variant="text"
      onClick={onToggle}
    />
  );

  if (!looked) return null;
  if (actionsSlot) return createPortal(toggle, actionsSlot);
  return toggle;
}
