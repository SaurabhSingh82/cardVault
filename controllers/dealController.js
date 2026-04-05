const Deal = require('../models/Deal');
const GiftCard = require('../models/GiftCard');

// CREATE DEAL
exports.createDeal = async (req, res) => {
    try {
        const card = await GiftCard.findById(req.params.cardId);

        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const deal = await Deal.create({
            card: card._id,
            buyer: req.user.id,
            seller: card.seller
        });

        res.status(201).json(deal);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACCEPT DEAL (Seller)
exports.acceptDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        if (deal.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        deal.status = 'accepted';
        await deal.save();

        res.json(deal);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const { decrypt } = require('../utils/encryption');

exports.revealCard = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).populate('card');

        if (!deal) {
            return res.status(404).json({ message: "Deal not found" });
        }

        // Only buyer can access
        if (deal.buyer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Only after accepted
        if (deal.status !== 'accepted') {
            return res.status(400).json({ message: "Deal not accepted yet" });
        }

        const card = deal.card;
        if (!card.cardNumber || !card.pin) {
            return res.status(400).json({ message: "Card details missing" });
        }

        // Decrypt details
        const decryptedData = {
            cardNumber: decrypt(card.cardNumber),
            pin: decrypt(card.pin)
        };

        res.json(decryptedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};