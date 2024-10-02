import { FindUserStrategy } from '@/users/strategies/find-user/find-user-strategy.enum';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class SessionService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<unknown> {
    const user = await this.usersService.findUser(
      FindUserStrategy.USERNAME,
      username,
    );

    if (user && (await argon2.verify(user.hashedPassword, password))) {
      const { hashedPassword, ...rest } = user;
      return rest;
    }
    return null;
  }
}
