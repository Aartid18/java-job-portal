import React, { useState } from 'react';
import './Folder.css';

export interface FolderProps {
  size?: number;
  color?: string;
  items?: React.ReactNode[];
  className?: string;
  onToggle?: (isOpen: boolean) => void;
}

export const Folder: React.FC<FolderProps> = ({
  size = 1.2,
  color = '#4F46E5',
  items,
  className = '',
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const defaultItems = [
    (
      <div key="p1" className="milestone-paper-content">
        <strong style={{ color: '#4F46E5' }}>30 Days</strong>
        <span>Journey Milestone</span>
      </div>
    ),
    (
      <div key="p2" className="milestone-paper-content">
        <strong style={{ color: '#7C3AED' }}>12 Roles</strong>
        <span>Applications Sent</span>
      </div>
    ),
    (
      <div key="p3" className="milestone-paper-content">
        <strong style={{ color: '#10B981' }}>92% Score</strong>
        <span>Profile Complete</span>
      </div>
    ),
  ];

  const paperItems = items && items.length > 0 ? items : defaultItems;

  const toggleFolder = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      setCelebrating(true);
      setTimeout(() => {
        setCelebrating(false);
      }, 700);
    }

    if (onToggle) {
      onToggle(nextState);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFolder();
    }
  };

  return (
    <div className={`milestone-folder-wrapper ${className}`}>
      <div className={`celebration-glow ${isOpen || celebrating ? 'active' : ''}`} />

      <div
        tabIndex={0}
        role="button"
        aria-label="30-Day Milestone Progress Folder. Click to expand your milestone details."
        aria-expanded={isOpen}
        onClick={toggleFolder}
        onKeyDown={handleKeyDown}
        className={`milestone-folder ${isOpen ? 'is-open' : ''}`}
        style={{
          '--folder-color': color,
          '--folder-color-dark': '#3730A3',
          '--folder-scale': size,
        } as React.CSSProperties}
      >
        {/* Folder Backing */}
        <div className="folder-back" />
        <div className="folder-tab" />

        {/* Papers Stack Inside Folder */}
        <div className="folder-papers">
          {paperItems.slice(0, 3).map((item, index) => (
            <div key={index} className="folder-paper">
              {item}
            </div>
          ))}
        </div>

        {/* Front Panel and Flap */}
        <div className="folder-front" />
        <div className="folder-flap" />
      </div>
    </div>
  );
};

export default Folder;
