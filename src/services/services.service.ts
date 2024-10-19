import { BadRequestException, Injectable } from '@nestjs/common';
import { Service } from './models/service.model';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { FindAllServiceStrategy } from './strategies/find-service/find-all.strategy';
import { FindServiceByFeeStrategy } from './strategies/find-service/find-by-fee.strategy';
import { FindServiceByNameStrategy } from './strategies/find-service/find-by-name.strategy';
import { FindServiceByShortNameStrategy } from './strategies/find-service/find-by-shortname.strategy';
import { CreateServiceStrategy } from './strategies/create-service/creata-service-strategy';
import { UpdateServiceStrategy } from './strategies/update-service/update-service.strategy';
import { FindServiceStrategy } from './strategies/find-service/find-service-strategy.enum';
import { IFindServiceStrategy } from './strategies/find-service/find-service-strategy.interface';

@Injectable()
export class ServicesService {
  constructor(
    private findAllServiceStrategy: FindAllServiceStrategy,
    private findServiceByFeeStrategy: FindServiceByFeeStrategy,
    private findServiceByNameStrategy: FindServiceByNameStrategy,
    private findServiceByShortNameStrategy: FindServiceByShortNameStrategy,
    private createServiceStrategy: CreateServiceStrategy,
    private updateServiceStrategy: UpdateServiceStrategy,
  ) {}

  async create(
    serviceInfo: CreateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    const createdService = await this.createServiceStrategy.create(serviceInfo);
    return { message: 'Service created', data: createdService };
  }

  find(strategy: FindServiceStrategy, serviceInfo: any): Promise<Service[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const service = findStrategy.find(serviceInfo);
    return service;
  }

  getFindStrategy(strategy: FindServiceStrategy): IFindServiceStrategy {
    switch (strategy) {
      case FindServiceStrategy.ALL:
        return this.findAllServiceStrategy;
      case FindServiceStrategy.NAME:
        return this.findServiceByNameStrategy;
      case FindServiceStrategy.SHORTNAME:
        return this.findServiceByShortNameStrategy;
      case FindServiceStrategy.FEE:
        return this.findServiceByFeeStrategy;
    }
  }

  async update(
    serviceID: string,
    updateInfo: Partial<CreateServiceDto>,
  ): Promise<{ message: string; data: Service }> {
    if (!Object.keys(updateInfo).length) {
      throw new BadRequestException('Body is empty');
    }
    const updatedResponse = await this.updateServiceStrategy.update(
      serviceID,
      updateInfo,
    );
    return { message: 'Service updated', data: updatedResponse };
  }
}
