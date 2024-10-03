import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPointConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const pointRegex = /^POINT\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)$/;
    return typeof value === 'string' && pointRegex.test(value);
  }

  defaultMessage() {
    return 'Invalid POINT format. Expected format: POINT(x y)';
  }
}

export function IsPoint(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPoint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPointConstraint,
    });
  };
}
