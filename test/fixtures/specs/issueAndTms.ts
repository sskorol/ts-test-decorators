import { suite, test } from 'mocha-typescript';
import { issue, testCaseId } from '../../../index';

@suite
class IssueAndTms {
  @issue('4')
  @testCaseId('5')
  @test
  shouldAssignDecoratedIssueAndTms() {}
}
