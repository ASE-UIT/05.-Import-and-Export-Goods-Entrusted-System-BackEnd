import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async getCustomers() {
    return 'youve found something';
  }
}
