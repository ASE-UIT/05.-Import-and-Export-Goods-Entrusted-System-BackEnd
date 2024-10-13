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

  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string;

  @BelongsTo(() => Freight)
  freight: Freight;

  @AllowNull(false)
  @Column
  '20DC': number;

  @AllowNull(false)
  @Column
  '40DC': number;

  @AllowNull(false)
  @Column
  '40HC': number;

  @AllowNull(false)
  @Column
  '20RF': number;

  @AllowNull(false)
  @Column
  '40RF': number;
}
