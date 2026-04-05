const express = require('express');
const router = express.Router();


const { createDeal, acceptDeal } = require('../controllers/dealController');

const protect = require('../middleware/authMiddleware');
const { revealCard } = require('../controllers/dealController');

router.get('/reveal/:id', protect, revealCard);

router.post('/:cardId', protect, createDeal);
router.put('/accept/:id', protect, acceptDeal);

module.exports = router;