import sequelize from 'sequelize';
import { Freight } from '@/freight/models/freight.model';
import {
  Column,
  BelongsTo,
  AllowNull,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'landFreight',
})
export class LandFreight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  land_freight_id: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_0_100: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_100_200: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_200_500: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_500_1500: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_1500_5000: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_5000_10000: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_10000: number;

  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string

  @BelongsTo(() => Freight)
  freight: Freight;
}
