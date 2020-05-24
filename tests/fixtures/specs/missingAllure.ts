import { suite, test } from '@testdeck/mocha'
import { decorate, description } from '../../../src'
import { Allure } from 'allure-js-commons'

@suite
export class MissingAllure {
  // Emulate missing Allure instance
  before() {
    decorate((null as unknown) as Allure)
  }

  @description('Will not be handled without Allure instance')
  @test
  public shouldFailDecoratingMethodWithoutAllure() {}
}
