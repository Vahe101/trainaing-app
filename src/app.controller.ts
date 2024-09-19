import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  heath() {
    console.log(111111111111);
    return 'yeyy';
  }
}
