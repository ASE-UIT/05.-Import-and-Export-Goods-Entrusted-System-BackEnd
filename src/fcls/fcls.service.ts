import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateFclDto, UpdateFclDto } from './dtos/create-fcls.dto';
import { FCL } from './models/fcls.model';
import { CreateFclStrategy } from './strategies/create-fcls/create-fcls.strategy';
import { UpdateFclStrategy } from './strategies/update-fcls/update-fcls.strategy';
import { QueryFclDto } from './dtos/query-fcls.dto';

@Injectable()
export class FCLService {
  constructor(
    private createFclStrategy: CreateFclStrategy,
    private updateFclStrategy: UpdateFclStrategy,
  ) {}

  async find(fclInfo: QueryFclDto): Promise<FCL[]> {
    let fcl: FCL[];
    if (fclInfo) {
      fcl = await FCL.findAll({ where: fclInfo });
    } else {
      fcl = await FCL.findAll();
    }

    if (fcl.length > 0) return fcl;
    else throw new NotFoundException('FCL not found');
  }

  async create(fclInfo: CreateFclDto): Promise<FCL> {
    return await this.createFclStrategy.create(fclInfo);
  }

  async update(
    fcl_Id: string,
    updateInfo: UpdateFclDto,
  ): Promise<FCL> {
    const updatedResponse = await this.updateFclStrategy.update(
      fcl_Id,
      updateInfo,
    );
    return updatedResponse;
  }
}