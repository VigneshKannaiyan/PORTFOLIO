import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/dto/auth.dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = {
      userName: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: process.env.JWT_EXPIRES_IN,
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.userName);

    if (user && (await compare(loginDto.password, user.password))) {
      const { password, ...result } = user;
    //   return result;
      return {
        id: result.id,
        email: result.email,
        name: result.name,
      };
    }

    throw new UnauthorizedException();
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.sub,
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: process.env.JWT_EXPIRES_IN,
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }
}
