import sequelize from 'sequelize';
import { Provider } from '@/providers/models/provider.model';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { AirFreight } from '@/airFreight/models/airFreight.model';
import { FCL } from '@/fcl/models/fcl.model';
import { LCL } from '@/lcl/models/lcl.model';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';

export enum FreightType {
  AIR = 'AIR',
  LAND = 'LAND',
  FCL = 'FCL',
  LCL = 'LCL'
}

@Table({
  tableName: 'freights',
})
export class Freight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  freightType: FreightType;

  @AllowNull(false)
  @Column
  origin: string;

  @AllowNull(false)
  @Column
  destination: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  transitTime: number;

  @Default(0)
  @Column({ type: DataType.FLOAT })
  additionFee: number

  @AllowNull(false)
  @Column
  validFrom: Date;

  @AllowNull(false)
  @Column
  validUntil: Date;

  @Column({ type: DataType.TEXT })
  addition_fee_breakdown: string;

  @AllowNull(false)
  @Column
  schedule: WeekDay;

  @ForeignKey(() => Provider)
  @AllowNull(false)
  @Column
  providerId: string;

  @BelongsTo(() => Provider)
  provider: Provider;

  @HasOne(() => LandFreight)
  landFreight: LandFreight

  @HasOne(() => AirFreight)
  airFreight: AirFreight

  @HasOne(() => FCL)
  fcl: FCL

  @HasOne(() => LCL)
  lcl: LCL
}