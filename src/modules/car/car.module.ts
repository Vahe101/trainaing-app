import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CarSeedService } from './car.seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarController],
  providers: [CarService, CarSeedService],
})
export class CarModule {}
