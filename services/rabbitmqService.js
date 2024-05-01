const amqp = require('amqplib');

const rabbitMQUrl = 'amqp://localhost';

const sendMessage = async (queueName, message) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(message));
    
    console.log(`[x] Sent message to ${queueName}: ${message}`);
    
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('[!] Error sending message:' + queueName, error.message);
    throw error;
  }
};

const getMessage = async (queueName) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queueName, { durable: false });
    
    const message = await new Promise((resolve, reject) => {
      channel.consume(queueName, (msg) => {
        if (msg) {
          console.log(`[x] Received message from ${queueName}: ${msg.content.toString()}`);
          channel.ack(msg);
          resolve(msg.content.toString());
        }
      });
    });
    
    await channel.close();
    await connection.close();
    
    return message;
  } catch (error) {
    console.error('[!] Error getting message:', error.message);
    throw error;
  }
};

module.exports = { sendMessage, getMessage };
