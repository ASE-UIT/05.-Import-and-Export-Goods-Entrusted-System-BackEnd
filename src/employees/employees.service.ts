import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dtos/CreateEmployeeDto';
import { Employee } from './models/employee.model';
import { UniqueConstraintError } from 'sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@/roles/models/role.model';
import { User } from '@/users/models/user.model';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
  ) {}
  async createEmployee(employeeInfo: CreateEmployeeDto) {
    const employee = new Employee();
    employee.name = employeeInfo.name;
    employee.email = employeeInfo.email;
    employee.address = employeeInfo.address;
    employee.baseSalary = employeeInfo.baseSalary;
    employee.dob = employeeInfo.dob;
    employee.coefficientSalary = employeeInfo.coefficientSalary;
    employee.position = employeeInfo.position;
    employee.phone = employeeInfo.phone;

    try {
      return await employee.save();
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }

      throw new InternalServerErrorException();
    }
  }

  async updateEmployee(employeeId: string, updateInfo: UpdateEmployeeDto) {
    const [affectedRows, [updatedEmployees]] = await Employee.update(
      updateInfo,
      {
        where: { id: employeeId },
        returning: true,
      },
    );

    if (affectedRows === 0) throw new NotFoundException('Employee not found');

    return updatedEmployees[0];
  }

  async getAllEmployee(): Promise<Employee[]> {
    return await this.employeeModel.findAll({
      include: {
        model: User,
        attributes: ['roleId'],
        include: [
          {
            model: Role,
            attributes: ['name'],
          },
        ],
      },
    });
  }
}
