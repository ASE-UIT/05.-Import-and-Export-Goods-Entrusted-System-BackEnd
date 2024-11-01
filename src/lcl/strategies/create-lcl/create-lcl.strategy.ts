import { Freight } from '@/freight/models/freight.model';
import { CreateLclDto } from '@/lcl/dtos/CreateLclDto';
import { LCL } from '@/lcl/models/lcl.model';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { ICreateLclStrategy } from './create-lcl-strategy.interface';


@Injectable()
export class CreateLclStrategy implements ICreateLclStrategy {
  constructor(
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async create(lclData: CreateLclDto): Promise<LCL> {
    const freight = await this.freightRepository.findByPk(lclData.freight_id);
    if (!freight) {
      throw new NotFoundException('Freight not found');
    }
    const lcl = new LCL();
    lcl.cost = lclData.cost;
    lcl.freight_id = lclData.freight_id;

    try {
      await lcl.save();
      return lcl;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      throw new ConflictException('Failed to create LCL');
    }
  }
}
