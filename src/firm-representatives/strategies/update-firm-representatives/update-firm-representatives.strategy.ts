import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateFirmRepsStrategy } from './update-firm-representatives-strategy.interface';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { UniqueConstraintError } from 'sequelize';
import { CreateFirmRepDto } from '@/firm-representatives/dtos/create-firm-representatives.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateFirmRepsStrategy implements IUpdateFirmRepsStrategy {
  constructor(
    @InjectModel(FirmRep)
    private firmRepModel: typeof FirmRep,
  ) {}

  async update(
    firmRepId: string,
    updateInfo: CreateFirmRepDto,
  ): Promise<FirmRep> {
    const firmRep = await this.firmRepModel.findByPk(firmRepId);
    if (!firmRep) {
      throw new NotFoundException('Firm representative not found');
    }
    try {
      const [affectedRows, [updateData]] = await this.firmRepModel.update(
        { ...updateInfo },
        { where: { id: firmRepId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Firm representative not found');
      }

      return updateData.dataValues as FirmRep;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Firm representative not found');
      }
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }
}

