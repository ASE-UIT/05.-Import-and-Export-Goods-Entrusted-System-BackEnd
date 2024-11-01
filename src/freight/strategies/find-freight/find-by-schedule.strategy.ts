import { Injectable } from '@nestjs/common';
import { Freight } from '@/freight/models/freight.model';
import { IFindFreightStrategy } from './find-freight-strategy.interface';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

@Injectable()
export class FindFreightByScheduleStrategy implements IFindFreightStrategy {
  async find(freightSchedule: WeekDay): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {schedule: freightSchedule},
    });
  }
}