import { INestApplication, Injectable } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { I18nService } from 'nestjs-i18n'
import { socketIoMiddleware } from '@/common/middlewares/socket-io.middleware'

@Injectable()
export class CustomSocketIoAdapter extends IoAdapter {
  constructor(readonly app: INestApplication) {
    super(app)
  }
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options)
    const i18nService = this.app.get(I18nService)
    server.use(socketIoMiddleware(i18nService))
    return server
  }
}
