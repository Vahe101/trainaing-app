import { SetMetadata } from '@nestjs/common';

export const PRODUCER_EVENT = 'PRODUCER_EVENT';

export const ProducerEvent = (eventName: string) =>
  SetMetadata(PRODUCER_EVENT, eventName);
