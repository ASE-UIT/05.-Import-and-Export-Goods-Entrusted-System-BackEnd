import { Injectable } from '@nestjs/common';
import { IUpdateContactRepFirmRepStrategy } from './update-contact-firm-representatives-strategy.interface';
import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';
import { InjectModel } from '@nestjs/sequelize';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { CreateContactRepFirmRepDto } from '@/contact-representatives-firm-representatives/dtos/create-contact-firm-representatives.dto';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateContactRepFirmRepStrategy implements IUpdateContactRepFirmRepStrategy {
  constructor(
    @InjectModel(ContactRepFirmRep)
    private contactRepFirmRepModel: typeof ContactRepFirmRep,
  ) {}

  async update(
    id: string,
    updateData: Partial<CreateContactRepFirmRepDto>,
  ): Promise<ContactRepFirmRep> {
    const relation = await this.contactRepFirmRepModel.findByPk(id);

    if (!relation) {
      throw new NotFoundException('Contact representative and firm representative relation not found');
    }

    try {
      await relation.update(updateData);

      return relation;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
      throw new Error('An error occurred while updating the relation');
    }
  }
}
