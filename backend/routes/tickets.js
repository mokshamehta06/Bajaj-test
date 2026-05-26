const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  getStats
} = require('../controllers/ticketController');

// Stats must come before /:id to avoid matching "stats" as an id
router.get('/stats', getStats);

router.post('/', createTicket);
router.get('/', getTickets);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
