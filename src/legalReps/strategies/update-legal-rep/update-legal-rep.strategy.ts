import { LegalRep } from '@/legalReps/models/legalReps.model';
import { Injectable } from '@nestjs/common';
import { IUpdateLegalRepsStrategy } from './update-legal-rep-strategy.interface';
import { UpdateLegalRepDto } from '@/legalReps/dtos/UpdateLegalRepDto';

@Injectable()
export class UpdateLegalRepsStrategy implements IUpdateLegalRepsStrategy {
  async update(
    legalRepId: string,
    updateInfo: UpdateLegalRepDto,
  ): Promise<LegalRep> {
    const [affectedRows, [updateData]] = await LegalRep.update(
      { ...updateInfo },
      { where: { id: legalRepId }, returning: true },
    );
    return updateData.dataValues as LegalRep;
  }
}
