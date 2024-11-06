import sequelize from 'sequelize';
import { Freight } from '@/freight/models/freight.model';
import{
  Column,
  BelongsTo,
  AllowNull,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'seaFreight',
})
export class SeaFreight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  sea_freight_id: string;

  @AllowNull(false)
  @Column
  price_20dc: number;

  @AllowNull(false)
  @Column
  price_40dc: number;

  @AllowNull(false)
  @Column
  price_40hc: number;

  @AllowNull(false)
  @Column
  price_20rf: number;

  @AllowNull(false)
  @Column
  price_40rf: number;

  // @ForeignKey(() => Freight)
  // @AllowNull(false)
  // @Column
  // freight_id: string;

  // @BelongsTo(() => Freight)
  // freight: Freight;
}
