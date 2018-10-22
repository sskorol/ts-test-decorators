import { suite, test } from 'mocha-typescript';
import { story } from '../../../index';

@suite
class StorySuite {
  @story('3')
  @test
  shouldCallStoryOnReporter() {}
}
