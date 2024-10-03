import {
  connect,
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class AmqpService implements OnModuleDestroy {
  private channelWrapper: ChannelWrapper;
  private connection: AmqpConnectionManager;

  constructor(private readonly configService: ConfigService) {
    this.initConnection();
  }

  private async initConnection() {
    this.connection = connect([
      this.configService.get<string>('AMQP_CONNECTION_URL'),
    ]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) => {
        return channel.assertQueue('events', { durable: true });
      },
    });

    this.connection.on('connect', () => {
      console.log('Connected to AMQP server.');
    });

    this.connection.on('disconnect', (err) => {
      console.error('Disconnected from AMQP server.', err);
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  async publishEvent(eventName: string, payload: any) {
    await this.channelWrapper.sendToQueue('events', { eventName, payload });
  }

  async consumeEvent(consumerFn: (msg: any) => void) {
    await this.channelWrapper.addSetup((channel) => {
      return channel.consume('events', (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          consumerFn(content);
          channel.ack(msg);
        }
      });
    });
  }
}
