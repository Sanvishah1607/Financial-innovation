// Reusable Card Component for FinGuard

import React from 'react';

export default function Card({
  title,
  subtitle,
  children,
  action = null,
  className = '',
  ...props
}) {
  return (
    <div className={`finguard-card ${className}`} {...props}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: subtitle ? '0.25rem' : '1rem' }}>
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
