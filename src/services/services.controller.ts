import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreateServiceDto, CreateServiceSchema } from './dtos/CreateServiceDto';
import { UpdateServiceDto, UpdateServiceSchema } from './dtos/UpdateServiceDto';

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

  // Lấy service
  @Get()
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  // Lấy service theo tên
  @Get('name/:name')
  getServiceByName(@Param('name') name: string): Promise<Service> {
    return this.serviceService.getServiceByName(name);
  }

  // Lấy service theo shortName
  @Get('shortName/:shortName')
  getServiceByShortName(
    @Param('shortName') shortName: string,
  ): Promise<Service> {
    return this.serviceService.getServiceByShortName(shortName);
  }

  // Lấy service theo fee
  @Get('fee/:fee')
  getServiceByFee(@Param('fee') fee: number): Promise<Service> {
    return this.serviceService.getServiceByFee(fee);
  }

  // Cập nhật service theo id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateServiceSchema)) body: UpdateServiceDto,
  ) {
    await this.serviceService.update(id, body);
    return { message: `Service with ID ${id} was updated` };
  }
}
