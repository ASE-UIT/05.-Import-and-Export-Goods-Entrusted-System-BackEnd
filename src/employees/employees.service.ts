import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/CreateEmployeeDto';
import { Employee } from './models/employee.model';

@Injectable()
export class EmployeesService {
  async createEmployee(employeeInfo: CreateEmployeeDto) {
    // Check employee email
    const existingEmail = await Employee.findOne({
      where: { email: employeeInfo.email },
    });

    if (existingEmail)
      throw new ConflictException('Email already bounded to another employee');

    const employee = new Employee();
    employee.name = employeeInfo.name;
    employee.email = employeeInfo.email;
    employee.address = employeeInfo.address;
    employee.baseSalary = employeeInfo.baseSalary;
    employee.dob = employeeInfo.dob;
    employee.coefficientSalary = employeeInfo.coefficientSalary;
    employee.position = employeeInfo.position;
    employee.phone = employeeInfo.phone;

    return await employee.save();
  }
}
