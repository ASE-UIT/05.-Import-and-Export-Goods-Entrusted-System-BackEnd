import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateContactRepsStrategy } from './strategies/create-contact-representatives/create-contact-representatives.strategy';
import { CreateContactRepDto } from './dtos/create-contact-representatives.dto';
import { ContactRep } from './models/contact-representatives.model';
import { UpdateContactRepsStrategy } from './strategies/update-contact-representatives/update-contact-representatives.strategy';
import { QueryContactRepDto } from './dtos/query-contact-representatives.dto';

@Injectable()
export class ContactRepsService {
  constructor(
    private createContactRepStrategy: CreateContactRepsStrategy,
    private updateContactRepsStrategy: UpdateContactRepsStrategy,
  ) {}

  async createContactReps(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    return await this.createContactRepStrategy.create(contactRepData);
  }

  async updateContactReps(contactRepId: string, updateData: CreateContactRepDto) {
    return await this.updateContactRepsStrategy.update(contactRepId, updateData);
  }

  async findContactReps(query: QueryContactRepDto): Promise<ContactRep[]> {
    let contactRep: ContactRep[];
    if (query) contactRep = await ContactRep.findAll({where: query});
    else contactRep = await ContactRep.findAll();

    if (contactRep.length > 0) return contactRep;
    else throw new NotFoundException('Contact representative not found');
  }
}
