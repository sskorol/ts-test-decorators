import { suite, test } from '@testdeck/mocha'
import { epic } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class Epic extends BaseTest {
  @epic('Epic Name')
  @test
  shouldAssignDecoratedEpic() {}
}
