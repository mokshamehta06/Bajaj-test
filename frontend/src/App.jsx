import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="currentColor"/>
              <path d="M6 10h12M6 14h8" stroke="black" strokeWidth="2" strokeLinecap="square"/>
            </svg>
            <h1>DeskFlow</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-create"
            onClick={() => setIsModalOpen(true)}
            id="create-ticket-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </svg>
            New Ticket
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="app-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <StatsStrip stats={stats} loading={statsLoading} />
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <Board
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onDropError={handleDropError}
          loading={loading}
        />
      </motion.main>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateTicketModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTicket}
          />
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <ErrorToast
        message={error}
        onDismiss={() => setError('')}
      />
    </div>
  );
}

export default App;
