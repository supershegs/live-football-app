import React from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PLAY': return '#4CAF50';
      case 'FINISHED': return '#757575';
      case 'SCHEDULED': return '#2196F3';
      default: return '#FF9800';
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: '#fff'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {match.competition.name}
        </span>
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: getStatusColor(match.status),
          color: 'white'
        }}>
          {match.status}
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        <span>{match.home_team.name}</span>
        <div style={{ textAlign: 'center' }}>
          {match.home_score !== null && match.away_score !== null ? (
            <span>{match.home_score} - {match.away_score}</span>
          ) : (
            <span>vs</span>
          )}
        </div>
        <span>{match.away_team.name}</span>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '8px',
        textAlign: 'center'
      }}>
        {formatDate(match.utc_date)}
      </div>
    </div>
  );
};

export default MatchCard;