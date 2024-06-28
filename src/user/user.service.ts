import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/user.dto/user.dto';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new ConflictException(
        'Given email is already in use! Kindly check the email.',
      );
    }

    const newUser = this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      },
    });

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Given email not found!');
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Given id not found!');
    }

    return user;
  }
}
