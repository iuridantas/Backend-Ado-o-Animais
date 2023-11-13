import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { AnimalRepository } from './animal.repository';
import { DatabaseModule } from 'src/prisma/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AnimalController],
  providers: [AnimalService, AnimalRepository]
})
export class AnimalModule {}
