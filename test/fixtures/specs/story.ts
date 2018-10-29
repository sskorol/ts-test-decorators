import { suite, test } from 'mocha-typescript';
import { story } from '../../../index';

@suite
class Story {
  @story('Common decorated story')
  @test
  shouldAssignDecoratedStory() {}
}
