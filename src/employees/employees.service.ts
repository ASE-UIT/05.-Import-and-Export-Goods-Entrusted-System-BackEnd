import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/CreateEmployeeDto';
import { Employee } from './models/employee.model';
import { UniqueConstraintError } from 'sequelize';

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
      await employee.save();
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }

      throw new InternalServerErrorException();
    }

    return employee;
  }

  async updateEmployee(
    employeeId: string,
    updateInfo: Partial<CreateEmployeeDto>,
  ) {
    const [affectedRows, [updatedEmployees]] = await Employee.update(
      updateInfo,
      {
        where: { id: employeeId },
        returning: true,
      },
    );

    if (affectedRows === 0) throw new NotFoundException('Employee not found');

    return {
      message: 'Employee updated successfully',
      data: updatedEmployees[0],
    };
  }
}
