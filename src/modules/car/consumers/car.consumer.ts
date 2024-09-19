import { Pool } from 'pg';
import * as amqp from 'amqplib';

const consumeCars = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'car_jobs';

  await channel.assertQueue(queue, { durable: true });

  const pool = new Pool({
    user: 'testuser',
    host: 'rabbitmq',
    database: 'training-app',
    password: 'testpassword',
    port: 5432,
  });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const cars = JSON.parse(msg.content.toString());
      const client = await pool.connect();

      // const manager = client.carRepository.manager;

      // const result = await manager.query(
      //   'SELECT pg_try_advisory_lock(123456789)',
      // );
      // if (!result[0].pg_try_advisory_lock) {
      //   console.log('Another pod is seeding the database. Exiting...');
      //   return;
      // }

      try {
        await client.query('BEGIN');
        for (const car of cars) {
          await client.query(
            'INSERT INTO cars(type, model, location, mileage, year, color) VALUES($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7)',
            [
              car.type,
              car.model,
              car.location.lon,
              car.location.lat,
              car.mileage,
              car.year,
              car.color,
            ],
          );
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing message', error);
      } finally {
        client.release();
      }

      channel.ack(msg);
    }
  });

  console.log('Consumer service is running');
};

consumeCars().catch(console.error);
