import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CarModule],
})
export class CollectorModule {}
