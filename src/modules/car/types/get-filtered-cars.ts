export interface CarFilter {
  type?: string;
  model?: string;
  location?: string;
  mileageMin?: number;
  mileageMax?: number;
  yearMin?: number;
  yearMax?: number;
  color?: string;
}
