import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  // just for unit testing
  async createUser(data: {
    username: string;
    name?: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }
}
