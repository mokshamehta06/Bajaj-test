const express = require('express');
const router = express.Router();

// GET /bfhl
router.get('/', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// POST /bfhl
router.post('/', (req, res) => {
  try {
    const { data } = req.body;

    // Validate input
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid input. Expected JSON with "data" array.'
      });
    }

    const numbers = [];
    const alphabets = [];
    let highest_alphabet = [];

    // Separate numbers and alphabets
    data.forEach((item) => {
      if (typeof item !== 'string') {
        item = String(item);
      }
      
      if (!isNaN(item) && item.trim() !== '') {
        numbers.push(item);
      } else if (/^[a-zA-Z]$/.test(item)) {
        alphabets.push(item);
      }
    });

    // Find highest alphabet (case insensitive comparison)
    if (alphabets.length > 0) {
      const sorted = [...alphabets].sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      highest_alphabet = [sorted[sorted.length - 1]];
    }

    // ----------------------------------------------------
    // USER DETAILS
    // ----------------------------------------------------
    const USER_ID = 'moksha_mehta_06082005'; 
    const EMAIL = 'mokshamehta230626@acropolis.in';
    const ROLL_NUMBER = '0827cs231161';
    // ----------------------------------------------------

    res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_alphabet
    });

  } catch (error) {
    console.error('BFHL Error:', error);
    res.status(500).json({
      is_success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
