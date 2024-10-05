import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums/roles.enum';

export const Roles = Reflector.createDecorator<RoleEnum[]>();
