import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { AMQP_HANDLER } from '../modules';
import { AmqpService } from './amqp.service';
import { CONSUMER_EVENT } from '../decorators';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private eventHandlers = new Map<string, Function>();

  constructor(
    private readonly reflector: Reflector,
    private readonly amqpService: AmqpService,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async handleEvent(eventName: string, payload: any) {
    const handler = this.eventHandlers.get(eventName);
    if (handler) {
      await handler(payload);
    } else {
      console.warn(`No handler for event: ${eventName}`);
    }
  }

  async onModuleInit() {
    const providers = this.discoveryService.getProviders();

    const customProviders = providers.filter((provider: InstanceWrapper) => {
      // console.log(provider);
      return (
        provider.metatype &&
        provider.token !== 'nestjs:external-context' &&
        provider.token !== 'ModuleRef'
      );
    });

    customProviders.forEach((provider) => {
      const instance = provider.instance;

      if (instance) {
        const prototype = Object.getPrototypeOf(instance);
        const methods = Object.getOwnPropertyNames(prototype);

        methods.forEach((methodName) => {
          const method = prototype[methodName];

          if (method) {
            const eventName = this.reflector.get<string>(
              CONSUMER_EVENT,
              method,
            );

            // console.log(prototype, methodName, method, eventName);
            if (eventName) {
              const handler = instance[methodName]?.bind(instance);

              if (handler) this.eventHandlers.set(eventName, handler);
            }
          }
        });
      }
    });

    await this.amqpService.consumeEvent(await this.handleEvent.bind(this));
  }
}
