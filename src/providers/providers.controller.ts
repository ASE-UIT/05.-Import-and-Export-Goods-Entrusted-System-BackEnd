import { Controller } from '@nestjs/common';

@Controller({
  path: 'providers',
  version: '1',
})
export class ProvidersController {
  constructor() {}
}
