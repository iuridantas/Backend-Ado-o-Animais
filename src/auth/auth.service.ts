import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { Exception } from 'src/utils/exceptions/exception';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: CreateAuthDto) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new Exception(
        Exceptions.UnauthorizedException,
        'Email não cadastrado',
      );
    }

    const passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) {
      throw new Exception(Exceptions.UnauthorizedException, 'Senha invalida');
    }

    delete user.password;

    return {
      token: this.jwtService.sign({
        email: user.email,
        id: user.id,
        name: user.name,
      }),
      user,
    };
  }

  async getUserEmail(email: string): Promise<User> {
    return await this.userService.findUserByEmail(email);
  }
}
