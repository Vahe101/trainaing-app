import { Controller, Get, Query } from '@nestjs/common';
import { Car } from '../entities';
import { CarService } from './car.service';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async getFilteredCars(
    @Query('type') type?: string,
    @Query('model') model?: string,
    @Query('color') color?: string,
    @Query('yearMin') yearMin?: number,
    @Query('yearMax') yearMax?: number,
    @Query('location') location?: string,
    @Query('mileageMin') mileageMin?: number,
    @Query('mileageMax') mileageMax?: number,
  ): Promise<Car[]> {
    return this.carService.getFilteredCars({
      type,
      model,
      location,
      mileageMin,
      mileageMax,
      yearMin,
      yearMax,
      color,
    });
  }
}
