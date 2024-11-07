import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateLclStrategy } from './create-lcls-strategy.interface';
import { CreateLclDto } from '@/lcls/dtos/create-lcls.dto';
import { LCL } from '@/lcls/models/lcls.model';
import { Freight } from '@/freights/models/freights.model';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';
import { Not } from 'sequelize-typescript';

@Injectable()
export class CreateLclStrategy implements ICreateLclStrategy {
  constructor(
    @InjectModel(LCL)
    private readonly lclModel: typeof LCL,
  ) {}

  async create(lclData: CreateLclDto): Promise<LCL> {
    try {
      const newLcl = await this.lclModel.create({
        cost: lclData.cost,
        freight_id: lclData.freight_id,
      });
      return newLcl;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}
