import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateContactRepsStrategy } from './create-contact-representatives-strategy.interface';
import { CreateContactRepDto } from '@/contact-representatives/dtos/create-contact-representatives.dto';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateContactRepsStrategy implements ICreateContactRepsStrategy{
  constructor(
    @InjectModel(ContactRep)
    private contactRepModel: typeof ContactRep,
  ) {}
  async create(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    try {
      const contactRep = await this.contactRepModel.create({
        name: contactRepData.name,
        email: contactRepData.email,
        phone: contactRepData.phone,
      });
      return contactRep;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }
}