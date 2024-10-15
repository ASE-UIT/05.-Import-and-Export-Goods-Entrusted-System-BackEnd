import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './models/user.model';
import { FindUserByIdStrategy } from './strategies/find-user/find-by-id.strategy';
import { FindUserByUsernameStrategy } from './strategies/find-user/find-by-username.strategy';
import { FindUserStrategy } from './strategies/find-user/find-user-strategy.enum';
import { IFindUserStrategy } from './strategies/find-user/find-user-strategy.interface';
import { CreateUserDto } from './dtos/CreateUserDto';
import * as argon2 from 'argon2';
import { Role } from '@/roles/models/role.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { UpdatePasswordDto } from './dtos/UpdatePasswordDto';

@Injectable()
export class UsersService {
  constructor(
    private findUserByUsernameStrategy: FindUserByUsernameStrategy,
    private findUserByIdStrategy: FindUserByIdStrategy,
  ) {}

  private async checkDuplicate(username: string): Promise<boolean> {
    const nameExists = await this.findUser(FindUserStrategy.USERNAME, username);

    return nameExists ? true : false;
  }

  private getFindStrategy(strategy: FindUserStrategy): IFindUserStrategy {
    switch (strategy) {
      case FindUserStrategy.USERNAME:
        return this.findUserByUsernameStrategy;
      case FindUserStrategy.ID:
        return this.findUserByIdStrategy;
      default:
        throw new Error('Invalid strategy');
    }
  }

  async createUser({
    username,
    password,
    employeeId,
  }: CreateUserDto): Promise<void> {
    // Get default role
    const defaultRole = await Role.findOne({ where: { name: 'USER' } });

    // Create a new user
    const user = new User();
    const passwordHash = await argon2.hash(password);

    user.username = username;
    user.roleId = defaultRole.id;
    user.hashedPassword = passwordHash;
    user.employeeId = employeeId;

    try {
      await user.save();
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException("Employee doesn't exist");
      } else if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }

  async findUser(
    strategy: FindUserStrategy,
    userInfo: string,
  ): Promise<User | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const user: User | null = await findStrategy.find(userInfo);
    return user;
  }

  async updateUser(
    userId: string,
    hashedPassword: string,
    body: UpdatePasswordDto,
  ) {
    const oldPasswordCorrect = await argon2.verify(
      hashedPassword,
      body.oldPassword,
    );
    if (!oldPasswordCorrect)
      throw new UnauthorizedException('Incorrect password');
    const newHashedPassword = await argon2.hash(body.newPassword);
    await User.update(
      { hashedPassword: newHashedPassword },
      { where: { id: userId } },
    );
  }
}
