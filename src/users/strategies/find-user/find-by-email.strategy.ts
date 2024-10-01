import { Injectable } from '@nestjs/common';
import { IFindUserStrategy } from './find-user-strategy.interface';
import { User } from '@/users/models/user.model';

@Injectable()
export class FindUserByEmailStrategy implements IFindUserStrategy {
  find(userInfo: string): Promise<User | null> {
    return User.findOne({ where: { email: userInfo } });
  }
}
