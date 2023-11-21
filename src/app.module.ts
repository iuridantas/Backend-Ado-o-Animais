import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { DatabaseModule } from './prisma/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, AnimalModule],
})
export class AppModule {}
