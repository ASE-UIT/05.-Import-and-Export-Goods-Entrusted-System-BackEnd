import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { User as AuthUser } from '@/shared/decorators/user.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/users/models/user.model';
import { LoginDto } from './dtos/login.dto';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';


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
    type: createResponseType('User successfully logged in', User),
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@AuthUser() user) {
    const { hashedPassword, ...rest } = user;
    return new SuccessResponse('User successfully logged in', rest);
  }

  @ApiOperation({ summary: 'Get logged-in user information' })
  @ApiResponse({
    status: 200,
    description: 'Request successful',
    type: createResponseType('Session info queried successfully', User),
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @UseGuards(AuthenticatedGuard)
  @Get()
  async getLoggedInUser(@AuthUser() user) {
    const { hashedPassword, ...rest } = user;
    return new SuccessResponse('Session info queried successfully', rest);
  }

  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: createResponseType('Successfully logged out', null),
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorException,
    example: new InternalServerErrorException(
      "This shouldn't happen",
    ).getResponse(),
  })
  @UseGuards(AuthenticatedGuard)
  @Delete()
  async logOut(@Req() req) {
    req.logout((err) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
      return new SuccessResponse('Successfully logged out', null);
    });
  }
}
