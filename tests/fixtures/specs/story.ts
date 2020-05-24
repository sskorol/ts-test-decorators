import { suite, test } from '@testdeck/mocha'
import { story } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class Story extends BaseTest {
  @story('Common decorated story')
  @test
  shouldAssignDecoratedStory() {}
}
