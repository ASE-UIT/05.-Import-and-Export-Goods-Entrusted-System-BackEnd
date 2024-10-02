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

@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req) {
    const { hashedPassword, ...rest } = req.user;
    return rest;
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getLoggedInUser(@Req() req) {
    const { hashedPassword, ...rest } = req.user;
    return rest;
  }

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
