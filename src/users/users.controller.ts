import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dtos/CreateUserDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) reqBody: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(reqBody);
    return { message: 'User successfully created' };
  }
}
