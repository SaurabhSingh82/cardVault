const express = require('express');
const router = express.Router();

const {
    createCard,
    getCards,
    getMyCards
} = require('../controllers/giftCardController');

const protect = require('../middleware/authMiddleware');

// Create gift card (Protected)
router.post('/', protect, createCard);

// Get all cards (Public)
router.get('/', getCards);

// Get logged-in user's cards (Protected)
router.get('/my', protect, getMyCards);

const { updateCard, deleteCard } = require('../controllers/giftCardController');

// UPDATE
router.put('/:id', protect, updateCard);

// DELETE
router.delete('/:id', protect, deleteCard);

module.exports = router;