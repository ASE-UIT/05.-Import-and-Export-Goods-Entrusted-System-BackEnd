import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Freight } from './models/freights.model';
import { Provider, ProviderStatus } from '@/providers/models/providers.model';
import { CreateFreightDto } from './dtos/create-freights.dto';
import { UpdateFreightDto } from './dtos/update-freights.dto';
import { CreateFreightStrategy } from './strategies/create-freights/create-freights.strategy';
import { UpdateFreightStrategy } from './strategies/update-freights/update-freights.strategy';
import { QueryFreightDto } from './dtos/query-freights.dto';

@Injectable()
export class FreightService {
  constructor(
    private createFreightStrategy: CreateFreightStrategy,
    private updateFreightStrategy: UpdateFreightStrategy,
    @InjectModel(Provider)
    private readonly providerRepository: typeof Provider,
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async find(freightInfo: QueryFreightDto): Promise<Freight[]> {
  const freight = await Freight.findAll({
    where: freightInfo || {}, 
    include: [
      {
        model: Provider,
        attributes: ['status'], 
      },
    ],
  });

  if (freight.length === 0) {
    throw new NotFoundException('Freight not found');
  }

  const activeFreight = freight.filter(f => f.provider?.status === 'active');
  const inactiveFreight = freight.filter(f => f.provider?.status === 'inactive');

  if (activeFreight.length === 0 && inactiveFreight.length > 0) {
    throw new ConflictException('Freight not available because all providers are inactive');
  }

  return activeFreight;
}


  async create(freightInfo: CreateFreightDto): Promise<Freight> {
    return await this.createFreightStrategy.create(freightInfo);
  }

  async update(
    freightId: string,
    updateInfo: UpdateFreightDto,
  ): Promise<Freight> {

    const updatedFreight = await this.updateFreightStrategy.update(
      freightId,
      updateInfo,
    );

    return updatedFreight;
  }
}
