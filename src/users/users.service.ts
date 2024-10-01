import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { FindUserByEmailStrategy } from './strategies/find-user/find-by-email.strategy';
import { FindUserByUsernameStrategy } from './strategies/find-user/find-by-username.strategy';
import { FindUserStrategy } from './strategies/find-user/find-user-strategy.enum';
import { IFindUserStrategy } from './strategies/find-user/find-user-strategy.interface';

@Injectable()
export class UsersService {
  constructor(
    private findUserByUsernameStrategy: FindUserByUsernameStrategy,
    private findUserByEmailStrategy: FindUserByEmailStrategy,
  ) {}

  private async checkDuplicate(
    username: string,
    email: string,
  ): Promise<{ username: boolean; email: boolean }> {
    // Check if the username is already taken
    const nameExists = await this.findUser(FindUserStrategy.USERNAME, username);
    if (nameExists) {
      return { username: true, email: false };
    }

    // Check if the email is already taken
    const emailExists = await this.findUser(FindUserStrategy.EMAIL, email);
    if (emailExists) {
      return { username: false, email: true };
    }

    return { username: false, email: false };
  }

  private getFindStrategy(strategy: FindUserStrategy): IFindUserStrategy {
    switch (strategy) {
      case FindUserStrategy.USERNAME:
        return this.findUserByUsernameStrategy;
      case FindUserStrategy.USERNAME:
        return this.findUserByEmailStrategy;
      default:
        throw new Error('Invalid strategy');
    }
  }

  // This is for demonstration purposes only
  async createUser(): Promise<void> {
    const { username, email } = await this.checkDuplicate(
      'testuser',
      'testuser@email.com',
    );

    if (username) throw new ConflictException('Username already exists');
    if (email) throw new ConflictException('Email already exists');

    // Create a new user
    const user = new User();
    user.username = 'testuser';
    user.name = 'Test User';
    user.email = 'testuser@email.com';
    user.hashedPassword = 'password';

    await user.save();
  }

  async findUser(
    strategy: FindUserStrategy,
    userInfo: string,
  ): Promise<User | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const user: User | null = await findStrategy.find(userInfo);
    return user;
  }
}
