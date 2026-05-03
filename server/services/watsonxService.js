// services/watsonxService.js - IBM watsonx.ai Integration
const axios = require('axios');

const USE_AI = process.env.USE_AI === 'true';
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_URL = process.env.WATSONX_URL;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;

/**
 * Analyze tasks using IBM watsonx.ai
 */
async function analyzeTasksWithAI(tasks, analysisType = 'stress', userMessage = '') {
  // If AI is disabled, return mock response
  if (!USE_AI) {
    console.log('🤖 Using mock AI response (AI disabled)');
    return getMockAIResponse(tasks, analysisType, userMessage);
  }

  try {
    console.log('🤖 Calling IBM watsonx.ai...');

    // Prepare prompt for watsonx.ai
    const prompt = buildPrompt(tasks, analysisType, userMessage);

    // Call watsonx.ai API
    const response = await axios.post(
      `${WATSONX_URL}/text/generation`,
      {
        model_id: 'ibm/granite-13b-chat-v2',
        input: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9
        },
        project_id: WATSONX_PROJECT_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${WATSONX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('✅ AI response received');
    return parseAIResponse(response.data, analysisType);

  } catch (error) {
    console.error('❌ AI Error:', error.message);
    console.log('🔄 Falling back to mock response');
    return getMockAIResponse(tasks, analysisType, userMessage);
  }
}

/**
 * Build prompt for watsonx.ai
 */
function buildPrompt(tasks, analysisType, userMessage = '') {
  const taskList = tasks.map(t =>
    `- ${t.title} (Due: ${t.deadline}, Duration: ${t.duration}h, Priority: ${t.priority})`
  ).join('\n');

  if (analysisType === 'stress') {
    return `Analyze the following tasks and calculate stress level (LOW/MEDIUM/HIGH):

Tasks:
${taskList}

Provide:
1. Stress level (LOW/MEDIUM/HIGH)
2. Stress score (0-100)
3. Brief recommendation

Format your response as JSON.`;
  } else if (analysisType === 'plan') {
    return `Create an optimal daily schedule for these tasks:

Tasks:
${taskList}

Divide tasks into:
- Morning (6 AM - 12 PM)
- Afternoon (12 PM - 6 PM)
- Evening (6 PM - 11 PM)

Prioritize by deadline urgency.
Format your response as JSON.`;
  } else if (analysisType === 'chat') {
    return `You are a helpful AI task management assistant. The user has the following tasks:

${taskList}

User question: ${userMessage}

Provide a helpful, concise response about their tasks and productivity. Be friendly and supportive.`;
  }

  return `Analyze these tasks: ${taskList}`;
}

/**
 * Parse AI response
 */
function parseAIResponse(aiData, analysisType) {
  try {
    // Extract generated text
    const generatedText = aiData.results[0].generated_text;
    
    // Try to parse as JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If not JSON, return as text
    return { aiResponse: generatedText };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return getMockAIResponse([], analysisType);
  }
}

/**
 * Mock AI response (fallback)
 */
function getMockAIResponse(tasks, analysisType, userMessage = '') {
  if (analysisType === 'stress') {
    let score = tasks.length * 15;
    tasks.forEach(task => {
      const daysUntil = getDaysUntilDeadline(task.deadline);
      if (daysUntil <= 1) score += 25;
      else if (daysUntil <= 3) score += 15;
    });

    const level = score < 30 ? 'LOW' : score < 60 ? 'MEDIUM' : 'HIGH';

    return {
      level: level,
      score: Math.min(score, 100),
      recommendation: `Based on ${tasks.length} tasks, your stress level is ${level}.`,
      source: 'mock'
    };
  }

  if (analysisType === 'chat') {
    return {
      response: `I understand your question about "${userMessage}". Based on your ${tasks.length} tasks, I recommend focusing on high-priority items first and breaking down large tasks into manageable chunks.`,
      source: 'mock'
    };
  }

  return {
    message: 'Mock AI response',
    tasks: tasks,
    source: 'mock'
  };
}

function getDaysUntilDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = {
  analyzeTasksWithAI
};

// Made with Bob
