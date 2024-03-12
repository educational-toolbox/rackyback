import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthService } from './clerk-auth.service';

@Module({
  providers: [
    {
      provide: AuthService,
      async useFactory() {
        // Check from db or something if we should use Clerk or our own auth
        return new ClerkAuthService();
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
