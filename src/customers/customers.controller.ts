import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor() {}
}
