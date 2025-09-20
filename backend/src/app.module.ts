import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,  // Database connection
    AuthModule,    // JWT Auth
    UsersModule,   // User CRUD
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
