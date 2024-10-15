import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateServiceDto, CreateServiceSchema } from './dtos/CreateServiceDto';
import { QueryServiceDto, QueryServiceSchema } from './dtos/QueryServiceDto';
import { FindServiceStrategy } from './strategies/find-service/find-service-strategy.enum';

@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private serviceService: ServicesService) {}
  @Post()
  async createService(
    @Body(new ZodValidationPipe(CreateServiceSchema)) body: CreateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    const createRes = await this.serviceService.create(body);
    return createRes;
  }

  @Get()
  async findService(
    @Query(new ZodValidationPipe(QueryServiceSchema))
    query: QueryServiceDto,
  ): Promise<Service[]> {
    if (Object.keys(query).length === 0) {
      return this.serviceService.find(FindServiceStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindServiceStrategy } = {
      name: FindServiceStrategy.NAME,
      shortName: FindServiceStrategy.SHORTNAME,
      fee: FindServiceStrategy.FEE,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryServiceDto];
      if (value) {
        const service = await this.serviceService.find(strategy, value);

        if (service.length > 0) {
          if (strategy === FindServiceStrategy.ALL || service.length > 1)
            return service;
          else return [service[0]];
        }
      }
    }

    throw new NotFoundException('Service not found');
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateServiceSchema.partial()))
    body: Partial<CreateServiceDto>,
  ): Promise<{ message: string; data: Service }> {
    const updateRes = await this.serviceService.update(id, body);
    return updateRes;
  }
}
