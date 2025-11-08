import React, { useState, useEffect } from 'react';
import { footballApi } from '../services/api';
import MatchCard from './MatchCard';

const CompetitionsTab: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [competitionData, setCompetitionData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'details' | 'standings' | 'matches' | 'teams' | 'scorers'>('details');
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      loadCompetitionData(activeSection);
    }
  }, [selectedCompetition]);

  const loadCompetitions = async () => {
    try {
      const response = await footballApi.getLiveCompetitions();
      const competitions = (response as any).data?.competitions || (response as any).competitions || [];
      setCompetitions(Array.isArray(competitions) ? competitions : []);
    } catch (error) {
      console.error('Error loading competitions:', error);
    }
  };

  const loadCompetitionData = async (section: string) => {
    if (!selectedCompetition) return;
    
    setLoading(true);
    try {
      let data;
      switch (section) {
        case 'details':
          data = await footballApi.getCompetitionDetails(selectedCompetition);
          break;
        case 'standings':
          data = await footballApi.getCompetitionStandings(selectedCompetition);
          break;
        case 'matches':
          data = await footballApi.getCompetitionMatches(selectedCompetition);
          break;
        case 'teams':
          data = await footballApi.getCompetitionTeams(selectedCompetition);
          break;
        case 'scorers':
          data = await footballApi.getCompetitionScorers(selectedCompetition);
          break;
      }
      setCompetitionData(data);
    } catch (error) {
      console.error(`Error loading ${section}:`, error);
      setCompetitionData({ error: `Failed to load ${section}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section: any) => {
    setActiveSection(section);
    loadCompetitionData(section);
  };

  const renderMatches = (matches: any[]) => {
    if (!Array.isArray(matches)) return null;
    return (
      <div>
        {matches.map((match, index) => (
          <MatchCard key={match.id || index} match={match} />
        ))}
      </div>
    );
  };

  const renderStandings = (standings: any) => {
    if (!standings?.standings?.[0]?.table) return null;
    const table = standings.standings[0].table;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Pos</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Team</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>P</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>W</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>D</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>L</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>GF</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>GA</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>GD</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((team: any, index: number) => (
              <tr key={team.team.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.position}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.team.shortName || team.team.name}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.playedGames}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.won}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.draw}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.lost}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.goalsFor}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.goalsAgainst}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{team.goalDifference}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderScorers = (scorers: any) => {
    if (!scorers?.scorers) return null;
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Rank</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Player</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Team</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Goals</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Assists</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Penalties</th>
            </tr>
          </thead>
          <tbody>
            {scorers.scorers.map((scorer: any, index: number) => (
              <tr key={scorer.player.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{scorer.player.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{scorer.team.shortName || scorer.team.name}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold' }}>{scorer.goals}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{scorer.assists || 0}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{scorer.penalties || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTeams = (teams: any) => {
    if (!teams?.teams) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {teams.teams.map((team: any) => (
          <div key={team.id} onClick={() => setSelectedTeam(team)} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            {team.crest && (
              <img src={team.crest} alt={team.name} style={{ width: '40px', height: '40px', marginBottom: '10px' }} />
            )}
            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{team.shortName || team.name}</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{team.area?.name}</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Founded: {team.founded || 'N/A'}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    if (!competitionData) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Select a section to view data
        </div>
      );
    }

    if (competitionData.error) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>
          {competitionData.error}
        </div>
      );
    }

    switch (activeSection) {
      case 'matches':
        const matches = competitionData.data?.matches || competitionData.matches || [];
        return matches.length > 0 ? renderMatches(matches) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No matches found</div>
        );
      
      case 'standings':
        return renderStandings(competitionData.data || competitionData) || (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No standings available</div>
        );
      
      case 'scorers':
        return renderScorers(competitionData.data || competitionData) || (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No scorers available</div>
        );
      
      case 'teams':
        return renderTeams(competitionData.data || competitionData) || (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No teams available</div>
        );
      
      case 'details':
        const competition = competitionData?.data;
        if (!competition) {
          return <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No competition details available</div>;
        }
        
        const { area, name, code, type, emblem, currentSeason, seasons = [] } = competition;
        const recentSeasons = seasons.slice(0, 5);
        
        return (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <img src={emblem} alt={name} style={{ width: '80px', height: '80px', marginRight: '20px' }} />
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>{name}</h2>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>{code}</span>
                    <span style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' }}>{type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={area.flag} alt={area.name} style={{ width: '20px', height: '15px' }} />
                    <span style={{ fontSize: '14px', color: '#666' }}>{area.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Season */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px' }}>Current Season</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Season Period</div>
                  <div style={{ fontWeight: 'bold' }}>{new Date(currentSeason.startDate).toLocaleDateString()} - {new Date(currentSeason.endDate).toLocaleDateString()}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Current Matchday</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{currentSeason.currentMatchday}</div>
                </div>
                {currentSeason.winner && (
                  <div style={{ padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '4px' }}>Champion</div>
                    <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>{currentSeason.winner.shortName}</div>
                  </div>
                )}
              </div>
            </div>

            {/* All Seasons */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>Season History</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {seasons.map((season: any) => {
                  const isOngoing = !season.winner;
                  const seasonYear = `${new Date(season.startDate).getFullYear()}/${new Date(season.endDate).getFullYear()}`;
                  
                  return (
                    <div key={season.id} style={{ 
                      border: `2px solid ${isOngoing ? '#ff9800' : '#4caf50'}`, 
                      borderRadius: '12px', 
                      padding: '16px', 
                      backgroundColor: isOngoing ? '#fff3e0' : '#f1f8e9'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{seasonYear}</span>
                        <span style={{ 
                          fontSize: '11px', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          backgroundColor: isOngoing ? '#ff9800' : '#4caf50',
                          color: 'white',
                          fontWeight: '500'
                        }}>
                          {isOngoing ? 'ONGOING' : 'COMPLETED'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                        {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                        Matchday: {season.currentMatchday}
                      </div>
                      
                      {season.winner ? (
                        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <img src={season.winner.crest} alt={season.winner.name} style={{ width: '24px', height: '24px' }} />
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2e7d32' }}>{season.winner.shortName}</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>{season.winner.name}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#888' }}>
                            <div>Founded: {season.winner.founded}</div>
                            <div>Venue: {season.winner.venue}</div>
                            <div>Colors: {season.winner.clubColors}</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ff9800', textAlign: 'center' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff9800', marginBottom: '4px' }}>Season in Progress</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Winner to be determined</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No data available
          </div>
        );
    }
  };

  return (
    <div>
      <h2>Competitions</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            marginRight: '10px',
            minWidth: '200px'
          }}
        >
          <option value="">Select Competition</option>
          {Array.isArray(competitions) && competitions.map((comp) => (
            <option key={comp.code} value={comp.code}>
              {comp.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => loadCompetitions()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {selectedCompetition && (
        <div>
          <div className="tab-buttons">
            {['details', 'standings', 'matches', 'teams', 'scorers'].map(section => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`button ${activeSection === section ? 'button-primary' : 'button-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {section}
              </button>
            ))}
          </div>

          {renderContent()}
        </div>
      )}
      

      {selectedTeam && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0 }}>Team Details</h3>
              <button onClick={() => setSelectedTeam(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img src={selectedTeam.crest} alt={selectedTeam.name} style={{ width: '60px', height: '60px', marginRight: '16px' }} />
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{selectedTeam.name}</h3>
                  <p style={{ margin: '0', color: '#666' }}>{selectedTeam.shortName} • {selectedTeam.tla}</p>
                  <p style={{ margin: '4px 0 0 0', color: '#666' }}>{selectedTeam.area?.name}</p>
                </div>
              </div>
              
              {(competitionData.data?.competition || competitionData.data?.season) && (
                <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#f57c00' }}>Competition & Season</h4>
                  {competitionData.data?.competition && (
                    <p style={{ margin: '4px 0', fontSize: '13px' }}>Competition: {competitionData.data.competition.name}</p>
                  )}
                  {competitionData.data?.season && (
                    <p style={{ margin: '4px 0', fontSize: '13px' }}>Season: {new Date(competitionData.data.season.startDate).getFullYear()}/{new Date(competitionData.data.season.endDate).getFullYear()}</p>
                  )}
                  {competitionData.data?.season?.currentMatchday && (
                    <p style={{ margin: '4px 0', fontSize: '13px' }}>Matchday: {competitionData.data.season.currentMatchday}</p>
                  )}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Club Info</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Founded: {selectedTeam.founded || 'N/A'}</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Colors: {selectedTeam.clubColors || 'N/A'}</p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>Venue: {selectedTeam.venue || 'N/A'}</p>
                </div>
                {selectedTeam.coach && (
                  <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>Coach</h4>
                    <p style={{ margin: '4px 0', fontSize: '13px', fontWeight: 'bold' }}>{selectedTeam.coach.name}</p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{selectedTeam.coach.nationality}</p>
                  </div>
                )}
              </div>
              
              {selectedTeam.runningCompetitions && selectedTeam.runningCompetitions.length > 0 && (
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Running Competitions</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedTeam.runningCompetitions.map((comp: any) => (
                      <span key={comp.id} style={{ padding: '4px 8px', backgroundColor: '#e8f5e8', color: '#2e7d32', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                        {comp.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTeam.squad && selectedTeam.squad.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0' }}>Squad ({selectedTeam.squad.length} players)</h4>
                  <div style={{ maxHeight: '200px', overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                    {selectedTeam.squad.map((player: any) => (
                      <div key={player.id} style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                        <div style={{ color: '#666' }}>{player.position}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionsTab;