import { step } from '../../index';

export class User {
  readonly firstName: string;
  readonly lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @step('Get user full name')
  toString() {
    return `${this.firstName} ${this.lastName}`;
  }
}
