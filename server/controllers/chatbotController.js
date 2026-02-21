const { getChatResponse } = require('../services/chatbotService');
const { v4: uuidv4 } = require('uuid');

exports.chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const sid = sessionId || uuidv4();
    const userId = req.user?.id || null;
    const response = await getChatResponse(message.trim(), userId, sid);
    res.json({ success: true, response, sessionId: sid });
  } catch (error) {
    next(error);
  }
};
