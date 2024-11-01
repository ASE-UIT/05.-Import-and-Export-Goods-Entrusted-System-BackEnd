import {
  Injectable
} from '@nestjs/common';
import { CreateContactRepsStrategy } from './strategies/create-contact-rep/create-contact-rep.strategy';
import { CreateContactRepDto } from './dtos/CreateContactRepDto';
import { ContactRep } from './models/contactReps.model';
import { UpdateContactRepsStrategy } from './strategies/update-contact-rep/update-contact-rep.strategy';
import { FindContactRepsByEmailStrategy } from './strategies/find-contact-rep/find-by-email.strategy';
import { FindContactRepsByNameStrategy } from './strategies/find-contact-rep/find-by-name.strategy';
import { FindContactRepsByPhoneStrategy } from './strategies/find-contact-rep/find-by-phone.strategy';
import { FindAllContactRepsStrategy } from './strategies/find-contact-rep/find-all.strategy';
import { FindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.enum';
import { IFindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.interface';

@Injectable()
export class ContactRepsService {
  constructor(
    private createContactRepStrategy: CreateContactRepsStrategy,
    private updateContactRepsStrategy: UpdateContactRepsStrategy,
    private findContactRepsByEmailStrategy: FindContactRepsByEmailStrategy,
    private findContactRepsByNameStrategy: FindContactRepsByNameStrategy,
    private findContactRepsByPhoneStrategy: FindContactRepsByPhoneStrategy,
    private findAllContactRepsStrategy: FindAllContactRepsStrategy,
  ) {}

  async createContactReps(contactRepData: CreateContactRepDto) {
    return await this.createContactRepStrategy.create(contactRepData);
  }

  async updateContactReps(contactRepId: string, updateData: CreateContactRepDto) {
    return await this.updateContactRepsStrategy.update(contactRepId, updateData);
  }

  getFindStrategy(strategy: FindContactRepsStrategy): IFindContactRepsStrategy {
    switch (strategy) {
      case FindContactRepsStrategy.ALL:
        return this.findAllContactRepsStrategy;
      case FindContactRepsStrategy.NAME:
        return this.findContactRepsByNameStrategy;
      case FindContactRepsStrategy.EMAIL:
        return this.findContactRepsByEmailStrategy;
      case FindContactRepsStrategy.PHONE:
        return this.findContactRepsByPhoneStrategy;
    }
  }

  async findContactReps(strategy: FindContactRepsStrategy, contactRepInfo: string): Promise<ContactRep[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const contactRep: ContactRep[] | null = await findStrategy.find(contactRepInfo);
    return contactRep;
  }
}
