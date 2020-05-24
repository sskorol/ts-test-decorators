import { suite, test } from '@testdeck/mocha'
import { feature } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class Feature extends BaseTest {
  @feature('Decorated Feature')
  @test
  shouldAssignDecoratedFeature() {}
}
