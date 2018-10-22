import { suite, test } from 'mocha-typescript';
import { testCaseId } from '../../../index';

@suite
class TestCaseIdSuite {
  @testCaseId('2')
  @test
  shouldCallTestCaseIdOnReporter() {}
}
