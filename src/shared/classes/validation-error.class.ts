import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({
    example: [
      { field: 'email', message: 'Invalid email format or duplicate email' },
    ],
  })
  errors: ValidationErrorDetail[];

  constructor(errors: ValidationErrorDetail[]) {
    this.message = 'Validation failed';
    this.errors = errors;
  }
}

export class ValidationErrorDetail {
  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({ example: 'Invalid email format or duplicate email' })
  message: string;

  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
}
