import { LCL } from '@/lcl/models/lcl.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllLclStrategy {
  async find(): Promise<LCL[] | null> {
    return LCL.findAll();
  }
}