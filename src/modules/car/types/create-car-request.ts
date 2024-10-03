import {
  IsInt,
  IsEnum,
  IsNumber,
  IsString,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { IsPoint } from 'src/common';

export enum CarTypes {
  CARGO = 'cargo',
  SEDAN = 'sedan',
  BICYCLE = 'bicycle',
  HATCHBACK = 'hatchback',
  MOTORCYCLE = 'motorcycle',
}

export class CreateMockCarRequest {
  quantity: number;
}

export class CreateCarRequest {
  @IsEnum(CarTypes)
  type: CarTypes;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsPoint({ message: 'Location must be a valid POINT format.' })
  location: string;

  @IsNumber()
  @IsPositive()
  mileage: number;

  @IsInt()
  @IsNumber()
  @IsPositive()
  year: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}
