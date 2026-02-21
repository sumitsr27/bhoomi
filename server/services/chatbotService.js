const openai = require('../config/openai');
const ChatMessage = require('../models/ChatMessage');

const SYSTEM_PROMPT = `You are a helpful assistant for Bhoomi Rental, a land rental platform. 
You help users with: finding land to rent, understanding rental process, booking, payments, and agreements.
Keep responses concise and relevant to land rental. If asked about something outside this scope, politely redirect.`;

const getChatResponse = async (userMessage, userId, sessionId) => {
  const messages = await ChatMessage.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(20)
    .lean();

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: formattedMessages,
    max_tokens: 300,
  });

  const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

  await ChatMessage.create([
    { user: userId, sessionId, role: 'user', content: userMessage },
    { user: userId, sessionId, role: 'assistant', content: assistantMessage },
  ]);

  return assistantMessage;
};

module.exports = { getChatResponse };
