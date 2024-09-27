import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
  }
}
