import sequelize from 'sequelize';
import { Provider } from '@/providers/models/provider.model';
import{
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

export enum ShipmentType {
  SEA_FREIGHT = 'Sea Freight',
  AIR_FREIGHT = 'Air Freight',
  LAND_FREIGHT = 'Land Freight',
}

@Table({
  tableName: 'freight',
})
export class Freight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ForeignKey(() => Provider)
  @AllowNull(false)
  @Column
  providerId: string;

  @BelongsTo(() => Provider)
  provider: Provider;

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
}
