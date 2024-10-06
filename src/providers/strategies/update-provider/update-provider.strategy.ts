import { Injectable } from '@nestjs/common';
import { IUpdateProviderStrategy } from './update-provider-strategy.interface';
import { UpdateProviderDto } from '@/providers/dtos/UpdateProviderDto';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class UpdateProviderStrategy implements IUpdateProviderStrategy {
  async update(
    providerId: string,
    updateInfo: UpdateProviderDto,
  ): Promise<Provider> {
    const [affectedRows, [updatedData]] = await Provider.update(
      { ...updateInfo },
      { where: { id: providerId }, returning: true },
    );

    if (affectedRows === 0) {
      throw new Error('Provider not found or no data changed');
    }

    return updatedData.dataValues as Provider;
  }
}
