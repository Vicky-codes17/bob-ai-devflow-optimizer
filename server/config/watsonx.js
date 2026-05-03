// config/watsonx.js - IBM watsonx.ai Configuration
require('dotenv').config();

/**
 * Watson AI Configuration
 */
const watsonxConfig = {
  // API credentials
  apiKey: process.env.WATSONX_API_KEY || '',
  projectId: process.env.WATSONX_PROJECT_ID || '',
  
  // API endpoint
  url: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
  
  // Model settings
  model: {
    id: process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-chat-v2',
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50
    }
  },
  
  // Feature flags
  enabled: process.env.USE_AI === 'true',
  
  // Timeout settings
  timeout: 30000, // 30 seconds
  
  // Retry settings
  retry: {
    maxAttempts: 3,
    delay: 1000 // 1 second
  }
};

/**
 * Validate configuration
 */
function validateConfig() {
  if (!watsonxConfig.enabled) {
    return {
      valid: true,
      message: 'Watson AI is disabled (using mock mode)'
    };
  }
  
  const errors = [];
  
  if (!watsonxConfig.apiKey) {
    errors.push('WATSONX_API_KEY is not set');
  }
  
  if (!watsonxConfig.projectId) {
    errors.push('WATSONX_PROJECT_ID is not set');
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      message: 'Watson AI configuration is incomplete',
      errors: errors
    };
  }
  
  return {
    valid: true,
    message: 'Watson AI configuration is valid'
  };
}

/**
 * Get configuration status
 */
function getStatus() {
  const validation = validateConfig();
  
  return {
    enabled: watsonxConfig.enabled,
    configured: validation.valid,
    model: watsonxConfig.model.id,
    message: validation.message,
    errors: validation.errors || []
  };
}

module.exports = {
  watsonxConfig,
  validateConfig,
  getStatus
};

// Made with Bob