import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // अब PrismaService हर module में globally available होगा
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
