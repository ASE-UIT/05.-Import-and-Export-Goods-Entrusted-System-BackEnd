import { Injectable } from '@nestjs/common';
import { IFindFirmRepsStrategy } from './find-firm-representatives-strategy.interface';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';

@Injectable()
export class FindAllFirmRepsStrategy implements IFindFirmRepsStrategy{
  async find(): Promise<FirmRep[] | null> {
    return FirmRep.findAll();
  }
}
