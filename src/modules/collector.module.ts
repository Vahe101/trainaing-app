import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, CarModule],
})
export class CollectorModule {}
