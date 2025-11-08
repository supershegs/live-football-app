import React, { useState, useEffect } from 'react';
import { footballApi } from '../services/api';

interface MatchDetailsModalProps {
  matchId: number;
  onClose: () => void;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ matchId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'h2h'>('details');
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [h2hData, setH2hData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  useEffect(() => {
    if (activeTab === 'h2h' && !h2hData) {
      loadH2HData();
    }
  }, [activeTab]);

  const loadMatchDetails = async () => {
    setLoading(true);
    try {
      const data = await footballApi.getMatchDetails(matchId);
      setMatchDetails(data);
    } catch (error) {
      console.error('Error loading match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadH2HData = async () => {
    setLoading(true);
    try {
      const data = await footballApi.getMatchH2H(matchId);
      setH2hData(data);
    } catch (error) {
      console.error('Error loading H2H data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMatchDetails = () => {
    if (!matchDetails?.data) return <div>No match details available</div>;
    
    const match = matchDetails.data;
    const { homeTeam, awayTeam, score, competition, utcDate, status } = match;

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{competition?.name}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <img src={homeTeam?.crest} alt={homeTeam?.name} style={{ width: '40px', height: '40px', marginBottom: '5px' }} />
              <div style={{ fontWeight: 'bold' }}>{homeTeam?.shortName}</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {score?.fullTime ? `${score.fullTime.home} - ${score.fullTime.away}` : 'vs'}
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src={awayTeam?.crest} alt={awayTeam?.name} style={{ width: '40px', height: '40px', marginBottom: '5px' }} />
              <div style={{ fontWeight: 'bold' }}>{awayTeam?.shortName}</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(utcDate).toLocaleString()} • {status}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Home Team</h4>
            <p><strong>Name:</strong> {homeTeam?.name}</p>
            <p><strong>Founded:</strong> {homeTeam?.founded}</p>
            <p><strong>Venue:</strong> {homeTeam?.venue}</p>
          </div>
          <div>
            <h4>Away Team</h4>
            <p><strong>Name:</strong> {awayTeam?.name}</p>
            <p><strong>Founded:</strong> {awayTeam?.founded}</p>
            <p><strong>Venue:</strong> {awayTeam?.venue}</p>
          </div>
        </div>

        {score && (
          <div style={{ marginTop: '20px' }}>
            <h4>Score Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Half Time</div>
                <div>{score.halfTime ? `${score.halfTime.home} - ${score.halfTime.away}` : 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Full Time</div>
                <div>{score.fullTime ? `${score.fullTime.home} - ${score.fullTime.away}` : 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Extra Time</div>
                <div>{score.extraTime ? `${score.extraTime.home} - ${score.extraTime.away}` : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderH2H = () => {
    if (!h2hData?.data) return <div>No head-to-head data available</div>;
    
    const { matches = [] } = h2hData.data;

    return (
      <div style={{ padding: '20px' }}>
        <h4>Recent Head-to-Head Matches</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {matches.map((match: any, index: number) => (
            <div key={index} style={{ 
              border: '1px solid #eee', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '10px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(match.utcDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {match.competition?.name}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span>{match.homeTeam?.shortName}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {match.score?.fullTime ? `${match.score.fullTime.home} - ${match.score.fullTime.away}` : 'vs'}
                </span>
                <span>{match.awayTeam?.shortName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #eee'
        }}>
          <h3 style={{ margin: 0 }}>Match Details</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: activeTab === 'details' ? '#f0f0f0' : 'transparent',
              cursor: 'pointer'
            }}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('h2h')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              backgroundColor: activeTab === 'h2h' ? '#f0f0f0' : 'transparent',
              cursor: 'pointer'
            }}
          >
            Head to Head
          </button>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            activeTab === 'details' ? renderMatchDetails() : renderH2H()
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;