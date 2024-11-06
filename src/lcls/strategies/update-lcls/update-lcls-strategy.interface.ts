import { CreateLclDto } from '@/lcls/dtos/create-lcls.dto';
import { LCL } from '@/lcls/models/lcls.model';

export interface IUpdateLclStrategy {
  update(
    lcl_id: string,
    updateInfo: Partial<CreateLclDto>,
  ): Promise<LCL>;
}