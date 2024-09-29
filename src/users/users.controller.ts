import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserStrategy } from './strategies/find-user/find-user-strategy.enum';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    await this.usersService.createUser();
    return await this.usersService.findUser(
      FindUserStrategy.USERNAME,
      'testuser',
    );
  }
}
