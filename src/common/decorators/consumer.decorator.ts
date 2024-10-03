import { SetMetadata } from '@nestjs/common';

export const CONSUMER_EVENT = 'CONSUMER_EVENT';

export const ConsumerEvent = (eventName: string) =>
  SetMetadata(CONSUMER_EVENT, eventName);
