import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Board from './components/Board';
import StatsStrip from './components/StatsStrip';
import FilterBar from './components/FilterBar';
import CreateTicketModal from './components/CreateTicketModal';
import TicketDetailsModal from './components/TicketDetailsModal';
import AnalyticsView from './components/AnalyticsView';
import TeamView from './components/TeamView';
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
  const [currentView, setCurrentView] = useState('board');
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ priority: '', breached: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
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
    loadStats();
  };

  // Change status
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const updated = await apiUpdateTicket(ticketId, { status: newStatus });
      setTickets(prev => prev.map(t => t._id === ticketId ? updated : t));
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ticket status');
    }
  };

  // Delete ticket
  const handleDelete = async (ticketId) => {
    try {
      await apiDeleteTicket(ticketId);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
      if (selectedTicket?._id === ticketId) setSelectedTicket(null);
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete ticket');
    }
  };

  const handleDropError = (message) => {
    setError(message);
  };

  // Filter tickets by search query
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(lowerQuery) ||
      (ticket.customerEmail && ticket.customerEmail.toLowerCase().includes(lowerQuery))
    );
  });

  return (
    <div className="app">
      {/* Sidebar Layout */}
      <aside className="app-sidebar">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#logo-gradient)"/>
            <path d="M6 10h12M6 14h8" stroke="white" strokeWidth="2" strokeLinecap="square"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <h1>DeskFlow</h1>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${currentView === 'board' ? 'active' : ''}`} onClick={() => setCurrentView('board')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Board
          </div>
          <div className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentView('analytics')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Analytics
          </div>
          <div className={`nav-item ${currentView === 'team' ? 'active' : ''}`} onClick={() => setCurrentView('team')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Team
          </div>
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-create"
          onClick={() => setIsModalOpen(true)}
          id="create-ticket-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
          </svg>
          New Ticket
        </motion.button>
      </aside>

      {/* Main Content Area */}
      <motion.main 
        className="app-main"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {currentView === 'board' && (
          <>
            <div className="page-header">
              <h2>Overview</h2>
              <p>Manage and triage your support requests efficiently.</p>
            </div>

            <StatsStrip stats={stats} loading={statsLoading} />
            
            <FilterBar 
              filters={filters} 
              onFilterChange={setFilters} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <Board
              tickets={filteredTickets}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onDropError={handleDropError}
              onTicketClick={(ticket) => setSelectedTicket(ticket)}
              loading={loading}
            />
          </>
        )}

        {currentView === 'analytics' && <AnalyticsView stats={stats} />}
        
        {currentView === 'team' && <TeamView />}
      </motion.main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateTicketModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateTicket}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={async (updates) => {
              try {
                const updated = await apiUpdateTicket(selectedTicket._id, updates);
                setTickets(prev => prev.map(t => t._id === selectedTicket._id ? updated : t));
                setSelectedTicket(updated);
                loadStats();
              } catch (err) {
                setError(err.response?.data?.error || 'Failed to update ticket details');
              }
            }}
          />
        )}
      </AnimatePresence>

      <ErrorToast
        message={error}
        onDismiss={() => setError('')}
      />
    </div>
  );
}

export default App;
