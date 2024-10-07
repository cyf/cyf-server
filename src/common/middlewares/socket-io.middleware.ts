import { I18nContext, I18nService } from 'nestjs-i18n'
import { fallbackLanguage } from '../constants'
import logger from '../logger/logger'
import type { SocketWithI18nContext } from '@/types/i18n'

export const socketIoMiddleware =
  (i18nService: I18nService<any>) =>
  async (socket: SocketWithI18nContext, next) => {
    const locale =
      socket.handshake.headers['accept-language'] ||
      socket.handshake.headers['x-locale'] ||
      socket.handshake.query['x-locale'] ||
      fallbackLanguage

    logger.debug('locale', locale)
    const i18nContext: I18nContext = new I18nContext<Record<string, unknown>>(
      locale as string,
      i18nService,
      socket.i18nContext.i18nOptions,
    )
    socket.i18nContext = i18nContext
    next()
  }
