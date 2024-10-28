import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dtos/CreateUserDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { AuthenticatedGuard } from '@/session/guards/authenticated.guard';
import { User } from '@/shared/decorators/user.decorator';
import {
  UpdatePasswordDto,
  UpdatePasswordSchema,
} from './dtos/UpdatePasswordDto';

import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  @ApiOperation({ summary: 'Create a new user' })

  @ApiCreatedResponse({ description: 'User successfully created' })

  @ApiResponse({ status: 201, description: 'User successfully created' })
  async createUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) reqBody: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(reqBody);
    return { message: 'User successfully created' };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('password')
  async updatePassword(
    @User() user,
    @Body(new ZodValidationPipe(UpdatePasswordSchema)) body: UpdatePasswordDto,
  ) {
    const hashedPassword = user.hashedPassword;
    const userId = user.id;
    await this.usersService.updateUser(userId, hashedPassword, body);
    return { message: "User's password has been updated" };
  }
}
