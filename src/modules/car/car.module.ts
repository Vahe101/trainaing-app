import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarSeedService } from './car.seed.service';
import { CarCronService } from './car.cron.service';
import { CarConsumerService } from './consumers/car.consumer.service';

@Module({
  controllers: [CarController],
  providers: [CarConsumerService, CarCronService, CarService, CarSeedService],
})
export class CarModule {}
