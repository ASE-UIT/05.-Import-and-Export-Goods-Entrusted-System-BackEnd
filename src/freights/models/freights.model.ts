import sequelize from 'sequelize';
import { Provider } from '@/providers/models/providers.model';
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
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { AirFreight } from '@/air-freights/models/air-freights.model';
import { FCL } from '@/fcls/models/fcls.model';
import { LCL } from '@/lcls/models/lcls.model';
import { WeekDay } from '@/shared/enums/freight-weekday.enum';
import { ApiProperty } from '@nestjs/swagger';

export enum FreightType {
  AIR = 'AIR',
  LAND = 'LAND',
  FCL = 'FCL',
  LCL = 'LCL'
}

@Table({
  tableName: 'freights',
  timestamps: false,
})
export class Freight extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  freightType: FreightType;

  @ApiProperty()
  @AllowNull(false)
  @Column
  origin: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  destination: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  transitTime: number;

  @ApiProperty()
  @Default(0)
  @Column({ type: DataType.FLOAT })
  additionFee: number

  @ApiProperty()
  @AllowNull(false)
  @Column
  validFrom: Date;

  @ApiProperty()
  @AllowNull(false)
  @Column
  validUntil: Date;

  @ApiProperty()
  @Column({ type: DataType.TEXT })
  addition_fee_breakdown: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  schedule: WeekDay;

  @ApiProperty()
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