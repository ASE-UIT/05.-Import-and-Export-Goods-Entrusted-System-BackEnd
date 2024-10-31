import { AirFreight } from '@/airFreight/models/airFreight.model';
import { Contract } from '@/contracts/models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { Freight, FreightType } from '@/freight/models/freight.model';
import { LandFreight } from '@/landFreight/models/landFreight.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';
import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import sequelize from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasMany,
  DataType,
  Default,
  AllowNull,
  BeforeCreate,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

@Table({ tableName: 'quotations' })
export class Quotation extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  totalPrice: number;

  @AllowNull(false)
  @Column
  pickupDate: Date;

  @AllowNull(false)
  @Column
  deliveryDate: Date;

  @AllowNull(false)
  @Column
  quotationDate: Date;

  @AllowNull(false)
  @Column
  expiredDate: Date;

  @AllowNull(false)
  @Column
  status: QuotationStatus;


  //Association
  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];

  @ForeignKey(() => QuotationReq)
  @AllowNull(false)
  @Column
  quoteReqId: string

  @BelongsTo(() => QuotationReq)
  quotationReq: QuotationReq

  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freightId: string

  @BelongsTo(() => Freight)
  freight: Freight

  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string

  @BelongsTo(() => Employee)
  employee: Employee

  // @HasOne(() => Contract)
  // contract: Contract

  // @BeforeCreate
  // static async calculateTotal(quotation: Quotation) {
  //   const quotationReq = await QuotationReq.findByPk(quotation.quoteReqId, {
  //     include: [{
  //       model: QuoteReqDetail,
  //       include: [PackageDetail]
  //     }]
  //   })

  //   const freight = await Freight.findByPk(quotation.freightId, {
  //     include: [SeaFreight, LandFreight, AirFreight]
  //   })

  //   if (!quotationReq) throw new Error('QuoteReq not found')

  //   const packageDetail = quotationReq.quoteReqDetails[0].packageDetails[0].dataValues

  //   let freightCost = 0
  //   if (freight.freightType == ShipmentType.SEA_FREIGHT) {
  //     freightCost = freight.seaFreight.reduce((acc, sea) => acc + sea.price_20dc, 0);
  //     console.log("Go to sea")
  //   } else if (freight.freightType == ShipmentType.LAND_FREIGHT) {

  //     const weight = packageDetail.weight
  //     if (weight >= 100 && weight < 200) {
  //       freightCost = weight * freight.landFreight[0].price_100_200
  //     } else if (weight >= 200 && weight < 500) {
  //       freightCost = weight * freight.landFreight[0].price_200_500
  //     } else if (weight >= 500 && weight < 1500) {
  //       freightCost = weight * freight.landFreight[0].price_500_1500
  //     } else if (weight >= 1500 && weight < 5000) {
  //       freightCost = weight * freight.landFreight[0].price_1500_5000
  //     } else if (weight >= 5000 && weight < 10000) {
  //       freightCost = weight * freight.landFreight[0].price_5000_10000
  //     } else if (weight >= 10000) {
  //       freightCost = weight * freight.landFreight[0].price_10000
  //     } else {
  //       throw new HttpException("Trọng lượng không hợp lệ. Phải lớn hơn hoặc bằng 100kg.", HttpStatus.BAD_REQUEST);
  //     }
  //   } else if (freight.freightType == ShipmentType.AIR_FREIGHT) {

  //     const weight = packageDetail.weight
  //     if (weight >= 45 && weight <= 100) {
  //       freightCost = weight * freight.airFreight[0].price_45K
  //     } else if (weight > 100 && weight <= 300) {
  //       freightCost = weight * freight.airFreight[0].price_100K
  //     } else if (weight > 300 && weight <= 500) {
  //       freightCost = weight * freight.airFreight[0].price_300K
  //     } else if (weight > 500) {
  //       freightCost = weight * freight.airFreight[0].price_500K
  //     } else {
  //       throw new HttpException("Trọng lượng không hợp lệ. Phải từ 45 - 500kg.", HttpStatus.BAD_REQUEST);
  //     }
  //   }

  //   quotation.totalPrice = freightCost
  // }
}
