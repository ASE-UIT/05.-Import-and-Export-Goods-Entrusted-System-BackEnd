import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id') id: number, @Body() service: Service): Promise<[number, Service[]]> {
    return this.serviceService.update(id, service);
  }


}
