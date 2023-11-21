import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Exception } from 'src/utils/exceptions/exception';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    try {
      return await this.prisma.user.create({ data: user });
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'cpf ou email ja cadastrados',
      );
    }
  }

  async updateUser(user: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: user,
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id: id },
      });
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Usuário não encontrado',
      );
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id: id },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { email: email },
      });
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'usuário não encontrado com este e-mail',
      );
    }
  }
}
