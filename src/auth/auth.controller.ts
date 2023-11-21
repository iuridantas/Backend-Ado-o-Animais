import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { logged } from './decorators/user-logged.decorator';
import { AuthGuard } from '@nestjs/passport';
import { HandleException } from 'src/utils/exceptions/exceptionsHelper';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUser(@Body() user: CreateAuthDto) {
    try {
      return this.authService.validateUser(user);
    } catch (error) {
      HandleException(error);
    }
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async get(@logged() data: any) {
    return data;
  }
}
