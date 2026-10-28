import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { ImpactInput as Input } from '@shared/components/vendor/impact-ui';
import styles from './wizard.module.css';

export interface ClusterNameCellProps {
  clusterId: string;
  name: string;
  locked?: boolean;
  ariaLabel: string;
  onRename: (clusterId: string, name: string) => void;
}

export function ClusterNameCell({
  clusterId,
  name,
  locked,
  ariaLabel,
  onRename,
}: ClusterNameCellProps) {
  const [draft, setDraft] = useState(name);
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    setDraft(name);
  }, [name]);

  const commit = (next: string) => {
    if (next === name) return;
    onRename(clusterId, next);
  };

  if (locked) {
    return <span className={styles.clusterNamePill}>{name}</span>;
  }

  return (
    <span
      className={styles.clusterNamePill}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <Input
        id={`cluster-name-${clusterId}`}
        name={`cluster-name-${clusterId}`}
        value={draft}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
        inputProps={{
          'aria-label': ariaLabel,
          onFocus: () => {
            focused.current = true;
          },
          onMouseDown: (e: MouseEvent<HTMLInputElement>) => e.stopPropagation(),
          onBlur: (e: FocusEvent<HTMLInputElement>) => {
            focused.current = false;
            commit(e.currentTarget.value);
          },
          onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
            if (e.key !== 'Enter') return;
            e.currentTarget.blur();
          },
        }}
      />
    </span>
  );
}
