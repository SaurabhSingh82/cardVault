const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const messages = await Message.find({ roomId })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};