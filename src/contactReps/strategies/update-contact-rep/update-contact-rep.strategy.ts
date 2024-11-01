import { ContactRep } from '@/contactReps/models/contactReps.model';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateContactRepsStrategy } from './update-contact-rep-strategy.interface';
import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateContactRepsStrategy implements IUpdateContactRepsStrategy {
  async update(
    contactRepId: string,
    updateInfo: CreateContactRepDto,
  ): Promise<ContactRep> {
    try {
      const [affectedRows, [updateData]] = await ContactRep.update(
      { ...updateInfo },
      { where: { id: contactRepId }, returning: true },
      );
      return updateData.dataValues as ContactRep;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Contact representative not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
