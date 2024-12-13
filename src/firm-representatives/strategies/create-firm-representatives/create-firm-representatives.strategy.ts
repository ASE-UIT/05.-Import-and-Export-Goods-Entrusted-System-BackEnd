import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateFirmRepsStrategy } from './create-firm-representatives-strategy.interface';
import { CreateFirmRepDto } from '@/firm-representatives/dtos/create-firm-representatives.dto';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateFirmRepsStrategy implements ICreateFirmRepsStrategy{
  constructor(
    @InjectModel(FirmRep)
    private firmRepModel: typeof FirmRep,
  ) {}
  async create(firmRepData: CreateFirmRepDto): Promise<FirmRep> {
    try {
      const firmRep = await this.firmRepModel.create({
        name: firmRepData.name,
        email: firmRepData.email,
        phone: firmRepData.phone,
      });
      return firmRep;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }
}