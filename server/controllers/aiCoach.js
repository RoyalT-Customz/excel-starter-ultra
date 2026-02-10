/**
 * AI Coach Controller
 * Handles interactions with OpenAI API for Excel coaching
 */

const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Get AI response for Excel coaching
 * @param {string} message - User's question
 * @param {boolean} simpleMode - Whether to use simple, beginner-friendly language
 * @returns {Promise<string>} AI response
 */
async function getResponse(message, simpleMode = true) {
  try {
    const systemPrompt = simpleMode
      ? `You are a friendly, patient Excel tutor for complete beginners. Your students have little to no computer experience. 
         - Use very simple language
         - Avoid technical jargon
         - Use analogies and real-world examples
         - Be encouraging and supportive
         - Break down complex concepts into small steps
         - Use emojis occasionally to make it friendly
         - Always explain things as if the person has never used Excel before`
      : `You are an Excel expert tutor. Provide clear, detailed explanations about Excel features, formulas, and best practices.`;

    const userPrompt = `Excel question: ${message}\n\nPlease provide a helpful, beginner-friendly answer.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response if API fails
    if (error.message.includes('API key')) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }
    
    throw new Error('Failed to get AI response. Please try again later.');
  }
}

module.exports = {
  getResponse
};

