const amqp = require('amqplib');

const rabbitMQUrl = 'amqp://localhost';

const sendMessage = async (exchangeName, message, messageType, routingKey = '') => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    let exchangeType = '';
    if (messageType === 'broadcast') {
      exchangeType = 'fanout';
    } else if (messageType === 'personal') {
      exchangeType = 'direct';
    } else {
      throw new Error('Invalid MessageType. Valid values are "broadcast" or "personal".');
    }

    await channel.assertExchange(exchangeName, exchangeType, { durable: false });

    if (messageType === 'personal') {
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      console.log(`[x] Sent personal message to exchange ${exchangeName} with routing key ${routingKey}: ${message}`);
    } else if (messageType === 'broadcast') {
      channel.publish(exchangeName, '', Buffer.from(message));
      console.log(`[x] Sent broadcast message to exchange ${exchangeName}: ${message}`);
    }

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('[!] Error sending message:', error.message);
    throw error;
  }
};

const getMessage = async (exchangeName, queueName, routingKey = '', messageType) => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    await channel.assertExchange(exchangeName, 'direct', { durable: false });

    await channel.bindQueue(queueName, exchangeName, routingKey);
    console.log(`[x] Bound queue ${queueName} to exchange ${exchangeName} with routing key ${routingKey}`);

    const message = await new Promise((resolve, reject) => {
      channel.consume(queueName, (message) => {
        if (message) {
          console.log(`[x] Received message from exchange ${exchangeName} with routing key ${message.fields.routingKey}: ${message.content.toString()}`);
          resolve(message.content.toString());
        }
      }, { noAck: true });
    });

    await channel.close();
    await connection.close();

    return message;
  } catch (error) {
    console.error('[!] Error getting message:', error.message);
    throw error;
  }
};

const receiveBroadcastMessages = async () => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    const exchange = 'global_notifications_exchange';

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const assertQueueResponse = await channel.assertQueue('', { exclusive: true });
    const queue = assertQueueResponse.queue;

    console.log(`[*] Waiting for broadcast messages in ${queue}. To exit, press CTRL+C`);

    await channel.bindQueue(queue, exchange, '');

    const message = await new Promise((resolve, reject) => {
      channel.consume(queue, (message) => {
        console.log(message);
        if (message && message.content) {
          console.log(`[x] Received broadcast message: ${message.content.toString()}`);
          resolve(message.content.toString());
        }
      }, { noAck: true });
    });

    await channel.close();
    await connection.close();

    return message;
  } catch (error) {
    console.error('[!] Error receiving broadcast message:', error.message);
    throw error;
  }
};

module.exports = { sendMessage, getMessage, receiveBroadcastMessages };
