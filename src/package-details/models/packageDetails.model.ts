import { QuoteReqDetail } from "@/quote-request-details/models/quoteReqDetail.model";
import { ALL } from "dns";
import sequelize from "sequelize";
import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

export enum PackageType {
    // CONTAINER = 'CONTAINER',
    // DRUM = 'DRUM',
    // CRATE = 'CRATE',
    DRY = 'DRY',
    FREEZE = 'FREEZE'
}

@Table({
    tableName: 'package_details'
})
export class PackageDetail extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    id: string

    @AllowNull(false)
    @Column
    packageType: PackageType

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    weight: number

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    length: number

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    width: number

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    height: number

    // Associtations
    @ForeignKey(() => QuoteReqDetail)
    @AllowNull(false)
    @Column
    detailId: string

    @BelongsTo(() => QuoteReqDetail)
    quoteReqDetail: QuoteReqDetail
}