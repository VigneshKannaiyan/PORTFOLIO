import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/dto/auth.dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('Register =>',createUserDto);
    return await this.userService.create(createUserDto);
  }

  @Post('Login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Login =>',loginDto);
    return await this.authService.login(loginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.log('Refresh =>',req.user);
    return await this.authService.refreshToken(req.user)
  }
}
