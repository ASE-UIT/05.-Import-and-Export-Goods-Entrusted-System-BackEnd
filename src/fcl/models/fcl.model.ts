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
    tableName: 'fcl',
})
export class FCL extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    fcl_id: string;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_20dc: number;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40dc: number;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40hc: number;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_20rf: number;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40rf: number;

    @ForeignKey(() => Freight)
    @AllowNull(false)
    @Column
    freight_id: string;

    @BelongsTo(() => Freight)
    freight: Freight;
}
