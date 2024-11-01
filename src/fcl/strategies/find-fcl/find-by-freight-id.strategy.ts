import { FCL } from '@/fcl/models/fcl.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcl-strategy.interface';

@Injectable()
export class FindFclByFreightIdStrategy implements IFindFclStrategy {
  async find(fclFreight_id: String): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {freight_id: fclFreight_id},
    });
  }
}