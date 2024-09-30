import { Controller } from '@nestjs/common';

@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor() {}
}
