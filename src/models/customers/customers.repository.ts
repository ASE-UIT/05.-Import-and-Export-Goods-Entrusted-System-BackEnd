import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersRepository {
  constructor() {}

  async getCustomers() {
    return 'youve found something';
  }
}
