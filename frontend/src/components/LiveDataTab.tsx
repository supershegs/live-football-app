import React, { useState } from 'react';
import { footballApi } from '../services/api';
import MatchCard from './MatchCard';

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
          {(() => {
            const matches = liveMatches.data?.matches || liveMatches.matches || [];
            return matches.length > 0 ? (
              <div>
                {matches.map((match: any, index: number) => (
                  <MatchCard key={match.id || index} match={match} onClick={() => {}} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No live matches available
              </div>
            );
          })()} 
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
          {(() => {
            const areas = footballAreas.data?.areas || footballAreas.areas || [];
            return areas.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {areas.map((area: any) => (
                  <div key={area.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      {area.flag && (
                        <img src={area.flag} alt={area.name} style={{ width: '24px', height: '18px', marginRight: '10px' }} />
                      )}
                      <h4 style={{ margin: '0', fontSize: '16px' }}>{area.name}</h4>
                    </div>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Code: {area.code}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No football areas available
              </div>
            );
          })()} 
        </div>
      )}
    </div>
  );
};

export default LiveDataTab;