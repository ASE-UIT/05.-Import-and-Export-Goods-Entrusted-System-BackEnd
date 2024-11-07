import { AirFreight } from '@/air-freights/models/air-freights.model';
import { Contract } from '@/contracts/models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { FCL } from '@/fcls/models/fcls.model';
//import { Freight, FreightType} from '@/freights/models/freights.model';
import { Freight, FreightType } from '@/freights/models/freights.model';
import { LCL } from '@/lcls/models/lcls.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
//import { Freight, FreightType } from '@/freights/models/freights.model';
import { LandFreight } from '@/land-freights/models/land-freights.model';
import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { Service } from '@/services/models/service.model';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
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
import { from } from 'rxjs';

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
  //       include: [{ model: PackageDetail }],
  //     }],
  //     raw: true,
  //     nest: true
  //   })

  //   const freight = await Freight.findByPk(quotation.freightId, {
  //     include: [{ model: LandFreight }, { model: AirFreight }, { model: FCL }, { model: LCL }],
  //     raw: true,
  //     nest: true
  //   })

  //   if (!quotationReq) throw new NotFoundException('Quote Request not found')
  //   if (!freight) throw new NotFoundException('Freight not found')
  //   const packageDetail = quotationReq.quoteReqDetails.packageDetails

  //   let freightCost = 0
  //   const weight = packageDetail.weight
  //   if (freight.freightType == FreightType.LCL) {
  //     const vol = packageDetail.length * packageDetail.width * packageDetail.height
  //     const choose = Math.max(weight / 1000, vol)
  //     freightCost = freight.lcl.cost * choose
  //   } else if (freight.freightType == FreightType.FCL) {
  //     freightCost = 9999
  //   } else if (freight.freightType == FreightType.LAND) {
  //     if (!freight.landFreight) throw new NotFoundException('Land price not found')
  //     if (weight >= 0 && weight < 100) {
  //       freightCost = weight * freight.landFreight.price_0_100
  //     } else if (weight >= 100 && weight < 200) {
  //       freightCost = weight * freight.landFreight.price_100_200
  //     } else if (weight >= 200 && weight < 500) {
  //       freightCost = weight * freight.landFreight.price_200_500
  //     } else if (weight >= 500 && weight < 1500) {
  //       freightCost = weight * freight.landFreight.price_500_1500
  //     } else if (weight >= 1500 && weight < 5000) {
  //       freightCost = weight * freight.landFreight.price_1500_5000
  //     } else if (weight >= 5000 && weight < 10000) {
  //       freightCost = weight * freight.landFreight.price_5000_10000
  //     } else if (weight >= 10000) {
  //       freightCost = weight * freight.landFreight.price_10000
  //     } else {
  //       throw new BadRequestException('Package weight is invalid')
  //     }
  //   } else if (freight.freightType == FreightType.AIR) {
  //     if (!freight.airFreight) throw new NotFoundException('Air price not found')
  //     if (weight >= 0 && weight < 45) {
  //       freightCost = weight * freight.airFreight.price_0K
  //     } else if (weight >= 45 && weight <= 100) {
  //       freightCost = weight * freight.airFreight.price_45K
  //     } else if (weight > 100 && weight <= 300) {
  //       freightCost = weight * freight.airFreight.price_100K
  //     } else if (weight > 300 && weight <= 500) {
  //       freightCost = weight * freight.airFreight.price_300K
  //     } else if (weight > 500) {
  //       freightCost = weight * freight.airFreight.price_500K
  //     } else {
  //       throw new HttpException("Package weight is invalid", HttpStatus.BAD_REQUEST);
  //     }
  //   }

  // const quotationServices = await QuotationService.findAll({
  //   where: { quotation_id: quotation.id },
  //   include: [{ model: Service, attributes: ['id', 'fee'] }],
  //   raw: true,
  //   nest: true
  // })
  // console.log("Check quotationServices: ", quotationServices)

  //   quotation.totalPrice = freightCost + freight.additionFee
  // }
}
