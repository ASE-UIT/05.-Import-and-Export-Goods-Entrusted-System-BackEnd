import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateLegalRepsStrategy } from './create-legal-rep-strategy.interface';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Customer } from '@/customers/models/customer.model';
import { CreateLegalRepDto } from '@/legal-representative/dtos/create-legal-rep.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class CreateLegalRepsStrategy implements ICreateLegalRepsStrategy {
  constructor(
    @InjectModel(LegalRep)
    private legalRepModel: typeof LegalRep,
  ) {}
  async create(legalRepData: CreateLegalRepDto): Promise<LegalRep> {
    try {
      const newLegalRep = await this.legalRepModel.create({
        name: legalRepData.name,
        email: legalRepData.email,
        phone: legalRepData.phone,
      });
      return newLegalRep;
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
