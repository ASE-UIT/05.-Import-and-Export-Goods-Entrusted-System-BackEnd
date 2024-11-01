import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IUpdateProviderStrategy } from './update-provider-strategy.interface';
import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider } from '@/providers/models/provider.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateProviderStrategy implements IUpdateProviderStrategy {
  async update(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<Provider> {
    try {
      const [affectedRows, [updatedData]] = await Provider.update(
      { ...updateInfo },
      { where: { id: providerId }, returning: true },
      );
      return updatedData.dataValues as Provider;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Provider not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
