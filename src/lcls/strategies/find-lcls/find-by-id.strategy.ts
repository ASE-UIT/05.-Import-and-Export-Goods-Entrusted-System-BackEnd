import { LCL } from '@/lcls/models/lcls.model';
import { Injectable } from '@nestjs/common';
import { IFindLclStrategy } from './find-lcls-strategy.interface';

@Injectable()
export class FindLclByIdStrategy implements IFindLclStrategy {
  async find(lcl_id: String): Promise<LCL[] | null> {
    return LCL.findAll({
      where: { id : lcl_id },
    });
  }
}