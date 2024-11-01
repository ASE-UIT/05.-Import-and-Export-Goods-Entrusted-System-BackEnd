import { CreateLclDto } from '@/lcl/dtos/CreateLclDto';
import { LCL } from '@/lcl/models/lcl.model';

export interface IUpdateLclStrategy {
  update(
    lcl_id: string,
    updateInfo: Partial<CreateLclDto>,
  ): Promise<LCL>;
}