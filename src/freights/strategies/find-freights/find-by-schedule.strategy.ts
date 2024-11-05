import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

@Injectable()
export class FindFreightByScheduleStrategy implements IFindFreightStrategy {
  async find(freightSchedule: WeekDay): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {schedule: freightSchedule},
    });
  }
}