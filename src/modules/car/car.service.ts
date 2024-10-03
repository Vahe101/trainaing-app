import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entities';
import { CarFilter } from './types';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async getFilteredCars(filter: CarFilter): Promise<Car[]> {
    const query = this.carRepository.createQueryBuilder('car');

    if (filter.type) {
      query.andWhere('car.type = :type', { type: filter.type });
    }

    if (filter.model) {
      query.andWhere('car.model LIKE :model', { model: `%${filter.model}%` });
    }

    if (filter.location) {
      query.andWhere(
        'ST_DWithin(car.location, ST_GeomFromText(:location, 4326), 0.1)',
        { location: filter.location },
      );
    }

    if (filter.mileageMin !== undefined) {
      query.andWhere('car.mileage >= :mileageMin', {
        mileageMin: filter.mileageMin,
      });
    }

    if (filter.mileageMax !== undefined) {
      query.andWhere('car.mileage <= :mileageMax', {
        mileageMax: filter.mileageMax,
      });
    }

    if (filter.yearMin !== undefined) {
      query.andWhere('car.year >= :yearMin', { yearMin: filter.yearMin });
    }

    if (filter.yearMax !== undefined) {
      query.andWhere('car.year <= :yearMax', { yearMax: filter.yearMax });
    }

    if (filter.color) {
      query.andWhere('car.color = :color', { color: filter.color });
    }

    return await query.getMany();
  }
}
