import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dtos/CreateRoleDto';
import { Role } from './models/role.model';

@Injectable()
export class RolesService {
  async createRole({ roleName }: CreateRoleDto) {
    const isExist = await this.isRoleExist(roleName);
    if (isExist) throw new ConflictException('Role already exist');

    const role = new Role();
    role.name = roleName;

    return await role.save();
  }

  private async isRoleExist(roleName: string): Promise<boolean> {
    const role = await Role.findOne({ where: { name: roleName } });
    if (role) return true;
    return false;
  }
}
