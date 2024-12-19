import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateProviderStrategy } from './create-providers-strategy.interface';
import { CreateProviderDto } from '@/providers/dtos/create-providers.dto';
import { Provider } from '@/providers/models/providers.model';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError, ValidationErrorDetail } from '@/shared/classes/validation-error.class';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';

@Injectable()
export class CreateProviderStrategy implements ICreateProviderStrategy {
  constructor(
    @InjectModel(Provider)
    private providerModel: typeof Provider,
    @InjectModel(ContactRep)
    private contactRepModel: typeof ContactRep,
  ) {}

  async create(providerInfo: CreateProviderDto): Promise<Provider> {
    try {
      const newProvider = await this.providerModel.create({
        name: providerInfo.name,
        email: providerInfo.email,
        phone: providerInfo.phone,
        address: providerInfo.address,
        country: providerInfo.country,
        status: providerInfo.status,
        // contactRepId: providerInfo.contactRepId,
      });
      return newProvider;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
      // if (err instanceof ForeignKeyConstraintError) {
      //   throw new ConflictException('Contact representative not found');
      //}
    }
  }
}
