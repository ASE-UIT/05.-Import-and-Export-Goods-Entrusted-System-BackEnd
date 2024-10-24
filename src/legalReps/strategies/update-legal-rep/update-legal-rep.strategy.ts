import { LegalRep } from '@/legalReps/models/legalReps.model';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateLegalRepsStrategy } from './update-legal-rep-strategy.interface';
import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateLegalRepsStrategy implements IUpdateLegalRepsStrategy {
  async update(
    legalRepId: string,
    updateInfo: Partial<CreateLegalRepDto>,
  ): Promise<LegalRep> {
    try {
      const [affectedRows, [updateData]] = await LegalRep.update(
        { ...updateInfo },
        { where: { id: legalRepId }, returning: true },
      );
      return updateData.dataValues as LegalRep;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Legal representative not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
