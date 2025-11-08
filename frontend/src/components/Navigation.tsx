import React from 'react';
import { authApi } from '../services/api';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'matches', label: 'Matches' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'teams', label: 'Teams' },
    { id: 'live', label: 'Live Data' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;