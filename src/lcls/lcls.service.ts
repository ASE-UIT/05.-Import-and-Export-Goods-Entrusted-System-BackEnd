import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateLclDto, UpdateLclDto } from './dtos/create-lcls.dto';
import { LCL } from './models/lcls.model';
import { CreateLclStrategy } from './strategies/create-lcls/create-lcls.strategy';
import { FindLclStrategy } from './strategies/find-lcls/find-lcls-strategy.enum';
import { IFindLclStrategy } from './strategies/find-lcls/find-lcls-strategy.interface';
import { UpdateLclStrategy } from './strategies/update-lcls/update-lcls.strategy';
import { QueryLclDto } from './dtos/query-lcls.dto';

@Injectable()
export class LCLService {
  constructor(
    private createLclStrategy: CreateLclStrategy,
    private updateLclStrategy: UpdateLclStrategy,
  ) {}

  async find(lclInfo: QueryLclDto): Promise<LCL[]> {
    let lcl: LCL[];
    if (lclInfo) {
      lcl = await LCL.findAll({ where: lclInfo });
    } else {
      lcl = await LCL.findAll();
    }

    if (lcl.length > 0) return lcl;
    else throw new NotFoundException('LCL not found');
  }

  async create(lclInfo: CreateLclDto): Promise<LCL> {
    return await this.createLclStrategy.create(lclInfo);
  }

  async update(
    lcl_Id: string,
    updateInfo: UpdateLclDto,
  ): Promise<LCL> {
    const updatedResponse = await this.updateLclStrategy.update(
      lcl_Id,
      updateInfo,
    );
    return updatedResponse;
  }
}