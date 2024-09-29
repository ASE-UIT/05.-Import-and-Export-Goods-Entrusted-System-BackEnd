import { User } from '@/users/models/user.model';

export interface IFindUserStrategy {
  find(userInfo: string): Promise<User | null>;
}
