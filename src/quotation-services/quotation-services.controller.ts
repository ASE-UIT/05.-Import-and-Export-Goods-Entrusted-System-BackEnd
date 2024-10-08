import { Controller } from '@nestjs/common';

@Controller({
  path: 'quotation-services',
  version: '1',
})
// Có cần cru bảng này không ?
export class QuotationServicesController {
  constructor() {}
}
