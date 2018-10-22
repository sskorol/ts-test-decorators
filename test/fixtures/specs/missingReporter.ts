import { suite, test } from 'mocha-typescript';
import { feature, issue, severity, SeverityLevel, story, testCaseId } from '../../../index';

@suite
class MissingReporterSuite {
  @issue('4')
  @feature('Failed Feature')
  @severity(SeverityLevel.Critical)
  @story('5')
  @testCaseId('6')
  @test
  shouldNotApplyDecorators() {}
}
