import { suite, test } from 'mocha-typescript';
import { issue } from '../../../index';

@suite
class IssueSuite {
  @issue('1')
  @test
  shouldCallIssueOnReporter() {}
}
