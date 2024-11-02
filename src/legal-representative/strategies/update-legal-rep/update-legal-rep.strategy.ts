import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateLegalRepsStrategy } from './update-legal-rep-strategy.interface';
import { UniqueConstraintError } from 'sequelize';
import { CreateLegalRepDto } from '@/legal-representative/dtos/create-legal-rep.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UpdateLegalRepsStrategy implements IUpdateLegalRepsStrategy {
  constructor(
    @InjectModel(LegalRep)
    private legalRepModel: typeof LegalRep,
  ) {}
  async update(
    legalRepId: string,
    updateInfo: Partial<CreateLegalRepDto>,
  ): Promise<LegalRep> {
    try {
      const [affectedRows, [updateData]] = await this.legalRepModel.update(
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
