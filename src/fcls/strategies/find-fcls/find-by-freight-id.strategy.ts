import { FCL } from '@/fcls/models/fcls.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcls-strategy.interface';

@Injectable()
export class FindFclByFreightIdStrategy implements IFindFclStrategy {
  async find(fclFreight_id: String): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {freight_id: fclFreight_id},
    });
  }
}