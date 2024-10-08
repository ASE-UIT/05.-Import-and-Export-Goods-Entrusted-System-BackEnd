import {
  BadRequestException,
  Get,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Quotation } from './models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateQuotationDto } from './dtos/CreateQuotationDto';
import { UpdateQuotationDto } from './dtos/UpdateQuotationDto';
import {
  QueryQuotationDto,
  QueryQuotationSchema,
} from './dtos/QueryQuotationDto';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation)
    private quotationModel: typeof Quotation,
  ) {}

  findAll(): Promise<Quotation[]> {
    return this.quotationModel.findAll();
  }

  findOne(id: string): Promise<Quotation> {
    return this.quotationModel.findOne({
      where: {
        id,
      },
    });
  }

  // Tạo Quotation mới
  async create(quotationInfo: CreateQuotationDto): Promise<Quotation> {
    return await this.quotationModel.create(quotationInfo);
  }

  async findQuotations(query: QueryQuotationDto): Promise<Quotation[]> {
    const whereClause = Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(whereClause).length === 0) {
      return this.quotationModel.findAll();
    }

    const quotations = await this.quotationModel.findAll({
      where: whereClause,
    });

    if (!quotations.length) {
      throw new NotFoundException('No quotations found');
    }

    return quotations;
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto) {
    if (!Object.keys(updateQuotationDto).length) {
      throw new BadRequestException('Body is empty');
    }
    const [numberOfAffectedRows, [updatedQuotation]] =
      await this.quotationModel.update(
        {
          totalPrice: updateQuotationDto.totalPrice,
          pickupDate: updateQuotationDto.pickupDate,
          deliveryDate: updateQuotationDto.deliveryDate,
          quotationDate: updateQuotationDto.quotationDate,
          expiredDate: updateQuotationDto.expiredDate,
        },
        {
          where: { quotationId: id },
          returning: true, // Trả về bản ghi đã cập nhật
        },
      );

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    return { message: 'Quotation updated', data: updatedQuotation };
  }
}
