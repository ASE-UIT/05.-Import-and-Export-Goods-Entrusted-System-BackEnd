import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateRoleDto, CreateRoleSchema } from './dtos/CreateRoleDto';

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async createRole(
    @Body(new ZodValidationPipe(CreateRoleSchema)) body: CreateRoleDto,
  ) {
    const role = await this.rolesService.createRole(body);
    return { message: 'Role created successfully' };
  }
}
