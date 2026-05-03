// Test script to verify task creation works correctly
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testTaskCreation() {
  console.log('🧪 Testing Task Creation API...\n');
  
  const testTask = {
    title: 'Test Task - Fix 500 Error',
    description: 'This is a test task to verify the 500 error is fixed',
    priority: 'high',
    estimated_duration: 120, // 2 hours in minutes
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
  };
  
  try {
    console.log('📤 Sending task creation request...');
    console.log('Task data:', JSON.stringify(testTask, null, 2));
    
    const response = await axios.post(`${API_URL}/tasks`, testTask);
    
    console.log('\n✅ SUCCESS! Task created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Verify the task was created
    console.log('\n📋 Fetching all tasks to verify...');
    const allTasks = await axios.get(`${API_URL}/tasks`);
    console.log(`Total tasks: ${allTasks.data.count}`);
    
    return true;
  } catch (error) {
    console.error('\n❌ FAILED! Error creating task:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

// Run the test
console.log('⚠️  Make sure the server is running on http://localhost:5000\n');
testTaskCreation()
  .then((success) => {
    if (success) {
      console.log('\n🎉 All tests passed! The 500 error is fixed.');
      process.exit(0);
    } else {
      console.log('\n💥 Test failed. Please check the error above.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });

// Made with Bob
