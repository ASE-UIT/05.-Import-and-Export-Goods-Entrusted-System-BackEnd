import { LCL } from '@/lcls/models/lcls.model';
import { Injectable } from '@nestjs/common';
import { IFindLclStrategy } from './find-lcls-strategy.interface';

@Injectable()
export class FindLclByCostStrategy implements IFindLclStrategy {
  async find(cost: number): Promise<LCL[] | null> {
    return LCL.findAll({
      where: { cost : cost },
    });
  }
}