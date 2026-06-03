import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ContentsModule } from './contents/contents.module'
import { MediaModule } from './media/media.module'
import { SchedulerModule } from './scheduler/scheduler.module'
import { PublicModule } from './public/public.module'
import { SearchModule } from './search/search.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { NotificationsModule } from './notifications/notifications.module'
import { JwtStrategy } from './common/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'change_me_long_secret',
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
      }),
    }),
    ScheduleModule.forRoot(),
    ContentsModule,
    MediaModule,
    SchedulerModule,
    PublicModule,
    SearchModule,
    AnalyticsModule,
    NotificationsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
