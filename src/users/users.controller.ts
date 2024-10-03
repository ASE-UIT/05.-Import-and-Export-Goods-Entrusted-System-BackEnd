import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dtos/CreateUserDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  async createUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) reqBody: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(reqBody);
    return { message: 'User successfully created' };
  }
}
