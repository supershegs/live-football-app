import React from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: any;
  onClick?: (matchId: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const competition = match.competition || {};
  const homeTeam = match.homeTeam || match.home_team || {};
  const awayTeam = match.awayTeam || match.away_team || {};
  const homeScore = match.score?.fullTime?.home ?? match.home_score;
  const awayScore = match.score?.fullTime?.away ?? match.away_score;
  const matchDate = match.utcDate || match.utc_date;

  return (
    <div className="match-card" 
         style={{ cursor: onClick ? 'pointer' : 'default' }}
         onClick={() => onClick && match.id && onClick(match.id)}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {competition.name || 'Competition'}
        </span>
        <span className={`status-badge ${
          match.status === 'IN_PLAY' ? 'status-in-play' :
          match.status === 'FINISHED' ? 'status-finished' :
          match.status === 'SCHEDULED' ? 'status-scheduled' :
          'status-default'
        }`}>
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
        <span>{homeTeam.shortName || homeTeam.name || 'Home Team'}</span>
        <div style={{ textAlign: 'center' }}>
          {homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined ? (
            <span>{homeScore} - {awayScore}</span>
          ) : (
            <span>vs</span>
          )}
        </div>
        <span>{awayTeam.shortName || awayTeam.name || 'Away Team'}</span>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '8px',
        textAlign: 'center'
      }}>
        {formatDate(matchDate)}
      </div>
    </div>
  );
};

export default MatchCard;