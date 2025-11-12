import React, { useState, useEffect } from 'react';
import { Competition, Match } from './types';
import { footballApi } from './services/api';
import MatchCard from './components/MatchCard';
import CompetitionFilter from './components/CompetitionFilter';
import Navigation from './components/Navigation';
import CompetitionsTab from './components/CompetitionsTab';
import TeamsTab from './components/TeamsTab';
import LiveDataTab from './components/LiveDataTab';
import LiveStreamTab from './components/LiveStreamTab';
import MatchDetailsModal from './components/MatchDetailsModal';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('livestream');
  const [matchSubTab, setMatchSubTab] = useState<'all' | 'live'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === 'matches') {
      loadCompetitions();
      loadLiveMatches();
      
      // Set up real-time updates every 30 seconds
      const interval = setInterval(() => {
        loadLiveMatches();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const loadLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await footballApi.getLiveMatchesFromAPI();
      const allMatches = response.data?.matches || response.matches || [];
      
      // Filter for truly live matches (IN_PLAY, PAUSED) and recent matches
      const liveMatches = allMatches.filter((match: any) => 
        match.status === 'IN_PLAY' || 
        match.status === 'PAUSED' ||
        match.status === 'LIVE' ||
        (match.status === 'FINISHED' && 
         new Date(match.lastUpdated || match.utcDate).getTime() > Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
      );
      
      setLiveMatches(liveMatches);
    } catch (error) {
      console.error('Error loading live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompetitions = async () => {
    try {
      const data = await footballApi.getCompetitions();
      setCompetitions(data);
    } catch (error) {
      console.error('Error loading competitions:', error);
    }
  };



  const syncData = async () => {
    try {
      setLoading(true);
      await footballApi.syncData();
      alert('Data synced successfully!');
    } catch (error) {
      console.error('Error syncing data:', error);
      alert('Error syncing data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };



  const renderContent = () => {
    switch (activeTab) {
      case 'competitions':
        return <CompetitionsTab />;
      case 'teams':
        return <TeamsTab />;
      case 'live':
        return <LiveDataTab />;
      case 'livestream':
        return <LiveStreamTab />;
      case 'matches':
        return renderMatchesTab();
      default:
        return <LiveStreamTab />;
    }
  };

  const renderMatchesTab = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>Live Matches</h2>
            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
              Auto-refreshes every 30 seconds • Showing live and recent matches
            </p>
          </div>
          <button
            onClick={() => { syncData(); loadLiveMatches(); }}
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
            {loading ? 'Loading...' : 'Refresh Now'}
          </button>
        </div>

        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading live matches...</div>
          ) : liveMatches.length > 0 ? (
            liveMatches.map((match, index) => (
              <MatchCard 
                key={match.id || index} 
                match={match} 
                onClick={(matchId) => setSelectedMatchId(matchId)}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No live matches currently. The page auto-refreshes every 30 seconds to check for new matches.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>⚽</div>
          <h1 style={{ margin: 0, background: 'linear-gradient(135deg, #4CAF50, #2196F3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '28px', fontWeight: 'bold' }}>Socca Live Football App</h1>
        </div>
      </header>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderContent()}
      
      {selectedMatchId && (
        <MatchDetailsModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
};

export default App;