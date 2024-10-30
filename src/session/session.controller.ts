import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { User as AuthUser } from '@/shared/decorators/user.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@/users/dtos/CreateUserDto';
import { User } from '@/users/models/user.model';
import { LoginDto } from './dtos/LoginDto';

@ApiTags('session')
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  @ApiOperation({ summary: 'Log in' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: User,
  })
  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiResponse({ status: 401, description: 'Not logged in' })
  async login(@AuthUser() user) {
    const { hashedPassword, ...rest } = user;
    return rest;
  }

  @ApiOperation({ summary: 'Get logged-in user information' })
  @ApiResponse({ status: 200, description: 'Request successful', type: User })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @UseGuards(AuthenticatedGuard)
  @Get()
  async getLoggedInUser(@AuthUser() user) {
    const { hashedPassword, ...rest } = user;
    return rest;
  }

  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @UseGuards(AuthenticatedGuard)
  @Delete()
  async logOut(@Req() req) {
    req.logout((err) => {
      if (err) {
        throw new InternalServerErrorException();
      }
    });
  }
}
