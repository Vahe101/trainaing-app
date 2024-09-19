import { carTypes, colors } from 'src/common/constants.ts';

export const modelingCar = () => ({
  mileage: Math.floor(Math.random() * 300000),
  year: Math.floor(Math.random() * 30) + 1990,
  model: `Model_${Math.floor(Math.random() * 1000)}`,
  color: colors[Math.floor(Math.random() * colors.length)],
  type: carTypes[Math.floor(Math.random() * carTypes.length)],
  location: `POINT(${(Math.random() * 180 - 90).toFixed(6)} ${(Math.random() * 360 - 180).toFixed(6)})`,
});
