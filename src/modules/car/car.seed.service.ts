import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { modelingCar } from 'src/utils';
import { Car } from './entities/car.entity';

@Injectable()
export class CarSeedService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async onModuleInit() {
    await this.seedCars();
  }

  private async seedCars() {
    const manager = this.carRepository.manager;

    const result = await manager.query(
      'SELECT pg_try_advisory_lock(123456789)',
    );
    if (!result[0].pg_try_advisory_lock) {
      console.log('Another pod is seeding the database. Exiting...');
      return;
    }

    for (let i = 0; i < 50000000; i++) {
      const newModel = modelingCar();
      const car = this.carRepository.create(newModel);
      await this.carRepository.save(car);
    }

    await manager.query('SELECT pg_advisory_unlock(123456789)');
    console.log('Data seeding complete.');
  }
}
