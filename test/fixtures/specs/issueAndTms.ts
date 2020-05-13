import { suite, test } from 'mocha-typescript';
import { issue, setPmsUrl, setTmsUrl, testCaseId } from '../../../index';

setPmsUrl('http://pms-url');
setTmsUrl('http://tms-url');

@suite
class IssueAndTms {
  @issue('4')
  @testCaseId('5')
  @test
  shouldAssignDecoratedIssueAndTms() {}
}
