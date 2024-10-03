import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Injectable, SetMetadata } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from 'src/modules/entities';
import { CREATE_MOCK_CAR } from 'src/utils';
import { AmqpService } from 'src/common/services';
import { ConsumerEvent } from 'src/common/decorators';
import { CarTypes, CreateCarRequest, CreateMockCarRequest } from '../types';

@Injectable()
export class CarConsumerService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly amqpService: AmqpService,
  ) {
    this.amqpService.consumeEvent(this.handleCarEvent.bind(this));
  }

  @ConsumerEvent(CREATE_MOCK_CAR)
  async handleCarEvent({ quantity }: CreateMockCarRequest) {
    try {
      const queryBuilder = await this.carRepository.createQueryBuilder();
      const chunkSize = 10000;
      const carPromises: CreateCarRequest[] = [];
      let count = await this.carRepository.count();

      do {
        for (let i = 0; i < quantity; i++) {
          carPromises.push({
            type: faker.helpers.arrayElement(Object.values(CarTypes)),
            model: faker.vehicle.model(),
            location: `POINT(${faker.location.latitude()} ${faker.location.longitude()})`,
            mileage: faker.number.int({ min: 0, max: 300000 }),
            year: faker.date
              .past({
                years: 30,
              })
              .getFullYear(),
            color: faker.color.human(),
          });

          if (carPromises.length === chunkSize) {
            const carBatch = await Promise.all(carPromises);
            await queryBuilder.insert().into(Car).values(carBatch).execute();

            carPromises.length = 0;
            count = await this.carRepository.count();
            console.log(`Inserted ${i + 1}/${quantity} rows.`);
          }
        }
      } while (count < quantity);
    } catch (error) {
      console.error('Error processing car_created event:', error);
    }
  }
}
