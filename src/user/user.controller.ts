import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { request } from 'https';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    console.log('Get User By Id =>',id);

    // ********************** Added to avoid the query error String to Hex String ********************** //
    // Convert the number to a hex string
    const hexStr = id.toString();

    // Pad the hex string to ensure it is 24 characters long
    const paddedHexStr = hexStr.padStart(24, '0').slice(-24);
    // ************************************************************************************************** //

    return await this.userService.findById(paddedHexStr);
  }
}
