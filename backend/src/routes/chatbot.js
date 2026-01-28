const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Get chatbot greeting
router.get('/greeting', chatbotController.getChatbotGreeting);

// Process user input
router.post('/chat', chatbotController.processChatbotInput);

module.exports = router;
