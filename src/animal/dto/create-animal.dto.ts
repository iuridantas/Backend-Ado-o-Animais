import { ApiProperty } from '@nestjs/swagger';
import { AnimalStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateAnimalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  creationDate: Date;

  @ApiProperty({ enum: AnimalStatus, enumName: 'AnimalStatus' })
  @IsEnum(AnimalStatus)
  @IsNotEmpty()
  status: AnimalStatus;
}
