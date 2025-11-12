import React, { useState, useEffect } from 'react';
import { footballApi } from '../services/api';

const LiveStreamTab: React.FC = () => {
  const [liveStreamMatches, setLiveStreamMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState<string | null>(null);

  useEffect(() => {
    loadLiveStreamMatches();
  }, []);

  const loadLiveStreamMatches = async () => {
    setLoading(true);
    try {
      const response = await footballApi.getLiveStreamMatches();
      const matches = response.data?.result || [];
      setLiveStreamMatches(matches);
    } catch (error) {
      console.error('Error loading live stream matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
      case 'ongoing': return '#4caf50';
      case 'upcoming': return '#ff9800';
      case 'finished': return '#666';
      default: return '#2196f3';
    }
  };

  const handleWatchStream = async (matchId: string) => {
    setStreamLoading(matchId);
    try {
      const response = await footballApi.getLiveStreamLink(matchId);
      const streamUrl = response.data?.url;
      if (streamUrl) {
        window.open(streamUrl, '_blank');
      }
    } catch (error) {
      console.error('Error getting stream link:', error);
      alert('Unable to get stream link. Please try again.');
    } finally {
      setStreamLoading(null);
    }
  };

  const isStreamAvailable = (status: string) => {
    return status.toLowerCase() === 'live' || status.toLowerCase() === 'ongoing';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Live Stream Matches</h2>
        <button
          onClick={loadLiveStreamMatches}
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
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading live stream matches...</div>
      ) : liveStreamMatches.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {liveStreamMatches.map((match) => (
            <div key={match.id} style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{match.league}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>{match.date} • {match.time}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(match.status)
                  }}>
                    {match.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <img src={match.home_flag} alt={match.home_name} style={{ width: '24px', height: '18px', marginRight: '8px' }} />
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{match.home_name}</span>
                </div>
                
                <div style={{ padding: '0 16px', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                  {match.score}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{match.away_name}</span>
                  <img src={match.away_flag} alt={match.away_name} style={{ width: '24px', height: '18px', marginLeft: '8px' }} />
                </div>
              </div>

              {isStreamAvailable(match.status) ? (
                <button
                  onClick={() => handleWatchStream(match.id)}
                  disabled={streamLoading === match.id}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: streamLoading === match.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  {streamLoading === match.id ? '⏳ Loading...' : '📺 Watch Live Stream'}
                </button>
              ) : (
                <div style={{
                  padding: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#999',
                  fontWeight: '500'
                }}>
                  📺 Stream Not Available
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No live stream matches available at the moment.
        </div>
      )}
    </div>
  );
};

export default LiveStreamTab;