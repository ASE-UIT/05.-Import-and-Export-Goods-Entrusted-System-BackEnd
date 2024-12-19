import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindContactRepsStrategy } from './find-contact-representatives-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindContactRepsByBranchLocationStrategy implements IFindContactRepsStrategy {
  async find(branchLocation: string): Promise<ContactRep[] | null> {
    return ContactRep.findAll({ where: { branch_location: branchLocation }, });
  }
}