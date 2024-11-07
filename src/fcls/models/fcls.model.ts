import sequelize from 'sequelize';
import { Freight } from '@/freights/models/freights.model';
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
import { ApiProperty } from '@nestjs/swagger';

@Table({
    tableName: 'fcl',
})
export class FCL extends Model {
    @ApiProperty()
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    fcl_id: string;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_20dc: number;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40dc: number;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40hc: number;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_20rf: number;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    price_40rf: number;

    @ApiProperty()
    @ForeignKey(() => Freight)
    @AllowNull(false)
    @Column
    freight_id: string;

    @BelongsTo(() => Freight)
    freight: Freight;
}
