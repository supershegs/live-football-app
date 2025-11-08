import React, { useState, useEffect } from 'react';
import { footballApi } from '../services/api';
import MatchCard from './MatchCard';

const TeamsTab: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [teamMatches, setTeamMatches] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'details' | 'matches'>('details');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      if (activeSection === 'details') {
        loadTeamDetails();
      } else {
        loadTeamMatches();
      }
    }
  }, [selectedTeam]);

  const loadTeams = async () => {
    try {
      const response = await footballApi.getLiveTeams();
      const teams = (response as any).data?.teams || (response as any).teams || [];
      setTeams(Array.isArray(teams) ? teams : []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadTeamDetails = async () => {
    if (!selectedTeam) return;
    
    setLoading(true);
    try {
      const data = await footballApi.getTeamDetails(selectedTeam);
      setTeamData(data);
    } catch (error) {
      console.error('Error loading team details:', error);
      setTeamData({ error: 'Failed to load team details' });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMatches = async () => {
    if (!selectedTeam) return;
    
    setLoading(true);
    try {
      const data = await footballApi.getTeamMatches(selectedTeam);
      setTeamMatches(data);
    } catch (error) {
      console.error('Error loading team matches:', error);
      setTeamMatches({ error: 'Failed to load team matches' });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section: 'details' | 'matches') => {
    setActiveSection(section);
    if (section === 'details') {
      loadTeamDetails();
    } else {
      loadTeamMatches();
    }
  };

  const renderTeamDetails = (team: any) => {
    if (!team) return null;
    const teamInfo = team.data || team;
    
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          {teamInfo.crest && (
            <img src={teamInfo.crest} alt={teamInfo.name} style={{ width: '80px', height: '80px', marginRight: '20px' }} />
          )}
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>{teamInfo.name}</h3>
            <p style={{ margin: '0', color: '#666' }}>{teamInfo.shortName} • {teamInfo.tla}</p>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>{teamInfo.area?.name}</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Club Information</h4>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Founded: {teamInfo.founded || 'N/A'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Colors: {teamInfo.clubColors || 'N/A'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Venue: {teamInfo.venue || 'N/A'}</p>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Contact</h4>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>Address: {teamInfo.address || 'N/A'}</p>
            {teamInfo.website && (
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                Website: <a href={teamInfo.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>Visit</a>
              </p>
            )}
          </div>
          
          {teamInfo.coach && (
            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Coach</h4>
              <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>{teamInfo.coach.name}</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>{teamInfo.coach.nationality}</p>
              {teamInfo.coach.contract && (
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                  Contract: {teamInfo.coach.contract.start} - {teamInfo.coach.contract.until}
                </p>
              )}
            </div>
          )}
          
          {teamInfo.runningCompetitions && teamInfo.runningCompetitions.length > 0 && (
            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Current Competitions</h4>
              {teamInfo.runningCompetitions.map((comp: any) => (
                <p key={comp.id} style={{ margin: '3px 0', fontSize: '13px' }}>{comp.name}</p>
              ))}
            </div>
          )}
        </div>
        
        {teamInfo.squad && teamInfo.squad.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Squad ({teamInfo.squad.length} players)</h4>
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Position</th>
                    <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Age</th>
                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nationality</th>
                  </tr>
                </thead>
                <tbody>
                  {teamInfo.squad.map((player: any) => (
                    <tr key={player.id}>
                      <td style={{ padding: '6px 8px', border: '1px solid #ddd' }}>{player.name}</td>
                      <td style={{ padding: '6px 8px', border: '1px solid #ddd' }}>{player.position}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', border: '1px solid #ddd' }}>
                        {player.dateOfBirth ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear() : 'N/A'}
                      </td>
                      <td style={{ padding: '6px 8px', border: '1px solid #ddd' }}>{player.nationality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeamMatches = (matches: any) => {
    if (!matches) return null;
    const matchList = matches.data?.matches || matches.matches || [];
    
    if (!Array.isArray(matchList) || matchList.length === 0) {
      return <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No matches found</div>;
    }
    
    return (
      <div>
        {matchList.map((match: any, index: number) => (
          <MatchCard key={match.id || index} match={match} onClick={() => {}} />
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    if (activeSection === 'details' && teamData) {
      if (teamData.error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>{teamData.error}</div>;
      }
      return renderTeamDetails(teamData);
    }

    if (activeSection === 'matches' && teamMatches) {
      if (teamMatches.error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>{teamMatches.error}</div>;
      }
      return renderTeamMatches(teamMatches);
    }

    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        Select a section to view data
      </div>
    );
  };

  if (selectedTeam) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setSelectedTeam(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            ← Back to Teams
          </button>
          <h2 style={{ margin: 0 }}>Team Details</h2>
        </div>

        <div className="tab-buttons">
          <button
            onClick={() => handleSectionChange('details')}
            className={`button ${activeSection === 'details' ? 'button-primary' : 'button-secondary'}`}
          >
            Team Details
          </button>
          <button
            onClick={() => handleSectionChange('matches')}
            className={`button ${activeSection === 'matches' ? 'button-primary' : 'button-secondary'}`}
          >
            Team Matches
          </button>
        </div>

        {renderContent()}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Teams</h2>
        <button
          onClick={() => loadTeams()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Teams
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              {team.crest && (
                <img src={team.crest} alt={team.name} style={{ width: '40px', height: '40px', marginRight: '12px' }} />
              )}
              <div>
                <h4 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{team.shortName || team.name}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>{team.area?.name}</p>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              {team.founded && <div>Founded: {team.founded}</div>}
              {team.venue && <div>Venue: {team.venue}</div>}
            </div>
            <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
              Click to view details
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No teams available. Click "Refresh Teams" to load teams.
        </div>
      )}
    </div>
  );
};

export default TeamsTab;