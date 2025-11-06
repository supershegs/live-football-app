import React, { useState, useEffect } from 'react';
import { Competition, Match } from './types';
import { footballApi } from './services/api';
import MatchCard from './components/MatchCard';
import CompetitionFilter from './components/CompetitionFilter';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'live'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompetitions();
    loadMatches();
    loadLiveMatches();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [selectedCompetition]);

  const loadCompetitions = async () => {
    try {
      const data = await footballApi.getCompetitions();
      setCompetitions(data);
    } catch (error) {
      console.error('Error loading competitions:', error);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await footballApi.getMatches(selectedCompetition || undefined);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLiveMatches = async () => {
    try {
      const data = await footballApi.getLiveMatches();
      setLiveMatches(data);
    } catch (error) {
      console.error('Error loading live matches:', error);
    }
  };

  const syncData = async () => {
    try {
      setLoading(true);
      await footballApi.syncData();
      await loadMatches();
      await loadLiveMatches();
      alert('Data synced successfully!');
    } catch (error) {
      console.error('Error syncing data:', error);
      alert('Error syncing data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const currentMatches = activeTab === 'live' ? liveMatches : matches;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Live Football App</h1>
        <button
          onClick={syncData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Syncing...' : 'Sync Data'}
        </button>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: activeTab === 'all' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All Matches
        </button>
        <button
          onClick={() => setActiveTab('live')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'live' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'live' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Live Matches ({liveMatches.length})
        </button>
      </div>

      {activeTab === 'all' && (
        <CompetitionFilter
          competitions={competitions}
          selectedCompetition={selectedCompetition}
          onCompetitionChange={setSelectedCompetition}
        />
      )}

      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : currentMatches.length > 0 ? (
          currentMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No matches found. Click "Sync Data" to fetch latest matches.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;