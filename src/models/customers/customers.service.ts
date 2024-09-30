import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(private repository: CustomersRepository) {}
  async getCustomers() {
    return this.repository.getCustomers();
  }
}
