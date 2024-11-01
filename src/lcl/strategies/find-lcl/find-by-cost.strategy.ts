import { LCL } from '@/lcl/models/lcl.model';
import { Injectable } from '@nestjs/common';
import { IFindLclStrategy } from './find-lcl-strategy.interface';

@Injectable()
export class FindLclByCostStrategy implements IFindLclStrategy {
  async find(cost: number): Promise<LCL[] | null> {
    return LCL.findAll({
      where: { cost : cost },
    });
  }
}