import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateFclStrategy } from './create-fcls-strategy.interface';
import { FCL } from '@/fcls/models/fcls.model'; 
import { Freight } from '@/freights/models/freights.model'; 
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { CreateFclDto } from '@/fcls/dtos/create-fcls.dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateFclStrategy implements ICreateFclStrategy {
  constructor(
    @InjectModel(FCL)
    private readonly fclModel: typeof FCL,
  ) {}

  async create(fclData: CreateFclDto): Promise<FCL> {
    try {
      const newFcl = await this.fclModel.create({
        price_20dc: fclData.price_20dc,
        price_20rf: fclData.price_20rf,
        price_40dc: fclData.price_40dc,
        price_40hc: fclData.price_40hc,
        price_40rf: fclData.price_40rf,
        freight_id: fclData.freight_id,
      });
      return newFcl;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Freight not found');
      }
    }
  }
}
