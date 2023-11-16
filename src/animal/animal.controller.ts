import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ApiTags } from '@nestjs/swagger';
import { HandleException } from 'src/utils/exceptions/exceptionsHelper';
import { AnimalStatus } from '@prisma/client';

@ApiTags('animals')
@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post('/create')
  async create(@Body() createAnimalDto: CreateAnimalDto) {
    try {
      return this.animalService.create(createAnimalDto);
    } catch (err) {
      HandleException(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('/all')
  async findAll() {
    try {
      return this.animalService.findAll();
    } catch (err) {
      HandleException(err);
    }
  }

  @Get('/find/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.animalService.findOne(id);
    } catch (err) {
      HandleException(err);
    }
  }

  @Patch('/update')
  async update(@Body() updateAnimalDto: UpdateAnimalDto) {
    try {
      return this.animalService.update(updateAnimalDto);
    } catch (err) {
      HandleException(err);
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      return this.animalService.remove(id);
    } catch (err) {
      HandleException(err);
    }
  }

  @Patch('/updateStatus/:id')
  async toggleStatus(@Param('id') id: string) {
    try {
      const animal = await this.animalService.findOne(id);

      const newStatus =
        animal.status === AnimalStatus.AVAILABLE
          ? AnimalStatus.ADOPTED
          : AnimalStatus.AVAILABLE;
      return this.animalService.updateStatus(id, newStatus);
    } catch (err) {
      HandleException(err);
    }
  }
  @Get('/byTerm')
  async findAllByTerm(@Query('term') term: string) {
    try {
      return this.animalService.findAllByTerm(term);
    } catch (err) {
      HandleException(err);
    }
  }

  @Get('/byCategory')
  async findAllByCategory(@Query('category') category: string) {
    try {
      return this.animalService.findAllByCategory(category);
    } catch (err) {
      HandleException(err);
    }
  }

  @Get('/byStatus')
  async findAllByStatus(@Query('status') status: AnimalStatus) {
    try {
      return this.animalService.findAllByStatus(status);
    } catch (err) {
      HandleException(err);
    }
  }

  @Get('/byCreationDate')
  async findAllByCreationDate(@Query('creationDate') creationDate: Date) {
    try {
      return this.animalService.findAllByCreationDate(new Date(creationDate));
    } catch (err) {
      HandleException(err);
    }
  }
}
