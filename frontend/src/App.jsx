import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import CreateTicketModal from './components/CreateTicketModal';
import ErrorToast from './components/ErrorToast';
import {
  fetchTickets,
  createTicket as apiCreateTicket,
  updateTicket as apiUpdateTicket,
  deleteTicket as apiDeleteTicket,
  fetchStats
} from './api/tickets';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ priority: '', breached: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tickets
  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTickets(filters);
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Create ticket
  const handleCreateTicket = async (ticketData) => {
    const newTicket = await apiCreateTicket(ticketData);
    setTickets(prev => [newTicket, ...prev]);
    loadStats(); // Refresh stats
  };

  // Change status
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const updated = await apiUpdateTicket(ticketId, { status: newStatus });
      setTickets(prev => prev.map(t => t._id === ticketId ? updated : t));
      loadStats(); // Refresh stats
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ticket status');
    }
  };

  // Delete ticket
  const handleDelete = async (ticketId) => {
    try {
      await apiDeleteTicket(ticketId);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete ticket');
    }
  };

  // Handle drop errors
  const handleDropError = (message) => {
    setError(message);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <h1>DeskFlow</h1>
          </div>
          <button
            className="btn-create"
            onClick={() => setIsModalOpen(true)}
            id="create-ticket-btn"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Ticket
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <StatsStrip stats={stats} loading={statsLoading} />
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <Board
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onDropError={handleDropError}
          loading={loading}
        />
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* Error Toast */}
      <ErrorToast
        message={error}
        onDismiss={() => setError('')}
      />
    </div>
  );
}

export default App;
