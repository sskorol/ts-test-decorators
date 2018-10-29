import { Severity } from 'allure2-js-commons';
import { suite, test } from 'mocha-typescript';
import { severity } from '../../../index';

@suite
class SeveritySubSuite {
  @severity(Severity.CRITICAL)
  @test
  shouldAssignDecoratedSeverity() {}
}
