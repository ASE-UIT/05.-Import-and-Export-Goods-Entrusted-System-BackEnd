import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dtos/create-user.dto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { AuthenticatedGuard } from '@/session/guards/authenticated.guard';
import { User } from '@/shared/decorators/user.decorator';
import {
  UpdatePasswordDto,
  UpdatePasswordSchema,
} from './dtos/update-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: createResponseType('User successfully created', null),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a user',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only admins can create users',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided employeeId does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  async createUser(
    @Body(new ZodValidationPipe(CreateUserSchema)) reqBody: CreateUserDto,
  ) {
    const { hashedPassword, ...rest } =
      await this.usersService.createUser(reqBody);
    return new SuccessResponse('User successfully created', rest);
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'User password updated',
    type: createResponseType('User password updated', null),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @UseGuards(AuthenticatedGuard)
  @Patch(':id/password')
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
    return new SuccessResponse('User password updated', null);
  }
}
