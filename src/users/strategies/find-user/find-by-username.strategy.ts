import { Injectable } from '@nestjs/common';
import { IFindUserStrategy } from './find-user-strategy.interface';
import { User } from '@/users/models/user.model';
import { Employee } from '@/employees/models/employee.model';
import { Role } from '@/roles/models/role.model';

@Injectable()
export class FindUserByUsernameStrategy implements IFindUserStrategy {
  async find(userInfo: string): Promise<User | null> {
    const result = await User.findOne({
      where: { username: userInfo },
      attributes: { exclude: ['employeeId', 'roleId'] },
      raw: true,
      nest: true,
    });

    return result;
  }
}
