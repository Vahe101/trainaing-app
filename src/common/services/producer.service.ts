import { Injectable } from '@nestjs/common';
import { AmqpService } from 'src/common/services';

@Injectable()
export class ProducerService {
  constructor(private readonly amqpService: AmqpService) {}

  async publishEvent<T = unknown>(eventName: string, data?: T) {
    return await this.amqpService.publishEvent(eventName, data);
  }
}
