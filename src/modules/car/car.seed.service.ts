import { Injectable } from '@nestjs/common';
import { CREATE_MOCK_CAR } from 'src/utils';
import { ProducerService } from 'src/common';
import { CAR_INITIAL_SEED_QUANTITY } from 'src/common/constants';

@Injectable()
export class CarSeedService {
  constructor(private readonly producer: ProducerService) {}

  async onModuleInit() {
    await this.seedCars();
  }

  private async seedCars() {
    await this.producer.publishEvent(CREATE_MOCK_CAR, {
      quantity: CAR_INITIAL_SEED_QUANTITY,
    });
  }
}
