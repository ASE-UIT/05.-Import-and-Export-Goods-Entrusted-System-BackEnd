import { Injectable } from '@nestjs/common';
import { IFindUserStrategy } from './find-user-strategy.interface';
import { User } from '@/users/models/user.model';
import { Employee } from '@/employees/models/employee.model';
import { Role } from '@/roles/models/role.model';

@Injectable()
export class FindUserByIdStrategy implements IFindUserStrategy {
  async find(userInfo: string): Promise<User | null> {
    const result = await User.findOne({
      where: { id: userInfo },
      attributes: { exclude: ['employeeId', 'roleId'] },
      include: [
        {
          model: Employee,
          attributes: { exclude: ['userId'] },
        },
        {
          model: Role,
          attributes: { exclude: ['userId'] },
        }
      ],
      raw: true,
      nest: true,
    });

    return result;
  }
}
