import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum } from '../enums/roles.enum';
import { Roles } from '../decorators/role.decorator';
import { User } from '@/users/models/user.model';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException(
        'Only authenticated users can access this resource',
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

    throw new ForbiddenException(
      'Only users with the following roles can access this resource: ' + roles,
    );
  }
}
