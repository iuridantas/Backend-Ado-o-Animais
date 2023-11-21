import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HandleException } from 'src/utils/exceptions/exceptionsHelper';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (err) {
      HandleException(err);
      throw new BadRequestException(err.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/all')
  async findAll() {
    try {
      return this.userService.findAll();
    } catch (err) {
      HandleException(err);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/find/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(id);
    } catch (err) {
      HandleException(err);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Patch('/update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.update(updateUserDto);
    } catch (err) {
      HandleException(err);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (err) {
      HandleException(err);
    }
  }
}
