import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { IUpdateServiceStrategy } from './update-service-strategy.interface';
import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';
import { Service } from '@/services/models/service.model';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateServiceStrategy implements IUpdateServiceStrategy {
  async update(
    serviceId: string,
    udpateInfo: Partial<CreateServiceDto>,
  ): Promise<Service> {
    try {
      const [affetedRows, [updateData]] = await Service.update(
        { ...udpateInfo },
        { where: { id: serviceId }, returning: true },
      );
      if (affetedRows === 0) {
        throw new BadRequestException("Service doesn't exist");
      }
      return updateData.dataValues as Service;
    } catch (err) {
      if (err instanceof UniqueConstraintError)
        throw new ConflictException(err.errors[0].message);
    }
  }
}
