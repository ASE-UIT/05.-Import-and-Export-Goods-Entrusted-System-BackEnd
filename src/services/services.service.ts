import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { CreateServiceDto } from './dtos/CreateServiceDto';
import { UpdateServiceDto } from './dtos/UpdateServiceDto';
import { QueryServiceDto } from './dtos/QueryServiceDto';

@Injectable()
export class ServicesService {
  private services = []; // Mảng chứa các dịch vụ (giả định)

  constructor(
    @InjectModel(Service)
    private serviceModel: typeof Service,
  ) {}

  findAll(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await this.serviceModel.findOne({ where: { name } });
    return exists !== null;
  }

  // Tạo service mới
  async create(serviceInfo: CreateServiceDto): Promise<Service> {
    const serviceExists = await this.checkDuplicate(serviceInfo.name);

    if (!serviceExists) {
      return await this.serviceModel.create(serviceInfo);
    } else {
      throw new ConflictException('Service already exists');
    }
  }

  async findServices(query: QueryServiceDto): Promise<Service[]> {
    const whereClause = Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(whereClause).length === 0) {
      return this.serviceModel.findAll();
    }

    const services = await this.serviceModel.findAll({
      where: whereClause,
    });

    if (!services.length) {
      throw new NotFoundException('No services found');
    }

    return services;
  }

  // Cập nhật service theo id
  async update(id: string, updateServiceDto: UpdateServiceDto) {
    // Check if body is empty
    if (!Object.keys(updateServiceDto).length) {
      throw new BadRequestException('Body is empty');
    }
    const [numberOfAffectedRows, [updatedService]] =
      await this.serviceModel.update(
        {
          name: updateServiceDto.name,
          shortName: updateServiceDto.shortName,
          fee: updateServiceDto.fee,
        },
        {
          where: { serviceId: id },
          returning: true, // Trả về bản ghi đã cập nhật
        },
      );

    // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return { message: 'Service updated', data: updatedService }; // Trả về người dùng đã cập nhật
  }
}
