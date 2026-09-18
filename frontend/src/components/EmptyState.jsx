// Reusable Empty State Widget

import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Data Available Yet',
  description = 'This section is currently empty. Features will be implemented in upcoming milestones.',
  icon = <Inbox size={28} />,
  actionLabel = null,
  onAction = null,
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">{icon}</div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-text">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
