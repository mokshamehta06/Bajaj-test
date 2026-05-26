import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached) params.append('breached', 'true');

  const { data } = await api.get(`/tickets?${params.toString()}`);
  return data;
}

export async function createTicket(ticketData) {
  const { data } = await api.post('/tickets', ticketData);
  return data;
}

export async function updateTicket(id, updates) {
  const { data } = await api.patch(`/tickets/${id}`, updates);
  return data;
}

export async function deleteTicket(id) {
  const { data } = await api.delete(`/tickets/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await api.get('/tickets/stats');
  return data;
}

export default api;
