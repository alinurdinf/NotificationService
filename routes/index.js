const express = require('express');
const router = express.Router();
const rabbitmqService = require('../services/rabbitmqService');

router.post('/send-broadcast-message', async (req, res) => {
  const { message } = req.body;

  try {
    console.log('message',message);
    await rabbitmqService.sendMessage('global_notifications_exchange', message, 'broadcast');
    res.status(200).json({ success: true, message: 'Broadcast message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send broadcast message', error: error.message });
  }
});

router.post('/send-personal-message', async (req, res) => {
  const { exchangeName, routingKey, message } = req.body;
console.log(exchangeName,routingKey,message);
  try {
    await rabbitmqService.sendMessage(exchangeName, message, 'personal', routingKey);
    res.status(200).json({ success: true, message: `Personal message sent to user with routing key ${routingKey} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to send personal message to user with routing key ${routingKey}`, error: error.message });
  }
});

router.get('/get-message', async (req, res) => {
  const { exchangeName, queueName, routingKey, messageType } = req.query;
console.log(exchangeName,queueName,routingKey,messageType);
  try {
    console.log(exchangeName,queueName,routingKey,messageType);
    const message = await rabbitmqService.getMessage(exchangeName, queueName, routingKey, messageType);
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get message', error: error.message });
  }
});

router.get('/receive-broadcast-messages', async (req, res) => {
  try {
    const messages = await rabbitmqService.receiveBroadcastMessages();
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to receive broadcast messages', error: error.message });
  }
});

module.exports = router;
