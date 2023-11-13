import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { DatabaseModule } from './prisma/database.module';

@Module({
  imports: [DatabaseModule,AnimalModule],
})
export class AppModule {}
