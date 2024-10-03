import { DiscoveryModule } from '@nestjs/core';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import {
  AmqpService,
  ConsumerService,
  ProducerService,
} from 'src/common/services';
import { CONSUMER_EVENT, PRODUCER_EVENT } from 'src/common/decorators';

export const AMQP_HANDLER = 'AMQP_HANDLER';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [ProducerService, ConsumerService, MetadataScanner, AmqpService],
  exports: [AmqpService, ProducerService, ConsumerService],
})
export class AmqpEventModule implements OnModuleInit {
  constructor(
    private readonly amqpService: AmqpService,
    private readonly metadataScanner: MetadataScanner,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance } = wrapper;

      if (instance) {
        this.metadataScanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          (key) => {
            const producerEvent = Reflect.getMetadata(
              PRODUCER_EVENT,
              instance[key],
            );
            const consumerEvent = Reflect.getMetadata(
              CONSUMER_EVENT,
              instance[key],
            );

            if (producerEvent) {
              this.bindProducer(instance, key, producerEvent);
            }

            if (consumerEvent) {
              this.bindConsumer(instance, key, consumerEvent);
            }
          },
        );
      }
    }
  }

  bindProducer(instance: any, methodKey: string, eventName: string) {
    instance[methodKey] = (...args: any[]) => {
      this.amqpService.publishEvent(eventName, args[0]);
    };
  }

  bindConsumer(instance: any, methodKey: string, eventName: string) {
    this.amqpService.consumeEvent((msg) => {
      if (msg.eventName === eventName) {
        instance[methodKey](msg.payload);
      }
    });
  }
}
