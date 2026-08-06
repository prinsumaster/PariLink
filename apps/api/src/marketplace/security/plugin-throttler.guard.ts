import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class PluginApiThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // If it's a plugin making the request, throttle by their API Key to sandbox their usage
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      return `plugin_api_key_${apiKey}`;
    }

    // Otherwise fallback to IP
    return req.ips?.length ? req.ips[0] : req.ip;
  }
}
