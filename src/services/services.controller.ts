import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
/*
@Controller({
  path: 'services',
  version: '1',
})
  */

@Controller('services')
export class ServicesController {
  constructor(private serviceService: ServicesService) {}
  @Get()
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Get()
  findOne(@Param() params): Promise<Service> {
    return this.serviceService.findOne(params.id);
  }

  @Post()
  create(@Body() service): Promise<Service> {
    return this.serviceService.create(service);
  }
}
