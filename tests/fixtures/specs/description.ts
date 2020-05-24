import { suite, test } from '@testdeck/mocha'
import { description } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class Description extends BaseTest {
  @description('Decorated description')
  @test
  shouldAssignDecoratedDescription() {}
}
