const express = require('express');
const router = express.Router();
const rabbitmqService = require('../services/rabbitmqService');

router.post('/send-message', async (req, res) => {
  const { queueName, message } = req.body;
  console.log(queueName, message);
  try {
    await rabbitmqService.sendMessage(queueName, message);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

router.get('/get-message', async (req, res) => {
  const { queueName } = req.query;
  
  try {
    const message = await rabbitmqService.getMessage(queueName);
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get message' });
  }
});

module.exports = router;
