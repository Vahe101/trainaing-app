import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = request.headers['x-trace-id'] as string;
    const start = Date.now();

    this.logger.log(`[${traceId}] Request processing started`);

    try {
      const result = await next.handle().toPromise();
      const responseTime = Date.now() - start;
      this.logger.log(
        `[${traceId}] Request processing completed in ${responseTime}ms`,
      );
      return result;
    } catch (error) {
      const responseTime = Date.now() - start;
      this.logger.error(
        `[${traceId}] Request processing failed after ${responseTime}ms`,
        error.stack,
      );
      throw error;
    }
  }
}
