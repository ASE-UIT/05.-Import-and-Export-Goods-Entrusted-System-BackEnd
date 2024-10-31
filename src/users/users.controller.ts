import {
  Body,
  Controller,
  ForbiddenException,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  async createUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) reqBody: CreateUserDto,
  ) {
    const user = await this.usersService.createUser(reqBody);
    return { message: 'User successfully created' };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'User password updated' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  async updatePassword(
    @User() user,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePasswordSchema)) body: UpdatePasswordDto,
  ) {
    const userId = user.id;
    if (userId !== id)
      throw new ForbiddenException("You can't update this user's password");

    const hashedPassword = user.hashedPassword;
    await this.usersService.updateUser(userId, hashedPassword, body);
    return { message: "User's password has been updated" };
  }
}
