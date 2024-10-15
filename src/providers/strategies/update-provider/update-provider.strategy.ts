import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateProviderStrategy } from './update-provider-strategy.interface';
import { CreateProviderDto } from '@/providers/dtos/CreateProviderDto';
import { Provider } from '@/providers/models/provider.model';

@Injectable()
export class UpdateProviderStrategy implements IUpdateProviderStrategy {
  async update(
    providerId: string,
    updateInfo: Partial<CreateProviderDto>,
  ): Promise<Provider> {
    const [affectedRows, [updatedData]] = await Provider.update(
      { ...updateInfo },
      { where: { id: providerId }, returning: true },
    );

    if (affectedRows === 0)
      throw new BadRequestException("Provider doesn't exist");
    return updatedData.dataValues as Provider;
  }
}
