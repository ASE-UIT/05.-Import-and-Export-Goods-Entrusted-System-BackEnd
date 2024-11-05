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

@Injectable()
export class EmployeesService {
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
}
