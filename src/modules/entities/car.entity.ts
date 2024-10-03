import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  model: string;

  @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
  location: string;

  @Column()
  mileage: number;

  @Column()
  year: number;

  @Column()
  color: string;
}
