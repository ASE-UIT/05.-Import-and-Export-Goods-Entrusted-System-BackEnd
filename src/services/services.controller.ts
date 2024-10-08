import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateServiceDto, CreateServiceSchema } from './dtos/CreateServiceDto';
import { UpdateServiceDto, UpdateServiceSchema } from './dtos/UpdateServiceDto';
import { QueryServiceDto, QueryServiceSchema } from './dtos/QueryServiceDto';

@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private serviceService: ServicesService) {}

  // Tạo service mới
  @Post()
  async createService(
    @Body(new ZodValidationPipe(CreateServiceSchema)) body: CreateServiceDto,
  ) {
    await this.serviceService.create(body);
    return { message: `Service created` };
  }

  @Get()
  async getQuotations(
    @Query(new ZodValidationPipe(QueryServiceSchema))
    query: QueryServiceDto,
  ) {
    return this.serviceService.findServices(query);
  }

  // Cập nhật service theo id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) body: UpdateServiceDto,
  ) {
    const updateResponse = await this.serviceService.update(id, body);
    return updateResponse;
  }
}
