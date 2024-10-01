import { Controller } from '@nestjs/common';

@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor() {}
}
