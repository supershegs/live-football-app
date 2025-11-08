import React, { useState } from 'react';
import { footballApi } from '../services/api';

const LiveDataTab: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<any>(null);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [matchH2H, setMatchH2H] = useState<any>(null);
  const [footballAreas, setFootballAreas] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadLiveMatches = async () => {
    setLoading(true);
    try {
      const data = await footballApi.getLiveMatchesFromAPI();
      setLiveMatches(data);
    } catch (error) {
      console.error('Error loading live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchDetails = async () => {
    if (!selectedMatch) return;
    
    setLoading(true);
    try {
      const data = await footballApi.getMatchDetails(selectedMatch);
      setMatchDetails(data);
    } catch (error) {
      console.error('Error loading match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchH2H = async () => {
    if (!selectedMatch) return;
    
    setLoading(true);
    try {
      const data = await footballApi.getMatchH2H(selectedMatch);
      setMatchH2H(data);
    } catch (error) {
      console.error('Error loading match H2H:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFootballAreas = async () => {
    setLoading(true);
    try {
      const data = await footballApi.getFootballAreas();
      setFootballAreas(data);
    } catch (error) {
      console.error('Error loading football areas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Live Data from API</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={loadLiveMatches}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Load Live Matches
        </button>
        
        <button
          onClick={loadFootballAreas}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Load Football Areas
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Enter Match ID for details"
          value={selectedMatch || ''}
          onChange={(e) => setSelectedMatch(e.target.value ? Number(e.target.value) : null)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            width: '200px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={loadMatchDetails}
          disabled={loading || !selectedMatch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !selectedMatch ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Match Details
        </button>
        <button
          onClick={loadMatchH2H}
          disabled={loading || !selectedMatch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !selectedMatch ? 'not-allowed' : 'pointer'
          }}
        >
          Head to Head
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      )}

      {liveMatches && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Live Matches</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(liveMatches, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {matchDetails && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Match Details</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(matchDetails, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {matchH2H && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Head to Head</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(matchH2H, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {footballAreas && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Football Areas</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(footballAreas, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDataTab;