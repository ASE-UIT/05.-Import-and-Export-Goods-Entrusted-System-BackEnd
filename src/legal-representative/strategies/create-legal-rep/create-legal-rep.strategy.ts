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
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
