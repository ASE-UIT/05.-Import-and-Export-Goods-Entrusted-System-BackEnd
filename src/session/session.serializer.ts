import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@/users/models/user.model';
import { Employee } from '@/employees/models/employee.model';
import { UsersService } from '@/users/users.service';
import { FindUserStrategy } from '@/users/strategies/find-user/find-user-strategy.enum';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error | null, id?: string) => void,
  ): void {
    done(null, user.id);
  }

  async deserializeUser(
    userId: string,
    done: (err: Error | null, user?: User) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.findUser(
        FindUserStrategy.ID,
        userId,
      );

      done(null, user!!);
    } catch (error) {
      done(error);
    }
  }
}
