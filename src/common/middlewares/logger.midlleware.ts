import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = uuidv4();
    req.headers['x-trace-id'] = traceId;

    const start = Date.now();
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      this.logger.log(
        `Request: ${req.method} ${req.originalUrl} - Response Time: ${responseTime}ms - Trace ID: ${traceId}`,
      );
    });

    next();
  }
}
