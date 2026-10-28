/**
 * Vendor like/dislike buttons are empty <button>s with CSS background icons.
 * Label them from the host so they are nameable and press-state is announced.
 */
export function applyIrisFeedbackButtonA11y(
  root: ParentNode,
  options: {
    likeLabel: string;
    dislikeLabel: string;
    pendingByIndex?: readonly boolean[];
  },
): void {
  const goods = visibleFeedbackButtons(root, 'good_feedback');
  const bads = visibleFeedbackButtons(root, 'bad_feedback');

  goods.forEach((button, index) => {
    labelFeedbackButton(button, {
      name: options.likeLabel,
      pressed: button.classList.contains('liked'),
      pending: options.pendingByIndex?.[index] === true,
    });
  });
  bads.forEach((button, index) => {
    labelFeedbackButton(button, {
      name: options.dislikeLabel,
      pressed: button.classList.contains('disliked'),
      pending: options.pendingByIndex?.[index] === true,
    });
  });
}

function visibleFeedbackButtons(
  root: ParentNode,
  kind: 'good_feedback' | 'bad_feedback',
): HTMLButtonElement[] {
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>(`.asst_feedback_buttons.${kind}`),
  ).filter((button) => !button.classList.contains('dis_none'));
}

function labelFeedbackButton(
  button: HTMLButtonElement,
  options: { name: string; pressed: boolean; pending: boolean },
): void {
  button.type = 'button';
  button.setAttribute('aria-label', options.name);
  button.setAttribute('aria-pressed', options.pressed ? 'true' : 'false');
  button.disabled = options.pending;
  if (options.pending) {
    button.setAttribute('aria-busy', 'true');
  } else {
    button.removeAttribute('aria-busy');
  }
}
