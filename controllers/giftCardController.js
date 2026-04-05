const GiftCard = require('../models/GiftCard');
const { encrypt } = require('../utils/encryption');

// CREATE CARD
exports.createCard = async (req, res) => {
    try {
        const { title, brand, value, price } = req.body;

        const card = await GiftCard.create({
        title,
        brand,
        value,
        price,
        cardNumber: encrypt(req.body.cardNumber),
        pin: encrypt(req.body.pin),
        seller: req.user.id
        });

        res.status(201).json(card);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL CARDS
exports.getCards = async (req, res) => {
    try {
        let query = {};

        // FILTER BY BRAND
        if (req.query.brand) {
            query.brand = {
                $regex: req.query.brand,
                $options: 'i'
            };
        }

        // FILTER BY PRICE
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = {
                $gte: req.query.minPrice,
                $lte: req.query.maxPrice
            };
        }

        // SEARCH BY TITLE
        if (req.query.search) {
            query.title = {
                $regex: req.query.search,
                $options: 'i'
            };
        }

        const cards = await GiftCard.find(query)
            .populate('seller', 'name email');

        res.json(cards);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ GET MY CARDS (FIXED POSITION)
exports.getMyCards = async (req, res) => {
    try {
        const cards = await GiftCard.find({ seller: req.user.id });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE CARD
exports.updateCard = async (req, res) => {
    try {
        const card = await GiftCard.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Check ownership
        if (card.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedCard = await GiftCard.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedCard);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE CARD
exports.deleteCard = async (req, res) => {
    try {
        const card = await GiftCard.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Check ownership
        if (card.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await card.deleteOne();

        res.json({ message: "Card deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

