import { faker } from '@faker-js/faker';

export const getRandomColor = (): string => {
  return faker.color.human();
};
