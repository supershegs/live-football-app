import React from 'react';
import { Competition } from '../types';

interface CompetitionFilterProps {
  competitions: Competition[];
  selectedCompetition: number | null;
  onCompetitionChange: (competitionId: number | null) => void;
}

const CompetitionFilter: React.FC<CompetitionFilterProps> = ({
  competitions,
  selectedCompetition,
  onCompetitionChange
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <select
        value={selectedCompetition || ''}
        onChange={(e) => onCompetitionChange(e.target.value ? Number(e.target.value) : null)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px'
        }}
      >
        <option value="">All Competitions</option>
        {competitions.map((competition) => (
          <option key={competition.id} value={competition.external_id}>
            {competition.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompetitionFilter;