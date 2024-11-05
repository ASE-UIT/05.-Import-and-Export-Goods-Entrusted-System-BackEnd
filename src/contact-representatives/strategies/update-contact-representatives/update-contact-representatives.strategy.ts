import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateContactRepsStrategy } from './update-contact-representatives-strategy.interface';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { UniqueConstraintError } from 'sequelize';
import { CreateContactRepDto } from '@/contact-representatives/dtos/create-contact-representatives.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateContactRepsStrategy implements IUpdateContactRepsStrategy {
  constructor(
    @InjectModel(ContactRep)
    private contactRepModel: typeof ContactRep,
  ) {}

  async update(
    contactRepId: string,
    updateInfo: CreateContactRepDto,
  ): Promise<ContactRep> {
    try {
      const [affectedRows, [updateData]] = await this.contactRepModel.update(
        { ...updateInfo },
        { where: { id: contactRepId }, returning: true },
      );

      if (affectedRows === 0) {
        throw new NotFoundException('Contact representative not found');
      }

      return updateData.dataValues as ContactRep;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Contact representative not found');
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

