import { LegalRep } from '@/legalReps/models/legalReps.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateLegalRepsStrategy } from './update-legal-rep-strategy.interface';
import { CreateLegalRepDto } from '@/legalReps/dtos/CreateLegalRepDto';

@Injectable()
export class UpdateLegalRepsStrategy implements IUpdateLegalRepsStrategy {
  async update(
    legalRepId: string,
    updateInfo: Partial<CreateLegalRepDto>,
  ): Promise<LegalRep> {
    const [affectedRows, [updateData]] = await LegalRep.update(
      { ...updateInfo },
      { where: { id: legalRepId }, returning: true },
    );
    if (affectedRows === 0)
      throw new BadRequestException('Legal representative not found');
    return updateData.dataValues as LegalRep;
  }
}
