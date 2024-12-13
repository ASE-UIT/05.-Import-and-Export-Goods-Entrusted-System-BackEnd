import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateContactRepFirmRepDto } from '@/contact-representatives-firm-representatives/dtos/create-contact-firm-representatives.dto';
import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';
import { ICreateContactRepFirmRepStrategy } from './create-contact-firm-representatives-strategy.interface';

@Injectable()
export class CreateContactRepFirmRepStrategy implements ICreateContactRepFirmRepStrategy {
  constructor(
    @InjectModel(ContactRepFirmRep)
    private contactRepFirmRepModel: typeof ContactRepFirmRep,
  ) {}

  async create(contactRepFirmRepData: CreateContactRepFirmRepDto): Promise<ContactRepFirmRep> {
    try {
      const existingRelation = await this.contactRepFirmRepModel.findOne({
        where: {
          contactRepId: contactRepFirmRepData.contactRepId,
          firmRepId: contactRepFirmRepData.firmRepId,
        },
      });

      if (existingRelation) {
        throw new ConflictException('The relationship already exists.');
      }

      const contactRepFirmRep = await this.contactRepFirmRepModel.create({
        contactRepId: contactRepFirmRepData.contactRepId,
        firmRepId: contactRepFirmRepData.firmRepId,
      });

      return contactRepFirmRep;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
      throw err;
    }
  }
}
