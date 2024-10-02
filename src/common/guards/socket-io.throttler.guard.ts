import { Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler'

@Injectable()
export class SocketIoThrottlerGuard extends ThrottlerGuard {
  async handleRequest({
    context,
    limit,
    ttl,
    throttler,
    blockDuration,
    generateKey,
  }: ThrottlerRequest): Promise<boolean> {
    const client = context.switchToWs().getClient()
    const tracker = client.conn.remoteAddress
    const key = generateKey(context, tracker, throttler.name)
    const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } =
      await this.storageService.increment(
        key,
        ttl,
        limit,
        blockDuration,
        throttler.name,
      )

    // Throw an error when the user reached their limit.
    if (isBlocked) {
      await this.throwThrottlingException(context, {
        limit,
        ttl,
        key,
        tracker,
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire,
      })
    }

    return true
  }
}
