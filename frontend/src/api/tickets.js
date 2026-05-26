import axios from 'axios';

const API_URL = 'https://backend-five-smoky-79.vercel.app';

export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.breached) params.append('breached', 'true');

  const { data } = await axios.get(`${API_URL}/tickets?${params.toString()}`);
  return data;
}

export async function createTicket(ticketData) {
  const { data } = await axios.post(`${API_URL}/tickets`, ticketData);
  return data;
}

export async function updateTicket(id, updates) {
  const { data } = await axios.patch(`${API_URL}/tickets/${id}`, updates);
  return data;
}

export async function deleteTicket(id) {
  const { data } = await axios.delete(`${API_URL}/tickets/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await axios.get(`${API_URL}/tickets/stats`);
  return data;
}

export default axios;
