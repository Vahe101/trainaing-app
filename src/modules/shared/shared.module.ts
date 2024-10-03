import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { entities } from '../entities';
import { AmqpEventModule } from 'src/common/modules';
import { DatabaseModule } from '../database/database.module';

const features = TypeOrmModule.forFeature([...entities]);

@Global()
@Module({
  imports: [
    features,
    ScheduleModule.forRoot(),
    DatabaseModule,
    AmqpEventModule,
  ],
  exports: [features],
})
export class SharedModule {}
