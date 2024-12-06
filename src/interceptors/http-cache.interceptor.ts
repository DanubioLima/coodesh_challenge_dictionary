import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected allowedMethods = ['GET'];

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    if (!this.allowedMethods.includes(request.method)) {
      return undefined;
    }

    return `${request.user.id}-${request.url}`;
  }
}
