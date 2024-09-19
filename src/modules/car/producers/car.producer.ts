import * as amqp from 'amqplib';
import { modelingCar } from 'src/utils';

const produceCars = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'car_jobs';

  await channel.assertQueue(queue, { durable: true });

  setInterval(async () => {
    const cars = Array.from({ length: 1000000 }, () => modelingCar());

    for (let i = 0; i < cars.length; i += 10000) {
      const batch = cars.slice(i, i + 10000);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(batch)), {
        persistent: true,
      });
    }
    console.log('1 million car jobs added to the queue');
  }, 60000); // Every minute
};

produceCars().catch(console.error);
