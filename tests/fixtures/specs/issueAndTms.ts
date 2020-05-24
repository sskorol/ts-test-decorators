import { suite, test } from '@testdeck/mocha'
import { issue, testCaseId } from '../../../src'
import { BaseTest } from './baseTest'

@suite
class IssueAndTms extends BaseTest {
  @issue('4')
  @testCaseId('5')
  @test
  shouldAssignDecoratedIssueAndTms() {}
}
