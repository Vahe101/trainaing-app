import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { CREATE_MOCK_CAR } from 'src/utils';
import { ProducerService } from 'src/common';
import { MOCK_CAR_PER_MINUTE_QUANTITY } from 'src/common/constants';

@Injectable()
export class CarCronService {
  constructor(private readonly producer: ProducerService) {}

  // For Run every minute my cron
  @Cron('*/1 * * * *')
  async generateCarEvent() {
    await this.producer.publishEvent(CREATE_MOCK_CAR, {
      quantity: MOCK_CAR_PER_MINUTE_QUANTITY,
    });
  }
}
