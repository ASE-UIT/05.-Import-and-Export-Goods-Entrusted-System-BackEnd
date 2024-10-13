import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactRepsStrategy } from './strategies/create-contact-rep/create-contact-rep.strategy';
import { CreateContactRepDto } from './dtos/CreateContactRepDto';
import { Provider } from '@/providers/models/provider.model';
import { ContactRep } from './models/contactReps.model';
import { UpdateContactRepsStrategy } from './strategies/update-contact-rep/update-contact-rep.strategy';
import { FindContactRepsByProviderIdStrategy } from './strategies/find-contact-rep/find-by-provider-id.strategy';
import { FindContactRepsByEmailStrategy } from './strategies/find-contact-rep/find-by-email.strategy';
import { FindContactRepsByNameStrategy } from './strategies/find-contact-rep/find-by-name.strategy';
import { FindContactRepsByPhoneStrategy } from './strategies/find-contact-rep/find-by-phone.strategy';
import { FindAllContactRepsStrategy } from './strategies/find-contact-rep/find-all.strategy';
import { FindContactRepsStrategy } from './strategies/find-contact-rep/find-contact-rep-strategy.enum';

@Injectable()
export class ContactRepsService {
  constructor(
    private createContactRepStrategy: CreateContactRepsStrategy,
    private updateContactRepsStrategy: UpdateContactRepsStrategy,
    private findContactRepsByProviderIdStrategy: FindContactRepsByProviderIdStrategy,
    private findContactRepsByEmailStrategy: FindContactRepsByEmailStrategy,
    private findContactRepsByNameStrategy: FindContactRepsByNameStrategy,
    private findContactRepsByPhoneStrategy: FindContactRepsByPhoneStrategy,
    private findAllContactRepsStrategy: FindAllContactRepsStrategy,
  ) {}

  async createContactReps(contactRepData: CreateContactRepDto): Promise<ContactRep> {
    const providerExists = await this.checkProvider(contactRepData.providerId);
    const contactRepExists = await this.checkDuplicate(contactRepData.name);
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }
    if (contactRepExists) {
      throw new ConflictException('Contact representative already exists');
    }
    return await this.createContactRepStrategy.create(contactRepData);
  }
  async checkProvider(providerId: string): Promise<boolean> {
    const exists = await Provider.findOne({ where: { id: providerId } });
    return exists ? true : false;
  }
  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await ContactRep.findOne({ where: { name: name } });
    return exists ? true : false;
  }

  async updateContactReps(contactRepId: string, updateData: CreateContactRepDto) {
    if (Object.keys(updateData).length < 1)
      throw new BadRequestException('Body is empty');
    const contactRepExists = await this.checkContactRep(contactRepId);
    if (!contactRepExists) {
      throw new NotFoundException('Contact representative not found');
    }
    return await this.updateContactRepsStrategy.update(contactRepId, updateData);
  }
  async checkContactRep(id: string): Promise<boolean> {
    const exists = await ContactRep.findOne({ where: { id: id } });
    return exists ? true : false;
  }

  getFindStrategy(strategy: FindContactRepsStrategy) {
    switch (strategy) {
      case FindContactRepsStrategy.ALL:
        return this.findAllContactRepsStrategy;
      case FindContactRepsStrategy.NAME:
        return this.findContactRepsByNameStrategy;
      case FindContactRepsStrategy.EMAIL:
        return this.findContactRepsByEmailStrategy;
      case FindContactRepsStrategy.PHONE:
        return this.findContactRepsByPhoneStrategy;
      case FindContactRepsStrategy.PROVIDER_ID:
        return this.findContactRepsByProviderIdStrategy;
    }
  }
  async findContactReps(
    strategy: FindContactRepsStrategy,
    contactRepInfo: string,
  ): Promise<ContactRep[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const contactRep: ContactRep[] | null = await findStrategy.find(contactRepInfo);
    return contactRep;
  }
}
