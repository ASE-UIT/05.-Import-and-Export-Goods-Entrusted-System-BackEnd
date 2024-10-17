import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException
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

  async create(contactRepData: CreateContactRepDto): Promise<{message: string; data: ContactRep}> {
    const createdContactRep = await this.createContactRepStrategy.create(contactRepData);
    return {message: 'Contact representative created', data: createdContactRep};
  }

  async update(contactRepId: string, updateData: CreateContactRepDto): Promise<{message: string, data: ContactRep}> {
    if (Object.keys(updateData).length < 1)
      throw new BadRequestException('Body is empty');
    const updatedResponse = await this.updateContactRepsStrategy.update(
      contactRepId,
      updateData,
    );
    return {message: 'Contact representative updated', data: updatedResponse};
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

  find(
    strategy: FindContactRepsStrategy,
    contactRepInfo: string,
  ): Promise<ContactRep[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const contactRep = findStrategy.find(contactRepInfo);
    return contactRep;
  }
}
