import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import SiteIcon from '../SiteIcon';
import './DemoExpansionButton.css';

export interface DemoExpansionOptions {
  readonly expanded?: boolean;
  readonly onExpandedChange?: (expanded: boolean) => void;
}

export const useDemoExpansionState = ({
  expanded,
  onExpandedChange,
}: DemoExpansionOptions) => {
  const [locallyExpanded, setLocallyExpanded] = useState(false);
  const isExpanded = expanded ?? locallyExpanded;
  const setExpanded = useCallback(
    (nextExpanded: boolean) => {
      if (expanded === undefined) {
        setLocallyExpanded(nextExpanded);
      }
      onExpandedChange?.(nextExpanded);
    },
    [expanded, onExpandedChange]
  );

  return { isExpanded, setExpanded } as const;
};

interface DemoExpansionButtonProps {
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly title: string;
}

const DemoExpansionButton = ({
  expanded,
  onExpandedChange,
  title,
}: DemoExpansionButtonProps): React.ReactElement => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasExpandedRef = useRef(false);

  useEffect(() => {
    if (expanded || wasExpandedRef.current) {
      buttonRef.current?.focus({ preventScroll: true });
    }
    wasExpandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const collapseOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExpandedChange(false);
      }
    };
    window.addEventListener('keydown', collapseOnEscape);
    return () => window.removeEventListener('keydown', collapseOnEscape);
  }, [expanded, onExpandedChange]);

  const action = expanded ? 'Collapse' : 'Expand';

  return (
    <Button
      ref={buttonRef}
      className={`demo-expansion-button${
        expanded ? ' demo-expansion-button-expanded' : ''
      }`}
      variant={expanded ? 'contained' : 'outlined'}
      startIcon={<SiteIcon name={expanded ? 'collapse' : 'expand'} />}
      onClick={() => onExpandedChange(!expanded)}
      aria-label={`${action} ${title} demonstration`}
      aria-expanded={expanded}
    >
      {action} demo
    </Button>
  );
};

export default DemoExpansionButton;
