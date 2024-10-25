import sequelize from 'sequelize';
import { Provider } from '@/providers/models/provider.model';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { SeaFreight } from '@/seaFreight/models/seaFreight.model';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { AirFreight } from '@/airFreight/models/airFreight.model';

export enum ShipmentType {
  SEA_FREIGHT = 'SEA_FREIGHT',
  AIR_FREIGHT = 'AIR_FREIGHT',
  LAND_FREIGHT = 'LAND_FREIGHT',
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
  freightType: ShipmentType;

  @AllowNull(false)
  @Column
  origin: string;

  @AllowNull(false)
  @Column
  destination: string;

  @Column
  transitTime: number;

  @Column
  transit: string;

  @AllowNull(false)
  @Column
  validFrom: Date;

  @AllowNull(false)
  @Column
  validUntil: Date;

  @Column
  note: string;

  @Column
  freeTime: number;

  @ForeignKey(() => Provider)
  @AllowNull(false)
  @Column
  providerId: string;

  @BelongsTo(() => Provider)
  provider: Provider;

  @HasMany(() => SeaFreight)
  seaFreight: SeaFreight[]

  @HasMany(() => LandFreight)
  landFreight: LandFreight[]

  @HasMany(() => AirFreight)
  airFreight: AirFreight[]
}
