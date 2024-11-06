import { LCL } from '@/lcls/models/lcls.model';
import { Injectable } from '@nestjs/common';
import { IFindLclStrategy } from './find-lcls-strategy.interface';

@Injectable()
export class FindLclByFreightIdStrategy implements IFindLclStrategy {
  async find(freight_id: String): Promise<LCL[] | null> {
    return LCL.findAll({
      where: { freight_id : freight_id },
    });
  }
}