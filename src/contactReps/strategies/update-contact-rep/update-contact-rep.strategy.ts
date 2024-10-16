import { ContactRep } from '@/contactReps/models/contactReps.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateContactRepsStrategy } from './update-contact-rep-strategy.interface';
import { CreateContactRepDto } from '@/contactReps/dtos/CreateContactRepDto';

@Injectable()
export class UpdateContactRepsStrategy implements IUpdateContactRepsStrategy {
  async update(
    contactRepId: string,
    updateInfo: CreateContactRepDto,
  ): Promise<ContactRep> {
    const [affectedRows, [updateData]] = await ContactRep.update(
      { ...updateInfo },
      { where: { id: contactRepId }, returning: true },
    );

    if (affectedRows === 0)
      throw new BadRequestException("Contact representitive doesn't exist");
    return updateData.dataValues as ContactRep;
  }
}
