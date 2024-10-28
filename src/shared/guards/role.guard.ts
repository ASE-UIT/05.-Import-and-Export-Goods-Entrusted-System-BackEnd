import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum } from '../enums/roles.enum';
import { Roles } from '../decorators/role.decorator';
import { User } from '@/users/models/user.model';
import { use } from 'passport';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    const roles = this.reflector.get<RoleEnum[]>(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const userRole = (request.user as User).role.name.toUpperCase() as RoleEnum;

    if (roles.includes(userRole)) {
      return true;
    }

    throw new UnauthorizedException(
      'You do not have the required role to perform this action',
    );
  }
}
