import { suite, test } from '@testdeck/mocha'
import { owner } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class Owner extends BaseTest {
  @owner('Sergey Korol')
  @test
  shouldAssignDecoratedOwner() {}
}
